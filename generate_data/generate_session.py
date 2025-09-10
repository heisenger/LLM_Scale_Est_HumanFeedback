# generate_sessions.py
# Python 3.x, standard library only

import csv, json, os

# -------- SETTINGS you will edit --------
LIMIT = 20  # first N rows per CSV

# For each session, list blocks. You only point to your existing CSVs.
# Fields:
# - title: shown at session start
# - blocks: list of dicts with:
#     label fields: session, condition, task, range
#     csv: path to the CSV file
#     image_field: which column to use for image ('image_path' or 'blurred_image_path' etc.)
#     type: 'both' | 'image' | 'text' | 'infer' (infer = both if both present, else text/image)
SESSIONS = [
    {
        "file": "sessions/session1.json",
        "title": "Session 1: Text+Image - Base",
        "intro": "You will see text + image trials. Click Continue when ready.",
        "blocks": [
            {"session":"Session 1","condition":"Text+Image - Base","task":"Line length ratio","range":"Range 1",
             "csv":"experiments/line_length_ratio/line_len_ratio_0.1_0.5_100samples.csv","image_field":"image_path","type":"both"},
            {"session":"Session 1","condition":"Text+Image - Base","task":"Marker Location","range":"Range 1",
             "csv":"experiments/marker_location/marker_loc_0.1_0.5_100samples.csv","image_field":"image_path","type":"both"},
            {"session":"Session 1","condition":"Text+Image - Base","task":"Maze Distance","range":"Range 1",
             "csv":"experiments/maze_distance/maze_distance_1.0_5.0_100samples.csv","image_field":"image_path","type":"both"},
            {"session":"Session 1","condition":"Text+Image - Base","task":"Subtitle","range":"Range 1",
             "csv":"experiments/subtitle_duration/1.0_8.0_100samples.csv","image_field":"", "type":"text"},
        ],
        "break_after": False
    },
    {
        "file": "sessions/session2.json",
        "title": "Session 2: Image - Noised",
        "intro": "You will see image-only trials (noised). Click Continue when ready.",
        "blocks": [
            {"session":"Session 2","condition":"Image - Noised","task":"Line length ratio","range":"Range 1",
             "csv":"experiments/line_length_ratio/line_len_ratio_0.3_0.8_100samples.csv","image_field":"blurred_image_path","type":"image"},
            {"session":"Session 2","condition":"Image - Noised","task":"Marker Location","range":"Range 1",
             "csv":"experiments/marker_location/marker_loc_0.3_0.8_100samples.csv","image_field":"blurred_image_path","type":"image"},
            {"session":"Session 2","condition":"Image - Noised","task":"Maze Distance","range":"Range 1",
             "csv":"experiments/maze_distance/maze_distance_3.0_7.0_100samples.csv","image_field":"blurred_image_path","type":"image"},
        ],
        "break_after": True  # we’ll show a Break screen after loading this session
    },
    {
        "file": "sessions/session3.json",
        "title": "Session 3: Text+Image - Cue-ed",
        "intro": "You will see text + image with cues. Click Continue when ready.",
        "blocks": [
            {"session":"Session 3","condition":"Text+Image - Cue-ed","task":"Line length ratio","range":"Range 1",
             "csv":"experiments/line_length_ratio/line_len_ratio_0.5_0.9_100samples.csv","image_field":"image_path","type":"both"},
            {"session":"Session 3","condition":"Text+Image - Cue-ed","task":"Marker Location","range":"Range 1",
             "csv":"experiments/marker_location/marker_loc_0.5_0.9_100samples.csv","image_field":"image_path","type":"both"},
            {"session":"Session 3","condition":"Text+Image - Cue-ed","task":"Maze Distance","range":"Range 1",
             "csv":"experiments/maze_distance/maze_distance_5.0_9.0_100samples.csv","image_field":"image_path","type":"both"},
        ],
        "break_after": False
    }
]
# -------- END SETTINGS --------


def detect_header_indexes(header):
    # Normalize header names
    h = [ (c or "").strip().lower() for c in header ]
    def find(*names):
        for n in names:
            if n in h:
                return h.index(n)
        return None
    return {
        "image": find("image_path","image","img","filepath","path","imagefile","stimulus_image","image file","file"),
        "blurred": find("blurred_image_path","blurred","blur","noised_image_path"),
        "ascii": find("ascii_art","ascii","text","stimulus_text","txt"),
        "truth": find("true_value","truth","y","target","label","ground_truth","gt","value"),
        "type": find("type","modality"),
        # Allow per-row overrides too (optional)
        "session": find("session","section"),
        "condition": find("condition","cond"),
        "task": find("task"),
        "range": find("range"),
    }

def coerce_truth(v):
    v = (v or "").strip()
    if v == "":
        return ""
    try:
        return float(v)
    except:
        return v

def build_trial(row, idx, preset_type, image_field_name):
    # Determine image path
    image_path = ""
    if image_field_name:  # explicit override from config
        # Prefer blurred if asked and exists
        if image_field_name.lower().startswith("blur"):
            if idx["blurred"] is not None:
                image_path = row[idx["blurred"]] or ""
            else:
                # fallback to normal
                if idx["image"] is not None:
                    image_path = row[idx["image"]] or ""
        else:
            if idx["image"] is not None:
                image_path = row[idx["image"]] or ""
    else:
        # No explicit field -> try normal first
        if idx["image"] is not None:
            image_path = row[idx["image"]] or ""

    ascii_art = row[idx["ascii"]] if idx["ascii"] is not None else ""
    truth_val = coerce_truth(row[idx["truth"]]) if idx["truth"] is not None else ""

    # Infer type if needed
    row_type = (row[idx["type"]].strip().lower() if idx["type"] is not None and row[idx["type"]] else "")
    if not row_type:
        if preset_type and preset_type != "infer":
            row_type = preset_type
        else:
            has_ascii = bool(ascii_art)
            has_img = bool(image_path)
            row_type = "both" if (has_ascii and has_img) else ("text" if has_ascii else ("image" if has_img else "text"))

    # Build trial object your frontend understands
    trial = {
        "type": row_type,
        "ascii_art": ascii_art if row_type in ("text","both") else "",
        "image_path": image_path if row_type in ("image","both") else "",
        "true_value": truth_val
    }
    return trial

def load_csv_first_n(csv_path, n):
    with open(csv_path, newline='', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        rows = list(reader)
    if not rows:
        return [], None
    header = rows[0]
    data = rows[1:] if any(c.lower() in ("image_path","ascii_art","true_value","blurred_image_path","image","text","value","label","target") for c in [ (c or "").lower() for c in header ]) else rows
    if data is rows:
        header = ["image_path","ascii_art","true_value"]  # synthetic header if none
    return data[:n], header

def make_session_json(session_cfg):
    flat_trials = []
    # insert a session instruction at the top
    flat_trials.append({
        "type": "instruction",
        "title": session_cfg["title"],
        "text": session_cfg.get("intro","Click Continue to begin this session.")
    })

    for blk in session_cfg["blocks"]:
        rows, header = load_csv_first_n(blk["csv"], LIMIT)
        idx = detect_header_indexes(header)
        # Labels
        label_meta = {
            "session": blk["session"],
            "condition": blk["condition"],
            "task": blk["task"],
            "range": blk["range"]
        }
        for r in rows:
            tr = build_trial(r, idx, blk.get("type","infer"), blk.get("image_field",""))
            tr["block_name"] = f'{blk["condition"]} | {blk["task"]} | {blk["range"]}'
            tr["__meta"] = label_meta
            flat_trials.append(tr)
    # Optionally add a break instruction after this session
    if session_cfg.get("break_after"):
        flat_trials.append({
            "type": "instruction",
            "title": "Break",
            "text": "Take a short break. Click Continue when ready to proceed."
        })
    return {
        "title": session_cfg["title"],
        "trials": flat_trials
    }

def main():
    os.makedirs("sessions", exist_ok=True)
    for s in SESSIONS:
        out = make_session_json(s)
        with open(s["file"], "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False)
        print("Wrote", s["file"], f'({len(out["trials"])} entries incl. instructions)')

if __name__ == "__main__":
    main()
