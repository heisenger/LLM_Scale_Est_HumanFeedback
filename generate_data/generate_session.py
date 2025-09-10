import csv, json, os, sys

# ======== SETTINGS ========
LIMIT = 20  # first N rows per CSV

RANGE_FILES = {
    "Range 1": {
        "line_length_ratio": "experiments/line_length_ratio/line_len_ratio_0.1_0.5_100samples.csv",
        "marker_location": "experiments/marker_location/marker_loc_0.1_0.5_100samples.csv",
        "maze_distance": "experiments/maze_distance/maze_distance_1.0_5.0_100samples.csv",
        "subtitle": "experiments/subtitle_duration/1.0_8.0_100samples.csv",
    },
    "Range 2": {
        "line_length_ratio": "experiments/line_length_ratio/line_len_ratio_0.3_0.8_100samples.csv",
        "marker_location": "experiments/marker_location/marker_loc_0.3_0.8_100samples.csv",
        "maze_distance": "experiments/maze_distance/maze_distance_3.0_7.0_100samples.csv",
        "subtitle": "experiments/subtitle_duration/5.0_20.0_100samples.csv",  # if exists
    },
    "Range 3": {
        "line_length_ratio": "experiments/line_length_ratio/line_len_ratio_0.5_0.9_100samples.csv",
        "marker_location": "experiments/marker_location/marker_loc_0.5_0.9_100samples.csv",
        "maze_distance": "experiments/maze_distance/maze_distance_5.0_9.0_100samples.csv",
        "subtitle": "experiments/subtitle_duration/15.0_50.0_100samples.csv",
    },
}

SESSIONS_PLAN = [
    {
        "file": "sessions/session1.json",
        "title": "Session 1: Text+Image - Base",
        "intro": "You will see text + image trials. Click Continue when ready.",
        "session_label": "Session 1",
        "range": "Range 1",
        "image_field_mode": "normal",
        "blocks": [
            {
                "condition": "Text+Image - Base",
                "task": "Line length ratio",
                "type": "both",
                "task_key": "line_length_ratio",
            },
            {
                "condition": "Text+Image - Base",
                "task": "Marker Location",
                "type": "both",
                "task_key": "marker_location",
            },
            {
                "condition": "Text+Image - Base",
                "task": "Maze Distance",
                "type": "both",
                "task_key": "maze_distance",
            },
            {
                "condition": "Text+Image - Base",
                "task": "Subtitle",
                "type": "text",
                "task_key": "subtitle",
            },
        ],
        "break_after": False,
    },
    {
        "file": "sessions/session2.json",
        "title": "Session 2: Image - Noised",
        "intro": "You will see image-only trials (noised). Click Continue when ready.",
        "session_label": "Session 2",
        "range": "Range 2",
        "image_field_mode": "blurred",
        "blocks": [
            {
                "condition": "Image - Noised",
                "task": "Line length ratio",
                "type": "image",
                "task_key": "line_length_ratio",
            },
            {
                "condition": "Image - Noised",
                "task": "Marker Location",
                "type": "image",
                "task_key": "marker_location",
            },
            {
                "condition": "Image - Noised",
                "task": "Maze Distance",
                "type": "image",
                "task_key": "maze_distance",
            },
        ],
        "break_after": True,
    },
    {
        "file": "sessions/session3.json",
        "title": "Session 3: Text+Image - Cue-ed",
        "intro": "You will see text + image with cues. Click Continue when ready.",
        "session_label": "Session 3",
        "range": "Range 3",
        "image_field_mode": "normal",
        "blocks": [
            {
                "condition": "Text+Image - Cue-ed",
                "task": "Line length ratio",
                "type": "both",
                "task_key": "line_length_ratio",
            },
            {
                "condition": "Text+Image - Cue-ed",
                "task": "Marker Location",
                "type": "both",
                "task_key": "marker_location",
            },
            {
                "condition": "Text+Image - Cue-ed",
                "task": "Maze Distance",
                "type": "both",
                "task_key": "maze_distance",
            },
        ],
        "break_after": False,
    },
]
# ======== END SETTINGS ========

OUT_DIR = "sessions"


def detect_header_indexes(header):
    h = [(c or "").strip().lower() for c in header]

    def find(*names):
        for n in names:
            if n in h:
                return h.index(n)
        return None

    return {
        "image": find("image_path"),
        "blurred": find("blurred_image_path", "blurred", "noised_image_path"),
        "ascii": find("text", "ascii_line", "path_text_description"),
        "truth": find("actual_duration", "actual_length"),
        "type": find("type", "modality"),
        "sample_id": find("sample_id"),
    }


def load_csv_first_n(csv_path, n):
    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.reader(f))
    if not rows:
        return [], []
    header = rows[0]
    lower = [(c or "").lower() for c in header]
    looks_like_header = any(
        tok in ",".join(lower)
        for tok in [
            "image",
            "ascii",
            "true",
            "blurred",
            "text",
            "value",
            "label",
            "target",
        ]
    )
    data = rows[1:] if looks_like_header else rows
    return data[:n], (header if looks_like_header else [])


def coerce_truth(v):
    v = (v or "").strip()
    if v == "":
        return ""
    try:
        return float(v)
    except:
        return v


def build_trial(row, idx, task_key, prefer_blurred=False, forced_type=None):
    # choose image path
    img = ""
    if prefer_blurred and idx["blurred"] is not None:
        img = (row[idx["blurred"]] or "").strip()
        if not img and idx["image"] is not None:
            img = (row[idx["image"]] or "").strip()
    else:
        if idx["image"] is not None:
            img = (row[idx["image"]] or "").strip()

    # --- NEW: always prefix with experiments/<task_key>/ if not empty ---
    if img:
        img = f"experiments/{task_key}/{img}"

    ascii_art = (row[idx["ascii"]] if idx["ascii"] is not None else "") or ""
    truth_val = coerce_truth(row[idx["truth"]]) if idx["truth"] is not None else ""
    sample_id = (row[idx["sample_id"]] if idx["sample_id"] is not None else "").strip()

    # decide type
    row_type = ""
    if idx["type"] is not None and row[idx["type"]]:
        row_type = (row[idx["type"]] or "").strip().lower()
    if not row_type:
        if forced_type:
            row_type = forced_type
        else:
            has_a = bool(ascii_art)
            has_i = bool(img)
            row_type = (
                "both"
                if (has_a and has_i)
                else ("text" if has_a else ("image" if has_i else "text"))
            )

    return {
        "type": row_type,
        "ascii_art": ascii_art if row_type in ("text", "both") else "",
        "image_path": img if row_type in ("image", "both") else "",
        "true_value": truth_val,
        "sample_id": sample_id,
    }


def block_from_csv(
    csv_path, label_meta, task_key, prefer_blurred=False, forced_type=None
):
    if not csv_path or not os.path.exists(csv_path):
        return []
    data, header = load_csv_first_n(csv_path, LIMIT)
    if not data:
        return []
    idx = detect_header_indexes(header if header else [])
    trials = []
    for r in data:
        tr = build_trial(
            r, idx, task_key, prefer_blurred=prefer_blurred, forced_type=forced_type
        )
        tr["block_name"] = (
            f'{label_meta["condition"]} | {label_meta["task"]} | {label_meta["range"]}'
        )
        tr["__meta"] = dict(label_meta)
        trials.append(tr)
    return trials


def session_json(title, intro, blocks, add_break=False):
    trials = [{"type": "instruction", "title": title, "text": intro}]
    for b in blocks:
        trials.extend(block_from_csv(**b))  # now has task_key included
    if add_break:
        trials.append(
            {
                "type": "instruction",
                "title": "Break",
                "text": "Take a short break. Click Continue when ready.",
            }
        )
    return {"title": title, "trials": trials}


def csv_for(task_key, range_name):
    return RANGE_FILES.get(range_name, {}).get(task_key, None)


def make_blocks_for_session(sess):
    prefer_blurred = sess.get("image_field_mode") == "blurred"
    blocks = []
    for b in sess["blocks"]:
        csv_path = csv_for(b["task_key"], sess["range"])
        if not csv_path or not os.path.exists(csv_path):
            continue
        blocks.append(
            {
                "csv_path": csv_path,
                "label_meta": {
                    "session": sess["session_label"],
                    "condition": b["condition"],
                    "task": b["task"],
                    "range": sess["range"],
                },
                "task_key": b["task_key"],  # <-- pass down here
                "prefer_blurred": prefer_blurred,
                "forced_type": b["type"],
            }
        )
    return blocks


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for sess in SESSIONS_PLAN:
        blocks = make_blocks_for_session(sess)
        payload = session_json(
            sess["title"],
            sess["intro"],
            blocks,
            add_break=sess.get("break_after", False),
        )
        with open(sess["file"], "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        print(
            f'Wrote {sess["file"]}  ({len(payload["trials"])} trials incl. instructions)'
        )


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Error:", e, file=sys.stderr)
        sys.exit(1)
