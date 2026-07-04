"""
make_review_doc.py
Converts a settings JSON file into a readable Markdown review document.

Usage:
    python3 make_review_doc.py data/settings-plast.json settings-plast-review.md

No dependencies — Python 3 standard library only.
Edit the JSON, re-run this, and the review doc stays in sync.
"""

import json
import sys


def build_markdown(data):
    meta = data.get("meta", {})
    lines = []

    # Header
    lines.append(f"# {meta.get('title', 'Settings Review')}")
    lines.append("")
    if meta.get("machineRef"):
        lines.append(f"**Machine:** {meta['machineRef']}  ")
    if meta.get("version"):
        lines.append(f"**Version:** {meta['version']} — {meta.get('status', '')}")
    lines.append("")
    if meta.get("generalRule"):
        lines.append(f"> **Golden rule:** {meta['generalRule']}")
        lines.append("")

    # Group settings in the order they appear
    group_order = []
    grouped = {}
    for setting in data["settings"]:
        group = setting["group"]
        if group not in grouped:
            grouped[group] = []
            group_order.append(group)
        grouped[group].append(setting)

    # Table of contents
    lines.append("## Contents")
    lines.append("")
    for group in group_order:
        names = ", ".join(s["name"] for s in grouped[group])
        lines.append(f"- **{group}** — {names}")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Settings
    for group in group_order:
        lines.append(f"## {group}")
        lines.append("")
        for s in grouped[group]:
            lines.append(f"### {s['name']}")
            also = s.get("alsoCalled", [])
            if also:
                lines.append(f"*Also called: {', '.join(also)}*  ")
            lines.append(f"*Units: {s['units']}*")
            lines.append("")
            lines.append(s["whatItIs"])
            lines.append("")
            lines.append("**If you RAISE it:**")
            for effect in s["raiseEffects"]:
                lines.append(f"- {effect}")
            lines.append("")
            lines.append("**If you LOWER it:**")
            for effect in s["lowerEffects"]:
                lines.append(f"- {effect}")
            lines.append("")
            lines.append(f"**Typical / how to set:** {s['typicalRange']}")
            lines.append("")
            lines.append(f"**Watch out:** {s['cautions']}")
            lines.append("")
            defects = ", ".join(s.get("relatedDefects", [])) or "none listed"
            interacts = ", ".join(s.get("interactsWith", [])) or "none listed"
            lines.append(f"*Related defects: {defects}*  ")
            lines.append(f"*Interacts with: {interacts}*")
            lines.append("")
            lines.append("---")
            lines.append("")

    # Open items
    to_verify = meta.get("toVerify", [])
    if to_verify:
        lines.append("## Still to verify against the machine/manual")
        lines.append("")
        for item in to_verify:
            lines.append(f"- {item}")
        lines.append("")

    return "\n".join(lines)


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 make_review_doc.py <input.json> <output.md>")
        sys.exit(1)

    input_path, output_path = sys.argv[1], sys.argv[2]

    with open(input_path, "r") as f:
        data = json.load(f)

    markdown = build_markdown(data)

    with open(output_path, "w") as f:
        f.write(markdown)

    count = len(data["settings"])
    print(f"Wrote {output_path} ({count} settings)")


if __name__ == "__main__":
    main()
