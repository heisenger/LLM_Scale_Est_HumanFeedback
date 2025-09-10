# generate_data/generate_blocks.py
# Python 3.x (no external deps)

import csv, json, os, sys

LIMIT = 20  # first N rows per CSV

# ---- Your files per range (from your layout) ----
RANGE_FILES = {
    "Range 1": {
        "line_length_ratio": "experiments/line_length_ratio/line_len_ratio_0.1_0.5_100samples.csv",
        "marker_location": "experiments/marker_location/marker_loc_0.1_0.5_100samples.csv",
        "maze_distance": "experiments/maze_distance/maze_distance_1.0_5.0_100samples.csv",
        "subtitle_duration": "experiments/subtitle_duration/1.0_8.0_100samples.csv",
    },
    "Range 2": {
        "line_length_ratio": "experiments/line_length_ratio/line_len_ratio_0.3_0.8_100samples.csv",
        "marker_location": "experiments/marker_location/marker_loc_0.3_0.8_100samples.csv",
        "maze_distance": "experiments/maze_distance/maze_distance_3.0_7.0_100samples.csv",
        "subtitle_duration": "experiments/subtitle_duration/5.0_20.0_100samples.csv",  # if exists
    },
    "Range 3": {
        "line_length_ratio": "experiments/line_length_ratio/line_len_ratio_0.5_0.9_100samples.csv",
        "marker_location": "experiments/marker_location/marker_loc_0.5_0.9_100samples.csv",
        "maze_distance": "experiments/maze_distance/maze_distance_5.0_9.0_100samples.csv",
        "subtitle_duration": "experiments/subtitle_duration/15.0_50.0_100samples.csv",
    },
}

# Which blocks to build. (No Cue-ed for now.)
BLOCKS_PLAN = [
    # Base (text+image for main 3 tasks, text-only for subtitle if present)
    {
        "outfile": "blocks/base_range1.js",
        "condition": "Text+Image - Base",
        "range": "Range 1",
        "prefer_blurred": False,
        "forced": {
            "line_length_ratio": "both",
            "marker_location": "both",
            "maze_distance": "both",
            "subtitle_duration": "text",
        },
    },
    {
        "outfile": "blocks/base_range2.js",
        "condition": "Text+Image - Base",
        "range": "Range 2",
        "prefer_blurred": False,
        "forced": {
            "line_length_ratio": "both",
            "marker_location": "both",
            "maze_distance": "both",
            "subtitle_duration": "text",
        },
    },
    {
        "outfile": "blocks/base_range3.js",
        "condition": "Text+Image - Base",
        "range": "Range 3",
        "prefer_blurred": False,
        "forced": {
            "line_length_ratio": "both",
            "marker_location": "both",
            "maze_distance": "both",
            "subtitle_duration": "text",
        },
    },
    # Noised (image-only; uses blurred_image_path when available)
    {
        "outfile": "blocks/noised_range1.js",
        "condition": "Image - Noised",
        "range": "Range 1",
        "prefer_blurred": True,
        "forced": {
            "line_length_ratio": "image",
            "marker_location": "image",
            "maze_distance": "image",
        },
    },
    {
        "outfile": "blocks/noised_range2.js",
        "condition": "Image - Noised",
        "range": "Range 2",
        "prefer_blurred": True,
        "forced": {
            "line_length_ratio": "image",
            "marker_location": "image",
            "maze_distance": "image",
        },
    },
    {
        "outfile": "blocks/noised_range3.js",
        "condition": "Image - Noised",
        "range": "Range 3",
        "prefer_blurred": True,
        "forced": {
            "line_length_ratio": "image",
            "marker_location": "image",
            "maze_distance": "image",
        },
    },
]


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
            "path",
            "sample",
        ]
    )
    data = rows[1:] if looks_like_header else rows
    return data[:n], (header if looks_like_header else [])


def llr_ascii_two_lines(ascii_raw: str) -> str:
    """Extract two lines from CSV-ish cells like:
    ("'|-=-=----- |', '|-------------------|' )
    Returns 'line1\\nline2'. Falls back gracefully."""
    if not ascii_raw:
        return ""
    txt = str(ascii_raw).strip()

    # Unescape CSV double quotes -> "
    txt = txt.replace('""', '"')

    # Strip one pair of outer quotes if present
    if (txt.startswith('"') and txt.endswith('"')) or (
        txt.startswith("'") and txt.endswith("'")
    ):
        txt = txt[1:-1].strip()

    # Strip parentheses if present
    if txt.startswith("(") and txt.endswith(")"):
        txt = txt[1:-1].strip()

    # Normalize escaped newlines
    txt = txt.replace("\\n", "\n")

    # Try to match "'line1', 'line2'" or "\"line1\", \"line2\""
    import re

    m = re.match(r"""\s*['"]([^'"]*?)['"]\s*,\s*['"]([^'"]*?)['"]\s*""", txt)
    if m:
        return f"{m.group(1)}\n{m.group(2)}"

    # If there is a comma and both halves contain a bar, split there
    if "," in txt and "|" in txt:
        i = txt.find(",")
        if 0 < i < len(txt) - 1:
            left, right = txt[:i].strip(), txt[i + 1 :].strip()
            return f"{left}\n{right}"

    # Already multiline? keep it
    if "\n" in txt:
        return txt

    # Fallback
    return txt


def coerce_truth(v):
    v = (v or "").strip()
    if v == "":
        return ""
    try:
        return float(v)
    except:
        return v


def build_trial(
    row,
    idx,
    task_key,
    prefer_blurred=False,
    forced_type=None,
    condition="",
    range_name="",
):
    # choose image path and prefix it with experiments/<task_key>/ if it looks like a bare filename
    img = ""
    if prefer_blurred and idx["blurred"] is not None:
        img = (row[idx["blurred"]] or "").strip()
        if not img and idx["image"] is not None:
            img = (row[idx["image"]] or "").strip()
    else:
        if idx["image"] is not None:
            img = (row[idx["image"]] or "").strip()
    if img and not (
        img.startswith("experiments/") or img.startswith("/") or img.startswith("http")
    ):
        img = f"experiments/{task_key}/{img}"

    ascii_art = (row[idx["ascii"]] if idx["ascii"] is not None else "") or ""
    ascii_art = llr_ascii_two_lines(ascii_art)
    truth_val = coerce_truth(row[idx["truth"]]) if idx["truth"] is not None else ""
    sid_idx = idx.get("sample_id", None)
    sample_id = (
        row[sid_idx].strip()
        if sid_idx is not None and sid_idx < len(row) and row[sid_idx] is not None
        else ""
    )

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

    trial = {
        "type": row_type,
        "ascii_art": ascii_art if row_type in ("text", "both") else "",
        "image_path": img if row_type in ("image", "both") else "",
        "true_value": truth_val,
        "sample_id": sample_id,
        "block_name": f"{condition} | {pretty_task(task_key)} | {range_name}",
        "__meta": {
            "session": condition,  # show condition in "session" field for logging
            "condition": condition,
            "task": pretty_task(task_key),
            "range": range_name,
        },
    }
    return trial


def pretty_task(task_key):
    return {
        "line_length_ratio": "Line length ratio",
        "marker_location": "Marker Location",
        "maze_distance": "Maze Distance",
        "subtitle_duration": "Subtitle",
    }.get(task_key, task_key)


def build_block(condition, range_name, prefer_blurred, forced_map):
    trials = [
        {
            "type": "instruction",
            "title": f"{condition} — {range_name}",
            "text": "Click Continue when you are ready.",
        }
    ]
    files = RANGE_FILES.get(range_name, {})
    for task_key, csv_path in files.items():
        if not os.path.exists(csv_path):
            continue

        # 🚫 Skip subtitles for Noised blocks
        if prefer_blurred and task_key == "subtitle_duration":
            continue

        data, header = load_csv_first_n(csv_path, LIMIT)
        if not data:
            continue
        idx = detect_header_indexes(header if header else [])
        forced_type = forced_map.get(task_key, None)
        for r in data:
            trials.append(
                build_trial(
                    r,
                    idx,
                    task_key,
                    prefer_blurred=prefer_blurred,
                    forced_type=forced_type,
                    condition=condition,
                    range_name=range_name,
                )
            )

    return trials


def write_block_js(out_path, trials):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("window.stimuli = ")
        json.dump(trials, f, ensure_ascii=False)
        f.write(";\n")
    print("Wrote", out_path, f"({len(trials)} entries)")


def main():
    for b in BLOCKS_PLAN:
        trials = build_block(
            condition=b["condition"],
            range_name=b["range"],
            prefer_blurred=b["prefer_blurred"],
            forced_map=b["forced"],
        )
        write_block_js(b["outfile"], trials)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Error:", e, file=sys.stderr)
        sys.exit(1)
