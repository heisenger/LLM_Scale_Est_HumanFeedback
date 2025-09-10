# generate_data/make_combined_js.py
import json, os

root = "."
S = [
    os.path.join(root, "sessions/session1.json"),
    os.path.join(root, "sessions/session2.json"),
    os.path.join(root, "sessions/session3.json"),
]
out = os.path.join(root, "sessions/combined_stimuli.js")

trials = []
for p in S:
    with open(p, "r", encoding="utf-8") as f:
        trials.extend(json.load(f).get("trials", []))

with open(out, "w", encoding="utf-8") as f:
    f.write("window.stimuli = ")
    json.dump(trials, f, ensure_ascii=False)
    f.write(";\n")

print("Wrote", out, "with", len(trials), "entries.")
