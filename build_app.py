"""
build_app.py
Assembles the single-file app: data/*.json + app.js + template.html
  -> sumitomo-imm-guide.html

Also lints cross-references (every id mentioned anywhere must exist)
so broken links never ship.

Usage:  python3 build_app.py
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
OUT = os.path.join(HERE, "sumitomo-imm-guide.html")


def load(name):
    with open(os.path.join(DATA, name), "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    plast = load("settings-plast.json")
    machine = load("settings-machine.json")
    actuals = load("actuals.json")
    defects = load("defects.json")
    alarms = load("alarms.json")
    guides = load("fundamentals.json")
    wizard = load("wizard.json")

    data = {
        "settings": plast["settings"] + machine["settings"],
        "actuals": actuals["actuals"],
        "defects": defects["defects"],
        "alarms": alarms["alarms"],
        "guides": guides["guides"],
        "wizard": wizard["wizard"],
        "actualsToVerify": actuals.get("toVerify", []),
        "meta": plast["meta"],
    }

    # ---------- cross-reference lint ----------
    setting_ids = {s["id"] for s in data["settings"]}
    actual_ids = {a["id"] for a in data["actuals"]}
    defect_ids = {d["id"] for d in data["defects"]}
    all_ids = setting_ids | actual_ids | defect_ids

    warnings = []

    def check(owner, field, ids, allowed, allowed_name):
        for ref in ids or []:
            if ref not in allowed:
                warnings.append(f"{owner} -> {field}: unknown {allowed_name} id '{ref}'")

    for s in data["settings"]:
        check(f"setting:{s['id']}", "relatedDefects", s.get("relatedDefects"), defect_ids, "defect")
        check(f"setting:{s['id']}", "interactsWith", s.get("interactsWith"), setting_ids, "setting")
        check(f"setting:{s['id']}", "relatedActuals", s.get("relatedActuals"), actual_ids, "actual")
    for d in data["defects"]:
        for c in d["causes"]:
            check(f"defect:{d['id']} cause#{c['rank']}", "settings", c.get("settings"), setting_ids, "setting")
    for a in data["alarms"]:
        check(f"alarm:{a['id']}", "relatedSettings", a.get("relatedSettings"), setting_ids, "setting")
        check(f"alarm:{a['id']}", "relatedDefects", a.get("relatedDefects"), defect_ids, "defect")

    # symptom wizard: every option must point to a real node; every result to a real defect
    wiz = data["wizard"]
    nodes = wiz["nodes"]
    if wiz["start"] not in nodes:
        warnings.append(f"wizard: start node '{wiz['start']}' does not exist")
    for nid, node in nodes.items():
        if "options" in node:
            for opt in node["options"]:
                if opt.get("next") not in nodes:
                    warnings.append(f"wizard:{nid} -> option '{opt.get('a')}': unknown node id '{opt.get('next')}'")
        elif "result" in node:
            res = node["result"]
            if res.get("primary") not in defect_ids:
                warnings.append(f"wizard:{nid} -> result: unknown defect id '{res.get('primary')}'")
            check(f"wizard:{nid}", "result.also", res.get("also"), defect_ids, "defect")
        else:
            warnings.append(f"wizard:{nid}: node has neither options nor result")

    # duplicate id check across everything
    seen = set()
    for coll in ("settings", "actuals", "defects", "alarms", "guides"):
        for item in data[coll]:
            if item["id"] in seen:
                warnings.append(f"DUPLICATE id '{item['id']}' in {coll}")
            seen.add(item["id"])

    if warnings:
        print(f"LINT: {len(warnings)} warning(s)")
        for w in warnings:
            print("  -", w)
    else:
        print("LINT: clean — all cross-references resolve")

    # ---------- assemble ----------
    with open(os.path.join(HERE, "template.html"), encoding="utf-8") as f:
        template = f.read()
    with open(os.path.join(HERE, "app.js"), encoding="utf-8") as f:
        app_js = f.read()

    data_js = "window.APP_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";"

    assert "/*__DATA__*/" in template and "/*__APP__*/" in template, "template placeholders missing"
    html = template.replace("/*__DATA__*/", data_js).replace("/*__APP__*/", app_js)

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)
    # GitHub Pages serves index.html at the site root
    with open(os.path.join(HERE, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    kb = {k: len(data[k]) for k in ("settings", "actuals", "defects", "alarms", "guides")}
    size_kb = os.path.getsize(OUT) / 1024
    print(f"BUILT: {os.path.basename(OUT)} ({size_kb:.0f} KB)")
    print("  content:", ", ".join(f"{v} {k}" for k, v in kb.items()))
    return 0 if not warnings else 1


if __name__ == "__main__":
    raise SystemExit(main())
