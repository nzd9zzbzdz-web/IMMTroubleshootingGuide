# Settings Review


## Contents

- **Mold Open / Close** — Mold Open Positions & Speeds, Mold Close Positions & Speeds, Low-Pressure Mold Protect
- **Ejector** — Ejector Positions (Stroke), Ejector Velocity & Pressure, Ejector Count, Mode & Delay
- **Heats** — Barrel Zone Temperatures, Nozzle Temperature, Feed Throat Temperature
- **Mold (external TCU)** — Mold Temperature

---

## Mold Open / Close

### Mold Open Positions & Speeds
*Also called: open profile, Open Limit / 2nd / 1st*  
*Units: mm + %*

Multi-stage mold opening: slow breakaway from the parting line (1st), fast travel through the middle (2nd), and a controlled stop at the open limit. Your screen runs 3 stages ending at an 80.0 mm open limit.

**If you RAISE it:**
- Higher speeds: shorter dry-cycle time — mold open/close is often easy cycle time to win
- Larger open limit: more room for part drop or robot entry, but longer travel every cycle

**If you LOWER it:**
- Slower breakaway (1st stage): gentler release of the part off cores — helps parts that drag, stick, or show stress marks at opening
- Smaller open limit: faster cycle; too small and parts or the picker clash with the mold

**Typical / how to set:** Slow for the first few mm off the parting line, fast through the middle, decelerate to the stop. Open only as far as part removal actually needs.

**Watch out:** A violent breakaway can crack parts still gripping a core — if cracks appear near opening, slow the 1st stage before touching the process.

*Related defects: sticking, cracking, ejector_marks*  
*Interacts with: mold_close_profile, ejector_stroke, cool_time*

---

### Mold Close Positions & Speeds
*Also called: close profile, Close 1st / 2nd / Clamp*  
*Units: mm + %*

Multi-stage closing: fast travel while the halves are far apart, slowing down as they approach, then the low-pressure protect zone and final clamp-up. Your screen: fast to 50.0, fast to 10.0, protect/clamp from 1.19 mm.

**If you RAISE it:**
- Higher speeds: faster cycle
- Switching to slow later (lower position numbers): more of the travel runs fast — cycle drops, but less reaction distance before the faces meet

**If you LOWER it:**
- Switching to slow earlier: more gentle approach and more distance for mold protect to catch an obstruction — safer for the tool, slightly longer cycle

**Typical / how to set:** Fast until the last ~10 mm, then slow into the protect zone. Never let the halves touch at speed.

**Watch out:** The slow-down point and the mold-protect window work together — if you speed up the approach, re-verify protect still has room to react.

*Related defects: none listed*  
*Interacts with: mold_protect, clamp_force*

---

### Low-Pressure Mold Protect
*Also called: Lw Clamp, mold protection, low pressure close*  
*Units: mm start position + % pressure*

The tool-saving zone: from a set position (yours: 20.0 mm) the mold closes with limited force (yours: 40%) so that a stuck part, dropped runner, or cold slug on the face stalls the machine instead of being crushed into the steel. The cheapest insurance on the whole press.

**If you RAISE it:**
- Higher start position: protection begins earlier — covers taller hang-ups (a full part standing on the face), adds a little close time
- Higher protect pressure: pushes through more resistance before tripping — fewer nuisance stops, but a real obstruction gets squeezed harder before the machine gives up

**If you LOWER it:**
- Lower pressure: trips at the slightest resistance — maximum tool protection, but may nuisance-trip on tight leader pins or heavy molds
- Start position too low: a part taller than the window gets hit at full speed before protection ever engages

**Typical / how to set:** Start the window just above the tallest thing that could ever be left on the mold face, with the lowest pressure that reliably closes an empty mold. Verify after every mold change.

**Watch out:** If mold protect trips, never fix it by raising the pressure until you have physically looked at both mold faces. Crushed inserts and smashed pins are how molds die.

*Related defects: none listed*  
*Interacts with: mold_close_profile, ejector_count_delay, clamp_force*

---

## Ejector

### Ejector Positions (Stroke)
*Also called: eject position, 1st / Eject Pos*  
*Units: mm*

How far the ejector plate travels forward to push parts off the cores. Your screen: 0.80 mm first stage, 1.40 mm full eject.

**If you RAISE it:**
- More push — parts that hang halfway get fully cleared
- Too far: pins can over-travel, punch through hot parts, or over-stress the ejector plate on its stops

**If you LOWER it:**
- Gentler, faster ejection; too short and parts don't fully release — hangers cause mold-protect trips and double-clamped parts

**Typical / how to set:** Just enough travel to reliably clear the part off every core, plus a small margin. More stroke is not more reliable — it's just more wear.

**Watch out:** A part left hanging after ejection is the #1 cause of mold protect trips — if trips start, watch ejection with your own eyes before changing anything.

*Related defects: sticking, ejector_marks*  
*Interacts with: ejector_speed_pressure, ejector_count_delay, cool_time*

---

### Ejector Velocity & Pressure
*Also called: eject speed, Vel. / Press.*  
*Units: % (yours: 25 vel / 40 press)*

How fast and how hard the ejector plate drives forward. Speed controls how violently pins hit the part; pressure controls how much resistance they can push through.

**If you RAISE it:**
- Faster part clearance, shorter cycle
- Too fast/hard: pin push marks, stress whitening rings around pins, cracked bosses, parts launched instead of dropped

**If you LOWER it:**
- Gentle ejection — kind to soft or cosmetic parts
- Too low: plate stalls against sticking force and parts hang

**Typical / how to set:** Slowest and softest that clears the part every single shot. If you need high ejector force to free parts, the real problem is upstream: overpacking, short cooling, or tool polish/draft.

**Watch out:** Rising ejection force needed over a run is a symptom — check hold pressure creep, cooling water, and core condition rather than just turning ejection up.

*Related defects: ejector_marks, cracking, sticking*  
*Interacts with: ejector_stroke, hold_pressure, cool_time*

---

### Ejector Count, Mode & Delay
*Also called: multi-eject, shake, eject delay*  
*Units: count + sec (yours: 1 count, 0.00 delay, Normal mode)*

How many times the ejector strokes per cycle, the ejection mode, and any wait before ejecting after the mold opens.

**If you RAISE it:**
- More counts: a shake action that rattles clingy parts loose — useful for parts that ride the pins back
- More delay: lets the part cool/shrink a moment on the open core before pushing, or times ejection to a robot

**If you LOWER it:**
- Single stroke, zero delay (yours): fastest and simplest — the right default when parts drop cleanly

**Typical / how to set:** 1 count, 0 delay unless a specific sticking problem says otherwise. Every extra count is cycle time and pin wear.

**Watch out:** If you need 3 counts to free a part, that's a band-aid — look at packing, cooling, draft, and polish for the real fix.

*Related defects: sticking*  
*Interacts with: ejector_stroke, ejector_speed_pressure*

---

## Heats

### Barrel Zone Temperatures
*Also called: heats, zone temps, temperature profile*  
*Units: deg C / deg F per zone*

The heater band setpoints along the barrel, rear (feed end) to front (nozzle end). They set the baseline melt temperature — but remember screw RPM and back pressure add shear heat on top, so real melt temp is usually hotter than the front zone says.

**If you RAISE it:**
- Easier flow (lower viscosity): helps short shots, weld lines, gloss, thin-wall fill
- Too hot: degradation — splay, black specks, brittleness, drool, gassing, longer cooling needed, more shrink to pack out

**If you LOWER it:**
- Stiffer melt: less flash and drool, less degradation risk, faster setup of the part
- Too cold: short shots, unmelts, weak weld lines, high fill pressures, delamination, machine strains to fill

**Typical / how to set:** Start at the resin supplier's datasheet mid-range with a rising rear-to-front profile (reverse profiles exist for special cases). Verify with an actual melt purge temperature, not just the setpoints.

**Watch out:** Barrel changes take 10-15+ minutes to truly soak through — judge nothing until temps have settled. Never rotate the screw until every zone is at setpoint and soaked (torque overload / broken screws live here).

*Related defects: splay, black_specks, short_shot, weld_lines, brittleness, unmelts, flash, delamination*  
*Interacts with: screw_rpm, back_pressure, nozzle_temp, cool_time*

---

### Nozzle Temperature
*Also called: tip temp*  
*Units: deg C / deg F*

The heater on the nozzle tip — the last thing melt touches before the mold. It fights a cold sprue bushing pressed against it, so it lives in a tug-of-war between drooling (too hot) and freezing off (too cold).

**If you RAISE it:**
- No freeze-off, free-flowing tip
- Too hot: drool between shots, stringing, splay from material sitting hot in the tip

**If you LOWER it:**
- Less drool and stringing
- Too cold: cold slugs (blemish at the gate, jetting seed, blocked gates), nozzle freeze-off, fill-time alarms

**Typical / how to set:** Usually at or slightly below the front barrel zone. Tune in small steps against the drool-vs-freeze symptoms, alongside suck back.

**Watch out:** A nozzle thermocouple reading the heater band instead of the melt can lie by a lot — if symptoms don't match the number, suspect the sensor placement.

*Related defects: drooling, stringing, jetting, splay, short_shot*  
*Interacts with: pull_back_after_dose, barrel_temps, dose_delay*

---

### Feed Throat Temperature
*Also called: hopper throat, feed zone cooling*  
*Units: deg C / deg F (water-cooled)*

The cooled zone under the hopper where pellets enter. It must stay cool enough that pellets don't get sticky and bridge before the screw grabs them.

**If you RAISE it:**
- Too warm: pellets soften and bridge in the throat — feed starves, dose times stretch and wander, then 'dose not complete' alarms

**If you LOWER it:**
- Reliable, consistent feeding; very cold can condense moisture onto pellets in humid shops

**Typical / how to set:** Warm to the touch, never hot. If dose time drifts long over a shift, put a hand near the throat before blaming the screw.

**Watch out:** Throat cooling water gets forgotten — a closed valve here looks exactly like a material or screw problem two hours later.

*Related defects: short_shot, splay, dimensional_drift*  
*Interacts with: barrel_temps, screw_rpm*

---

## Mold (external TCU)

### Mold Temperature
*Also called: tool temp, water temp, TCU setpoint*  
*Units: deg C / deg F*

Set on the water unit (TCU), not this control — but it drives more part quality than almost anything on the screen. It sets how fast the skin freezes, which controls surface finish, weld lines, packing window, warp, and dimensions.

**If you RAISE it:**
- Better gloss and surface replication, stronger weld lines, longer gate-open window for packing, lower molded-in stress, dimensions closer to steel
- Costs cycle time (slower cooling); too hot: sticking, sinks reappear, ejection distortion

**If you LOWER it:**
- Faster cycles, parts set up quick
- Too cold: dull finish, visible weld/flow lines, high stress (warp and cracking later), gate seals early so packing stops working

**Typical / how to set:** Datasheet range for the resin — and verify with a pyrometer on the steel, because the TCU display is water temp, not mold surface temp. Unbalanced halves (hot cavity, cold core or vice versa) is a top warp cause.

**Watch out:** Check actual flow, not just temperature — a half-plugged circuit at the right temp still cools unevenly and warps parts.

*Related defects: warpage, weld_lines, gloss_variation, sink_marks, sticking, flow_lines, cracking, dimensional_drift*  
*Interacts with: cool_time, hold_time, hold_pressure, barrel_temps*

---
