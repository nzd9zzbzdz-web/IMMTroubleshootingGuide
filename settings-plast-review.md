# Plast Screen — Settings Encyclopedia

**Machine:** Sumitomo SE180EV (C360M, phi-36 screw, NC touchscreen control)  
**Version:** 0.1-draft — Draft for shop-floor verification. Red-line anything that doesn't match how your press actually behaves.

> **Golden rule:** Change one setting at a time, run 5-10 shots, and watch the Actual values (fill peak, fill time, cushion, cycle) before judging the change.

## Contents

- **Injection / Fill** — Fill Stages (e.g. 2V-2P), Fill Velocity (per stage), Fill Stage Positions, V-P Transfer Position, Maximum Filling Pressure, Fill Time Limit, Flow-Check
- **Hold / Pack (H.Press)** — Hold Pressure (1st / 2nd), Hold Time (1st / 2nd), H.V. Limit (Hold Velocity Limit), Ret Vel (Return Velocity after Hold)
- **Dose / Plasticizing** — Dose End Position (Shot Size), Screw Rotation Speed (1st / End), Back Pressure (1st / End), Pull Back — Before Dose, Pull Back — After Dose, Dose Delay
- **Cooling & Cycle** — Cooling Time, Interval Time
- **Clamp** — Clamp Force Setting, Full Auto Clamp Force Correction

---

## Injection / Fill

### Fill Stages (e.g. 2V-2P)
*Also called: injection profile, stage select*  
*Units: stages*

How many velocity-controlled stages (V) the fill uses and how many pressure-controlled stages (P) the pack/hold uses. 2V-2P means two fill speeds and two hold pressures.

**If you RAISE it:**
- Finer control of the flow front as it moves through geometry changes (slow through the gate, fast through thin walls, slow at the very end for venting)
- Lets you fix defects tied to one spot on the part without changing the whole fill
- More numbers to manage — harder to keep the process simple and transferable

**If you LOWER it:**
- Simpler, easier-to-repeat process that transfers between machines cleanly
- Less ability to fix a defect that only happens at one point in fill (jetting at the gate, burn at end of fill)

**Typical / how to set:** Most parts run well on 1-3 velocity stages. Add a stage only to fix a specific defect at a specific location — not by default.

**Watch out:** Every added stage is another thing that can drift. If a stage break isn't earning its keep, remove it.

*Related defects: jetting, burn_marks, gate_blush, flow_lines*  
*Interacts with: fill_velocity, fill_stage_positions, vp_transfer_position*

---

### Fill Velocity (per stage)
*Also called: injection speed, Vel.*  
*Units: mm/sec*

How fast the screw drives forward during fill. This is the single most influential fill setting: speed sets shear rate, shear rate sets the melt's effective viscosity (plastics shear-thin), and viscosity decides how the flow front behaves.

**If you RAISE it:**
- Melt shear-thins — flows easier into thin walls and long flow paths
- Hotter, faster flow front — stronger and less visible weld lines, better gloss and surface replication
- Shorter fill time, higher fill peak pressure
- Too fast: burn marks (dieseling) at end of fill or in trapped-gas corners, jetting at the gate, gate blush, flash if tonnage is marginal, gas has no time to escape the vents

**If you LOWER it:**
- Gentler shear, less gate stress, gas gets time to vent
- Too slow: short shots, cold flow front — weak/visible weld lines, flow lines and record grooves, hesitation marks where flow pauses, dull gloss, front can freeze off in thin sections

**Typical / how to set:** Scientific-molding default is 'fill as fast as the part allows.' Set it with a viscosity-curve study: run fill-only shots across speeds and pick a speed on the flat part of the curve, where small speed changes stop changing viscosity.

**Watch out:** Watch Fill Peak vs. the fill pressure limit. If actual pressure flatlines at the limit, the machine is no longer holding your set speed ('pressure-limited fill') and the velocity numbers on screen are a lie.

*Related defects: short_shot, burn_marks, jetting, weld_lines, flow_lines, gate_blush, flash, gloss_variation*  
*Interacts with: vp_transfer_position, fill_pressure_limit, clamp_force*

---

### Fill Stage Positions
*Also called: velocity change-over points, Pos.*  
*Units: mm (screw position, counting down toward zero)*

The screw positions where fill switches from one velocity stage to the next. On this control the number counts down as the screw moves forward, so a larger position = earlier in fill.

**If you RAISE it:**
- That stage's speed hands off earlier — the next stage covers more of the part

**If you LOWER it:**
- That stage's speed runs longer into the fill before handing off

**Typical / how to set:** Put stage breaks at real geometry events: just past the gate, entering a thin wall, or the last ~10% of fill if you need a slow finish for venting. Don't scatter breaks arbitrarily.

**Watch out:** If you change shot size (dose position), re-check that your stage breaks still line up with the same points on the part.

*Related defects: jetting, burn_marks, flow_lines*  
*Interacts with: fill_velocity, dose_position, vp_transfer_position*

---

### V-P Transfer Position
*Also called: cutover, transfer position, V-P Pos*  
*Units: mm (screw position)*

The screw position where the machine switches from velocity-controlled fill to pressure-controlled pack/hold. The most important single switch point in the whole process — it decides how full the cavity is when hold pressure takes over.

**If you RAISE it:**
- Transfers EARLIER (screw further back) — cavity is less full when hold takes over
- Hold pressure has to finish filling: safer against flash and overpack
- Too early: hold can't finish the part — short shots, sinks and unpacked areas at end of fill, weight drops

**If you LOWER it:**
- Transfers LATER — cavity is more full on velocity
- Too late: flash, overpacking, pressure spike at transfer, stress in the gate area, and it can crush your cushion toward zero — risks mold damage

**Typical / how to set:** Set so the part is ~95-98% full at transfer. Prove it with a fill-only study: kill hold pressure/time and adjust V-P until the fill-only part is just short by design, then restore hold.

**Watch out:** Never let transfer happen with the screw near bottom — no cushion means no pressure transmission and a beat-up machine. Re-check V-P any time you change shot size.

*Related defects: short_shot, flash, sink_marks, burn_marks, dimensional_drift*  
*Interacts with: dose_position, hold_pressure, fill_velocity*

---

### Maximum Filling Pressure
*Also called: fill pressure limit, injection pressure limit, [J2P1P010] on your screen*  
*Units: kgf/cm2*

A ceiling on injection pressure during velocity-controlled fill. It is a safety limit, not a target — during proper fill the machine uses whatever pressure it needs (up to this cap) to hold your set speed.

**If you RAISE it:**
- More headroom — the machine can hold set velocity even when viscosity drifts (new lot, colder melt, regrind swings)
- No change to the running process unless the old limit was actually being hit

**If you LOWER it:**
- If set below what fill really needs, fill goes 'pressure-limited': actual speed sags, fill time stretches and wanders shot to shot, short shots and inconsistency appear
- Deliberately lowered on purpose only to protect fragile tooling, thin cores, or during mold trials

**Typical / how to set:** Set 10-20% above the observed Fill Peak once the process is stable. Example from your screen: Fill Peak 1554 with a 1680 limit is only ~8% headroom — workable, but a viscosity swing could clip it.

**Watch out:** If fill time starts varying and Fill Peak is flatlined at the limit, fix this before touching anything else — nothing else you adjust is in control until velocity is back in control.

*Related defects: short_shot, dimensional_drift*  
*Interacts with: fill_velocity*

---

### Fill Time Limit
*Also called: Fill T.Limit, fill watchdog*  
*Units: sec*

A watchdog: the maximum time the machine allows to reach V-P transfer before it alarms. Catches real failures — empty hopper, blocked nozzle or gate, dead check ring — before they wreck parts or the tool.

**If you RAISE it:**
- More tolerance before alarming — fewer nuisance trips, but slower to catch a genuine problem

**If you LOWER it:**
- Catches problems fast; too tight and normal shot-to-shot variation trips nuisance alarms

**Typical / how to set:** A few multiples of actual fill time. Your screen: 0.131 sec actual with a 1.000 sec limit — loose but sane. Tight enough to catch a blocked gate, loose enough to ignore normal variation.

**Watch out:** If this alarm fires repeatedly, treat it as a symptom — check material feed, nozzle, and check ring. Don't just widen the limit.

*Related defects: short_shot*  
*Interacts with: fill_velocity, fill_pressure_limit*

---

### Flow-Check
*Also called: check ring monitor, non-return valve check*  
*Units: mm (ON/OFF + threshold)*

A Sumitomo monitoring function that watches for melt leaking back past the check ring (non-return valve) by measuring screw movement it shouldn't be making. A worn check ring is the classic hidden cause of drifting cushion and random shorts.

**If you RAISE it:**
- Looser threshold — tolerates more leakage before flagging; catches only badly worn rings

**If you LOWER it:**
- Tighter threshold — flags check-ring wear earlier; too tight can nuisance-trip on normal seating variation

**Typical / how to set:** Yours is OFF. Worth turning on for critical jobs: it turns 'why is cushion wandering?' from a mystery into a flagged maintenance item.

**Watch out:** Behavior/threshold convention marked to-verify against the SE-EV manual — confirm before trusting specific numbers in this entry.

*Related defects: short_shot, sink_marks, dimensional_drift*  
*Interacts with: vp_transfer_position, dose_position*

---

## Hold / Pack (H.Press)

### Hold Pressure (1st / 2nd)
*Also called: pack pressure, H.Press, holding pressure*  
*Units: kgf/cm2*

The pressure applied after V-P transfer that finishes filling the last few percent, packs the cavity against shrinkage, and holds melt in until the gate freezes. This is the setting that owns part weight, dimensions, and sinks.

**If you RAISE it:**
- Heavier part, fewer sinks and internal voids, dimensions grow (less shrinkage), sharper surface detail
- Too high: flash, overpacked stress near the gate (warp, cracking, stress whitening), parts stick in the cavity, ejection gets violent, needed clamp tonnage climbs

**If you LOWER it:**
- Lighter part, more shrinkage — sinks over ribs and bosses, voids in thick sections, dimensions come in smaller
- Far ends of the part and thin details go unpacked first

**Typical / how to set:** Common starting point is roughly 50-75% of Fill Peak, then dial by part weight and dimensions. A lower 2nd stage tapers pressure to ease gate stress as the gate freezes.

**Watch out:** Hold pressure only works while the gate is open — if dimensions won't respond, the gate may already be frozen (see Hold Time) or the cushion may be collapsing (see Dose Position).

*Related defects: sink_marks, voids, flash, warpage, sticking, dimensional_drift, cracking*  
*Interacts with: hold_time, vp_transfer_position, cool_time, clamp_force*

---

### Hold Time (1st / 2nd)
*Also called: pack time, holding time*  
*Units: sec*

How long hold pressure stays applied. It only does work until the gate freezes shut — after gate seal, extra hold time changes nothing except your cycle time.

**If you RAISE it:**
- More packing up until gate seal: heavier part, fewer sinks, steadier dimensions
- Past gate seal: zero effect on the part, pure wasted cycle time

**If you LOWER it:**
- Cut it below gate seal and packed material discharges back out through the still-open gate: sinks, voids, part-weight scatter, dimensional drift

**Typical / how to set:** Set with a gate-seal study: raise hold time in steps, weigh parts each step, and find where weight plateaus. Run just past the plateau. Weight still climbing = gate still open = you're leaving pack on the table.

**Watch out:** Gate seal time changes with melt temp, mold temp, and gate size — re-verify after any of those change.

*Related defects: sink_marks, voids, dimensional_drift*  
*Interacts with: hold_pressure, cool_time*

---

### H.V. Limit (Hold Velocity Limit)
*Also called: hold speed limit*  
*Units: mm/sec*

The maximum forward speed the screw may move during hold while chasing the hold-pressure setpoint. It softens the handoff from velocity control to pressure control so the transfer doesn't spike.

**If you RAISE it:**
- Pressure builds faster right at transfer — snappier packing response
- Too high with a nearly-full cavity: pressure overshoot and a flash spike at transfer

**If you LOWER it:**
- Gentler, spike-free transfer
- Too low: the screw physically can't move fast enough to reach the set hold pressure — you get sinks even though the hold numbers 'look right'

**Typical / how to set:** A big step down from fill speed is normal — your screen runs fill at 175 mm/sec and H.V. Limit at 22 mm/sec.

**Watch out:** If actual Pack P. never reaches your set hold pressure, check this before blaming the hold setting itself.

*Related defects: flash, sink_marks*  
*Interacts with: hold_pressure, vp_transfer_position*

---

### Ret Vel (Return Velocity after Hold)
*Also called: post-hold retract*  
*Units: mm/sec (OFF or a speed)*

An optional controlled screw retract immediately after hold ends, before dosing starts. It bleeds off residual melt pressure so recovery starts from a consistent, relaxed state.

**If you RAISE it:**
- Faster pressure relief between hold and dose; can calm nozzle drool and make dose start more repeatable

**If you LOWER it:**
- OFF (like your screen): dosing starts against whatever residual pressure is left — usually fine, and one less setting in play

**Typical / how to set:** Most processes run this OFF and manage decompression with the pull-back settings instead. Turn it on only to solve a specific dose-start or drool problem.

**Watch out:** Its job overlaps with pre-dose Pull Back — use one or the other deliberately, not both blindly.

*Related defects: drooling, stringing*  
*Interacts with: pull_back_before_dose, pull_back_after_dose*

---

## Dose / Plasticizing

### Dose End Position (Shot Size)
*Also called: shot size, charge position, dose stroke*  
*Units: mm (screw position)*

The screw position where dosing stops — this IS your shot size. It sets how much melt is in front of the screw for the next shot, and together with V-P it determines your cushion.

**If you RAISE it:**
- Bigger shot. With V-P unchanged, more material is injected before transfer — cavity runs fuller at transfer (flash/overpack risk) and cushion grows
- More melt sitting in the barrel front each cycle (slightly more residence time)

**If you LOWER it:**
- Smaller shot — short shots appear, and cushion shrinks toward zero (once cushion is gone, hold pressure can't reach the part at all)

**Typical / how to set:** Size the shot so cushion lands small but healthy and stable. Working rule: use Dose Position to place your cushion, use V-P to place how full the cavity is at transfer — don't fix one problem with the other's knob.

**Watch out:** Any change here shifts where every fill stage break lands on the part — re-check stage positions and V-P after moving shot size.

*Related defects: short_shot, flash, sink_marks*  
*Interacts with: vp_transfer_position, fill_stage_positions, pull_back_after_dose*

---

### Screw Rotation Speed (1st / End)
*Also called: Rot., recovery speed, screw speed*  
*Units: rpm*

How fast the screw spins while recovering (dosing) the next shot. Rotation drags pellets forward and generates shear heat — it's a major contributor to real melt temperature, often more than people credit the heater bands for.

**If you RAISE it:**
- Shorter dose time
- More shear heating — hotter melt than the barrel setpoints suggest
- Hard on shear-sensitive and filled materials (glass fiber breakage, degradation, black specks over time)
- Pushed too far: pellets race through without enough melting time — unmelts and inconsistent melt

**If you LOWER it:**
- Gentler, more uniform conductive melting; friendlier to shear-sensitive resins
- Longer dose time — completely free as long as dosing still finishes inside the cooling window

**Typical / how to set:** Best practice: the slowest RPM that finishes dosing comfortably within cooling time (dose time around 80% of the cooling window is a good target). Tapering the End stage RPM down gives a soft, repeatable dose stop.

**Watch out:** Free cycle-time hiding here: if dose finishes way before cooling ends, you can slow the screw down for better melt quality at zero cycle cost.

*Related defects: splay, black_specks, unmelts, color_streaks, brittleness*  
*Interacts with: back_pressure, cool_time, dose_delay*

---

### Back Pressure (1st / End)
*Also called: B.P.*  
*Units: kgf/cm2*

The resistance the screw must push against while it retracts during dosing. It works the melt: more back pressure squeezes and mixes the material harder as it's conveyed forward.

**If you RAISE it:**
- Better mixing and color dispersion, denser and more consistent melt (steadier part weights)
- Squeezes out trapped air and volatiles
- More shear heat (raises real melt temp) and longer dose time
- Too high: degrades shear-sensitive resins, breaks glass fibers, overworks the dose servo on an all-electric

**If you LOWER it:**
- Faster, easier recovery, gentler on material
- Too low: trapped air and unmelts ride forward, color swirls/streaks, shot-density scatter shows up as part-weight variation

**Typical / how to set:** Low and steady wins — just enough for a consistent dose time and clean melt. Your screen runs 25/25 kgf/cm2, which is in sane low territory for most resins.

**Watch out:** Back pressure is a melt-temperature knob in disguise. If you raise it meaningfully, expect the melt to run hotter even with unchanged barrel setpoints.

*Related defects: splay, unmelts, color_streaks, voids, dimensional_drift*  
*Interacts with: screw_rpm, barrel_temps*

---

### Pull Back — Before Dose
*Also called: pre-dose decompression*  
*Units: mm + mm/sec*

A small screw retract before rotation starts (yours: 0.50 mm at 25 mm/sec). It relieves leftover hold pressure so the screw starts recovery from a consistent, unloaded state instead of fighting residual pressure.

**If you RAISE it:**
- More pressure relief before dosing — can steady dose time and dose start on stubborn processes
- Too much just adds stroke and time for no benefit

**If you LOWER it:**
- Dosing starts against residual pressure — usually fine; slightly less consistent recovery on some materials

**Typical / how to set:** Small — a fraction of a millimeter to ~1 mm. Yours at 0.50 mm is textbook.

**Watch out:** Don't confuse this with the after-dose pull back — that one is the drool/stringing fix.

*Related defects: dimensional_drift*  
*Interacts with: hold_return_velocity, pull_back_after_dose*

---

### Pull Back — After Dose
*Also called: suck back, decompression, the +mm field after dose*  
*Units: mm + mm/sec*

After the shot is dosed, the screw pulls back a set distance without rotating (yours: 4.00 mm at 15 mm/sec). This decompresses the melt in front of the screw so it doesn't ooze out of the nozzle between cycles.

**If you RAISE it:**
- Less nozzle drool and gate stringing; relieves melt pressure before the mold opens
- Too much: sucks air into the nozzle/melt front — splay and bubbles at the gate on the next shot, cold-slug problems, and cushion/first-stage inconsistency

**If you LOWER it:**
- Too little: drool from the nozzle, strings on parts and sprues, cold slugs that jam gates and leave surface defects

**Typical / how to set:** As little as reliably stops the drool — creep it up in 0.5 mm steps only until stringing disappears, then stop.

**Watch out:** If splay shows up only at the gate and the material is verified dry, over-aggressive suck back pulling in air is a top suspect.

*Related defects: drooling, stringing, splay, voids*  
*Interacts with: dose_position, nozzle_temp, dose_delay*

---

### Dose Delay
*Also called: recovery delay, charge delay*  
*Units: sec*

A wait after hold ends before the screw starts rotating. It shifts dosing later inside the cooling window, so the prepared melt spends less time sitting hot in the barrel before it gets injected.

**If you RAISE it:**
- Fresher melt at injection — helps heat-sensitive resins and drool-prone setups
- Too long: dosing no longer finishes inside cooling time and it starts stretching your cycle

**If you LOWER it:**
- Zero (like your screen): dosing starts immediately — standard for most jobs; melt simply waits a bit longer before the next shot

**Typical / how to set:** Usually 0. Reach for it with heat-sensitive materials (POM, PVC, some flame-retardant grades) or hot-runner drool fights. Keep delay + dose time inside cooling time.

**Watch out:** Check Dose Time after adding delay — if delay + dose now exceeds cooling, the machine waits on the screw and your cycle grows.

*Related defects: splay, black_specks, drooling, brittleness*  
*Interacts with: cool_time, screw_rpm*

---

## Cooling & Cycle

### Cooling Time
*Also called: Cool, cure time*  
*Units: sec*

How long the mold stays clamped after hold ends while the part solidifies. Dosing happens during this window, so cooling time is 'free' screw-recovery time too.

**If you RAISE it:**
- Part ejects stiffer and cooler: less warp and distortion, fewer ejector push marks, steadier dimensions, less post-mold shrink surprise
- Directly longer cycle — this is usually the biggest single block of cycle time

**If you LOWER it:**
- Shorter cycle
- Too short: hot floppy parts — warp, ejector pins punch or drag, parts stick or hang, dimensions wander for hours after molding

**Typical / how to set:** Driven by the thickest wall section. Hard floor: cooling must exceed dose time (+ dose delay) with margin, or dosing sets your cycle instead of cooling. Your screen: 1.2 sec cooling vs 0.67 sec dose — fits, thin margin.

**Watch out:** Chasing cycle time by cutting cooling is the classic false economy — you pay it back in warp scrap and dimensional complaints.

*Related defects: warpage, ejector_marks, dimensional_drift, sticking*  
*Interacts with: hold_time, screw_rpm, dose_delay, mold_temp*

---

### Interval Time
*Also called: cycle interval, pause time*  
*Units: sec*

A deliberate pause between cycles (around mold-open) before the next cycle starts. Used for operator part removal in semi-auto, insert loading, or intentionally slowing a cycle.

**If you RAISE it:**
- More open time between cycles; also cools the melt sitting in the barrel longer (can matter for heat-sensitive resins — in either direction)

**If you LOWER it:**
- Tighter cycle; 0 (like your screen) is standard for full-auto

**Typical / how to set:** 0 in full-auto. Anything else should have a reason written on the setup sheet.

**Watch out:** Inconsistent manual intervals in semi-auto = inconsistent melt residence = inconsistent parts. If semi-auto parts vary and auto parts don't, this is why.

*Related defects: black_specks, splay*  
*Interacts with: cool_time, dose_delay*

---

## Clamp

### Clamp Force Setting
*Also called: tonnage, Clamp F*  
*Units: TF (tons)*

How hard the machine squeezes the mold halves together to resist cavity pressure during fill and pack. Too little and the mold blows open at the parting line; too much and you crush your own vents.

**If you RAISE it:**
- More resistance to flash at the parting line
- Too high: vents crush shut — trapped gas causes burns and shorts (yes, too MUCH tonnage causes shorts), platen/mold stress, accelerated tool wear, wasted energy

**If you LOWER it:**
- Vents breathe better (fewer burns, cleaner fills at end of flow), gentler on the tool
- Too low: flash at the parting line, especially at the moment of V-P transfer

**Typical / how to set:** Rule of thumb 2-5 tons per square inch of projected part area, but the modern method is: find the lowest tonnage that doesn't flash, then add a small margin. Your screen shows the machine computed a minimum of ~14-15 TF while set at 100 TF — worth a low-tonnage trial; there may be venting and mold-life gains sitting there.

**Watch out:** Watch Peak Clamp on the Actual display — if peak tonnage rises above setpoint during injection, the cavity pressure is bending things and either tonnage or pack aggression needs attention.

*Related defects: flash, burn_marks, short_shot*  
*Interacts with: hold_pressure, fill_velocity, auto_clamp_correction*

---

### Full Auto Clamp Force Correction
*Also called: auto tonnage correction*  
*Units: ON/OFF*

A Sumitomo function that monitors actual clamp force and automatically re-corrects it as the mold and toggle grow with heat. Without it, tonnage drifts as everything warms up through the shift.

**If you RAISE it:**
- ON (like your screen): tonnage stays at setpoint from cold start to full thermal soak — no morning-vs-afternoon flash mysteries, and it protects the toggle from thermal-expansion overload

**If you LOWER it:**
- OFF: tonnage wanders with temperature — a mold that vents fine at 7 AM can flash or burn by noon, and thermal growth can silently over-tonnage the machine

**Typical / how to set:** Leave ON for production. The Min. Clamp F. Value readout (14-15 TF on yours) is the machine telling you the computed floor it will correct against.

**Watch out:** If this faults or fights you, check tie-bar/mold parallelism and mold-height setup before disabling it — it's usually reporting a real mechanical issue.

*Related defects: flash, burn_marks, dimensional_drift*  
*Interacts with: clamp_force*

---

## Still to verify against the machine/manual

- Zero Set (Time) — exact zeroing behavior on the SE-EV load cell; confirm in manual before writing the entry
- Flash (0.000 sec field under Zero Set) — confirm what this monitors on your control
- Dose 1st/End stage position convention — confirm which direction the 3.50 mm stage break counts on your screen
- Flow-Check — confirm exact check-ring test behavior and threshold units on the SE-EV
