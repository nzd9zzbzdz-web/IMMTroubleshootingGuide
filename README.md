# SE180EV Troubleshooting Guide

A fully standalone troubleshooting app for the Sumitomo SE180EV injection
molding machine. One HTML file, works offline, runs on any phone, tablet,
or PC with a browser. No install, no internet, no account.

## What's inside

| Section        | Count | What it does                                                    |
|----------------|-------|-----------------------------------------------------------------|
| Settings       | 31    | Every setting: what it is, raise vs lower effects, cautions     |
| Actual Values  | 13    | What each monitored number means, and what rising/falling tells you |
| Defect Library | 23    | Symptom -> ranked causes -> exact setting fixes -> diagnostic path |
| Alarms & Faults| 10    | What tripped, safe first response, root causes, prevention      |
| Fundamentals   | 7     | Decoupled molding, fill-only study, gate seal, cushion, tonnage, drying, residence |

Everything is cross-linked: a defect's cause links to the setting, the
setting links back to related defects and the actual values that prove it.

## How to use it

1. Open `sumitomo-imm-guide.html` in any browser. That's it.
2. On a phone: send yourself the file (email/AirDrop/USB), open it, then
   use the browser's **Add to Home Screen** — it behaves like an app and
   works with no signal on the shop floor.
3. Press `/` (or tap the magnifier) to search everything at once.

## Project layout

```
imm-guide/
  sumitomo-imm-guide.html   <- the app (built output, share this file)
  template.html             <- HTML shell + all CSS
  app.js                    <- all app logic (vanilla JS, no dependencies)
  build_app.py              <- assembles data + template + app.js -> the app
  make_review_doc.py        <- JSON -> readable markdown for red-lining content
  data/
    settings-plast.json     <- Plast screen settings (21)
    settings-machine.json   <- Mold / Ejector / Temperature settings (10)
    actuals.json            <- Actual-value diagnostics (13)
    defects.json            <- Defect library (23)
    alarms.json             <- Alarms & faults (10)
    fundamentals.json       <- Short training articles (7)
```

Content lives in `data/*.json` — the app never needs code changes to fix
or add content.

## Editing content

1. Edit the JSON file (any text editor).
2. Rebuild:  `python3 build_app.py`
3. The build **lints every cross-reference** — if you typo a setting id
   inside a defect, it tells you exactly where. A clean build prints
   `LINT: clean`.
4. Optional readable copy for review:
   `python3 make_review_doc.py data/settings-plast.json review.md`

Requirements to rebuild: Python 3 (standard library only). To just USE
the app: nothing.

## Test checklist (2 minutes)

- Open the app -> home shows 5 sections with counts (31/13/23/10/7)
- Tap **Defects -> Splay** -> causes are numbered, tapping a setting chip
  under a cause jumps to that setting
- On the setting page, the amber **units** line and the RAISE/LOWER
  panels render side-by-side on wide screens, stacked on a phone
- Press `/`, type `cushion` -> results appear across multiple sections
- Tap the sun/moon icon -> light theme; back button returns you along
  your actual path
- Turn on airplane mode and reload -> everything still works

If something fails: open the browser console (F12) — the app is one file,
so an error points at exactly one place. Re-run `python3 build_app.py`
and confirm `LINT: clean` before suspecting the app code.

## Honest-draft flags

Content marked **to verify** (shown in-app at the bottom of Settings and
Actual Values) needs confirmation against the SE-EV manual: Zero Set,
the Flash field, dose stage position convention, Flow-Check details, and
the Dose Start actual. Everything else is standard molding practice
written for this machine's screens — still red-line it on the floor.

## Next steps (when you want them)

- Verify content at the press, red-line, edit JSON, rebuild
- Add your own defect photos (small base64 images in defects.json)
- A "symptom wizard" (answer 3 questions -> ranked suspects)
- Per-mold setup sheet storage
