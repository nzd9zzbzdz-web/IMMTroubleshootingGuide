/* SE180EV Troubleshooting Guide — app logic (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var DB = window.APP_DATA;

  /* ---------- indexes ---------- */
  var S = {}, A = {}, DF = {}, AL = {}, G = {};
  DB.settings.forEach(function (x) { S[x.id] = x; });
  DB.actuals.forEach(function (x) { A[x.id] = x; });
  DB.defects.forEach(function (x) { DF[x.id] = x; });
  DB.alarms.forEach(function (x) { AL[x.id] = x; });
  DB.guides.forEach(function (x) { G[x.id] = x; });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- icons ---------- */
  var P = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var I = {
    settings: P + '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2.2" fill="var(--panel)"/><circle cx="15" cy="12" r="2.2" fill="var(--panel)"/><circle cx="7" cy="18" r="2.2" fill="var(--panel)"/></svg>',
    actuals: P + '<path d="M4 15a8 8 0 0 1 16 0"/><line x1="12" y1="15" x2="16" y2="9"/><line x1="3" y1="19" x2="21" y2="19"/></svg>',
    defects: P + '<path d="M12 3l9 16H3z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="16.6" x2="12.01" y2="16.6"/></svg>',
    alarms: P + '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
    guides: P + '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13"/></svg>',
    wizard: P + '<line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>',
    back: P + '<polyline points="14 5 7 12 14 19"/></svg>',
    search: P + '<circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>',
    sun: P + '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.1" y2="4.9"/></svg>',
    moon: P + '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>',
    chev: P + '<polyline points="9 6 15 12 9 18"/></svg>'
  };

  /* ---------- cross-link helpers ---------- */
  function kindOf(id) {
    if (S[id]) return { k: "setting", label: "Setting", name: S[id].name };
    if (A[id]) return { k: "actual", label: "Actual", name: A[id].name };
    if (DF[id]) return { k: "defect", label: "Defect", name: DF[id].name };
    if (AL[id]) return { k: "alarm", label: "Alarm", name: AL[id].name };
    if (G[id]) return { k: "guide", label: "Guide", name: G[id].name };
    return null;
  }
  function chip(id) {
    var t = kindOf(id);
    if (!t) return "";
    return '<a class="chip" href="#/' + t.k + "/" + id + '"><span class="ck">' + t.label + "</span>" + esc(t.name) + "</a>";
  }
  function chips(ids) {
    return '<div class="chips">' + (ids || []).map(chip).join("") + "</div>";
  }
  function vchip(label, value) {
    return '<span class="vchip"><span class="vl">' + esc(label) + "</span>" + esc(value) + "</span>";
  }
  function ghead(text, note) {
    return '<div class="ghead"><span class="eyebrow">' + text + "</span>" +
      (note ? '<div class="note">' + esc(note) + "</div>" : "") + '<div class="rule"></div></div>';
  }
  function listRow(href, title, sub, right) {
    return '<a class="card row" href="' + href + '"><div class="rc"><div class="rt">' + esc(title) + "</div>" +
      (sub ? '<div class="rs">' + esc(sub) + "</div>" : "") + "</div>" +
      (right || "") + '<span class="chev">' + I.chev + "</span></a>";
  }
  function rlPanel(cls, glyph, label, items) {
    return '<div class="rlp ' + cls + '"><div class="rlh"><span class="glyph">' + glyph +
      '</span><span class="rll">' + label + "</span></div><ul>" +
      items.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div>";
  }
  function callout(cls, title, bodyHtml) {
    return '<div class="callout ' + cls + '"><span class="ct">' + title + "</span>" + bodyHtml + "</div>";
  }

  /* ---------- pages ---------- */
  function pageHome() {
    var c = function (n) { return '<span class="pill">' + n + "</span>"; };
    return (
      '<div class="plate">' +
        '<span class="eyebrow">Sumitomo all-electric</span>' +
        "<h1>SE180EV Troubleshooting Guide</h1>" +
        '<div class="specs">' + vchip("Machine", "SE180EV") + vchip("Spec", "C360M") + vchip("Screw", "\u03c636 mm") + vchip("Control", "NC touchscreen") + "</div>" +
      "</div>" +
      '<div style="height:14px"></div>' +
      '<button class="search" id="homeSearch" style="text-align:left;color:var(--muted);cursor:pointer">Search settings, defects, alarms\u2026</button>' +
      '<div class="hint">TIP &mdash; press / anywhere to search</div>' +
      '<a class="card row wizcta" href="#/wizard">' +
        '<span class="icobox">' + I.wizard + '</span>' +
        '<div class="rc"><div class="rt">Diagnose a part</div>' +
        '<div class="rs">Not sure what it’s called? Answer a few questions → likely defect + fixes</div></div>' +
        '<span class="chev">' + I.chev + "</span></a>" +
      ghead("Sections") +
      '<div class="stack">' +
        homeCard("settings", "Settings Encyclopedia", "Every setting: what it is, raise vs lower, cautions", DB.settings.length) +
        homeCard("actuals", "Actual Values", "What the monitored numbers mean and what drift tells you", DB.actuals.length) +
        homeCard("defects", "Defect Library", "Symptom \u2192 ranked causes \u2192 exact setting fixes", DB.defects.length) +
        homeCard("alarms", "Alarms &amp; Faults", "What tripped, safe first response, root causes", DB.alarms.length) +
        homeCard("guides", "Fundamentals", "Short reads: decoupled molding, studies, cushion, drying", DB.guides.length) +
      "</div>" +
      '<div class="foot">v1.0 &middot; knowledge base v0.1-draft &middot; verify on the floor before trusting blindly</div>'
    );
  }
  function homeCard(key, title, sub, n) {
    return '<a class="card row" href="#/' + key + '"><span class="icobox">' + I[key] + '</span>' +
      '<div class="rc"><div class="rt">' + title + '</div><div class="rs">' + sub + "</div></div>" +
      '<span class="readout"><span class="led"></span><span class="count">' + n + "</span></span>" +
      '<span class="chev">' + I.chev + "</span></a>";
  }

  var SCREEN_ORDER = ["Plast", "Mold", "Temperature"];
  function pageSettings() {
    var h = "";
    SCREEN_ORDER.forEach(function (scr) {
      var inScreen = DB.settings.filter(function (s) { return s.screen === scr; });
      if (!inScreen.length) return;
      h += ghead(esc(scr.toUpperCase()) + " SCREEN");
      var groups = [];
      inScreen.forEach(function (s) { if (groups.indexOf(s.group) < 0) groups.push(s.group); });
      groups.forEach(function (g) {
        h += '<div class="ghead" style="margin-top:14px"><span class="eyebrow" style="color:var(--accent)">' + esc(g) + "</span></div>";
        h += '<div class="stack">' + inScreen.filter(function (s) { return s.group === g; })
          .map(function (s) { return listRow("#/setting/" + s.id, s.name, s.units); }).join("") + "</div>";
      });
    });
    var tv = (DB.meta && DB.meta.toVerify) || [];
    if (tv.length) {
      h += callout("co-amber", "Draft &mdash; still to verify on the machine",
        "<ul>" + tv.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>");
    }
    return '<h1 class="pg">Settings Encyclopedia</h1><p class="lead dim">Grouped the way the control lays them out. Tap a setting for raise/lower effects, cautions, and links.</p>' + h;
  }

  function pageSetting(id) {
    var s = S[id];
    if (!s) return notFound();
    var h = '<span class="eyebrow">' + esc(s.screen) + ' screen<span class="sep">&middot;</span>' + esc(s.group) + "</span>" +
      '<h1 class="pg">' + esc(s.name) + "</h1>";
    if (s.alsoCalled && s.alsoCalled.length) {
      h += '<div class="chips">' + s.alsoCalled.map(function (a) { return '<span class="tag">' + esc(a) + "</span>"; }).join("") + "</div>";
    }
    h += '<div class="sect"><span class="eyebrow">Units</span><p style="font-family:var(--mono);color:var(--amber);font-size:14px">' + esc(s.units) + "</p></div>";
    h += '<p class="lead">' + esc(s.whatItIs) + "</p>";
    h += '<div class="rl">' + rlPanel("raise", "\u2191", "If you raise it", s.raiseEffects) + rlPanel("lower", "\u2193", "If you lower it", s.lowerEffects) + "</div>";
    h += '<div class="sect"><span class="eyebrow">Typical / how to set</span><p>' + esc(s.typicalRange) + "</p></div>";
    if (s.cautions) h += callout("co-warn", "Watch out", "<div>" + esc(s.cautions) + "</div>");
    if (s.relatedActuals && s.relatedActuals.length) h += '<div class="sect"><span class="eyebrow">Read it on the Actual display</span>' + chips(s.relatedActuals) + "</div>";
    if (s.relatedDefects && s.relatedDefects.length) h += '<div class="sect"><span class="eyebrow">Defects this setting touches</span>' + chips(s.relatedDefects) + "</div>";
    if (s.interactsWith && s.interactsWith.length) h += '<div class="sect"><span class="eyebrow">Interacts with</span>' + chips(s.interactsWith) + "</div>";
    return h;
  }

  function pageActuals() {
    return '<h1 class="pg">Actual Values</h1>' +
      '<p class="lead dim">The monitored numbers are the machine telling you the truth.</p>' +
      '<div style="height:14px"></div><div class="stack">' +
      DB.actuals.map(function (a) {
        return listRow("#/actual/" + a.id, a.name, null);
      }).join("") + "</div>" +
      (DB.actualsToVerify && DB.actualsToVerify.length
        ? callout("co-amber", "Draft &mdash; still to verify", "<ul>" + DB.actualsToVerify.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>")
        : "");
  }

  function pageActual(id) {
    var a = A[id];
    if (!a) return notFound();
    return '<span class="eyebrow">Actual value</span><h1 class="pg">' + esc(a.name) + "</h1>" +
      '<p class="lead">' + esc(a.whatItTells) + "</p>" +
      callout("co-ok", "Healthy looks like", "<div>" + esc(a.healthy) + "</div>") +
      '<div class="rl">' + rlPanel("raise", "\u2197", "If it rises", [a.rising]) + rlPanel("lower", "\u2198", "If it falls", [a.falling]) + "</div>" +
      '<div class="sect"><span class="eyebrow">Check first</span><ol class="steps">' +
      a.checkFirst.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ol></div>";
  }

  var defectFilter = "";
  function pageDefects() {
    return '<h1 class="pg">Defect Library</h1>' +
      '<p class="lead dim">Find the symptom, work the causes top-down &mdash; they are ranked most-likely first.</p>' +
      '<div style="height:12px"></div>' +
      '<input class="search" id="dfilter" type="search" placeholder="Filter defects\u2026 (splay, sink, flash)" value="' + esc(defectFilter) + '">' +
      '<div id="dlist">' + defectListHtml(defectFilter) + "</div>";
  }
  function defectListHtml(f) {
    f = (f || "").toLowerCase().trim();
    var list = DB.defects.filter(function (d) {
      return !f || (d.name + " " + d.id + " " + d.category + " " + d.description).toLowerCase().indexOf(f) >= 0;
    });
    if (!list.length) return '<div class="empty">No match &mdash; try a shorter word (e.g. "sink").</div>';
    var cats = [];
    list.forEach(function (d) { if (cats.indexOf(d.category) < 0) cats.push(d.category); });
    return cats.map(function (c) {
      return ghead(esc(c.toUpperCase())) + '<div class="grid2">' +
        list.filter(function (d) { return d.category === c; })
          .map(function (d) { return listRow("#/defect/" + d.id, d.name, d.description.split(" \u2014 ")[0].slice(0, 64)); }).join("") +
        "</div>";
    }).join("");
  }

  function pageDefect(id) {
    var d = DF[id];
    if (!d) return notFound();
    var h = '<span class="eyebrow">Defect<span class="sep">&middot;</span>' + esc(d.category) + "</span>" +
      '<h1 class="pg">' + esc(d.name) + '</h1><p class="lead">' + esc(d.description) + "</p>";
    h += callout("co-info", "Quick check", "<ul>" + d.quickCheck.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ul>");
    h += ghead("CAUSES &mdash; MOST LIKELY FIRST");
    h += '<div class="stack">' + d.causes.map(function (c) {
      return '<div class="card cause"><span class="cnum">' + c.rank + '</span><div class="cc">' +
        '<div class="ct1">' + esc(c.cause) + "</div>" +
        '<div class="cfix"><b>Fix</b>' + esc(c.fix) + "</div>" +
        (c.settings && c.settings.length ? chips(c.settings) : "") +
        "</div></div>";
    }).join("") + "</div>";
    h += '<div class="sect"><span class="eyebrow">Diagnostic path</span><ol class="steps">' +
      d.diagnosticSteps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol></div>";
    if (d.notes) h += callout("co-amber", "Material note", "<div>" + esc(d.notes) + "</div>");
    return h;
  }

  function pageAlarms() {
    function rows(list) {
      return '<div class="stack">' +
        list.map(function (a) { return listRow("#/alarm/" + a.id, a.name, a.whatTriggers.slice(0, 74) + "\u2026"); }).join("") +
        "</div>";
    }
    var machine = DB.alarms.filter(function (a) { return a.group !== "robot"; });
    var robot = DB.alarms.filter(function (a) { return a.group === "robot"; });
    var h = '<h1 class="pg">Alarms &amp; Faults</h1>' +
      '<p class="lead dim">What tripped, what to do first without making it worse, then the real causes.</p>' +
      ghead("Machine \u2014 SE180EV") + rows(machine);
    if (robot.length) {
      h += ghead("Take-out robot \u2014 Yushin", "General drafts \u2014 to be matched to your robot\u2019s actual fault names and codes.") + rows(robot);
    }
    return h;
  }

  function pageAlarm(id) {
    var a = AL[id];
    if (!a) return notFound();
    var h = '<span class="eyebrow">' + (a.group === "robot" ? "Robot fault" : "Alarm / fault") + '</span><h1 class="pg">' + esc(a.name) + "</h1>" +
      '<p class="lead">' + esc(a.whatTriggers) + "</p>" +
      (a.draft ? callout("co-amber", "Draft — verify on your robot", "<div>Written from general take-out robot practice, not yet matched to this cell’s actual fault names and codes. Confirm against the Yushin pendant / manual.</div>") : "") +
      callout("co-warn", "Safe first response", "<div>" + esc(a.safeFirstResponse) + "</div>") +
      '<div class="sect"><span class="eyebrow">Root causes &mdash; most likely first</span><ol class="steps">' +
      a.rootCauses.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol></div>" +
      '<div class="sect"><span class="eyebrow">Prevention</span><p>' + esc(a.prevention) + "</p></div>";
    if (a.relatedSettings && a.relatedSettings.length) h += '<div class="sect"><span class="eyebrow">Related settings</span>' + chips(a.relatedSettings) + "</div>";
    if (a.relatedDefects && a.relatedDefects.length) h += '<div class="sect"><span class="eyebrow">Related defects</span>' + chips(a.relatedDefects) + "</div>";
    return h;
  }

  function pageGuides() {
    return '<h1 class="pg">Fundamentals</h1>' +
      '<p class="lead dim">Short reads that make everything else on this machine make sense.</p>' +
      '<div style="height:14px"></div><div class="stack">' +
      DB.guides.map(function (g) { return listRow("#/guide/" + g.id, g.name, null, '<span class="pill">' + g.minutes + " min</span>"); }).join("") +
      "</div>";
  }

  function pageGuide(id) {
    var g = G[id];
    if (!g) return notFound();
    return '<span class="eyebrow">Fundamentals<span class="sep">&middot;</span>' + g.minutes + ' min read</span>' +
      '<h1 class="pg">' + esc(g.name) + '</h1><div class="prose">' +
      g.body.split("\n\n").map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
  }

  /* ---------- symptom wizard ---------- */
  function pageWizard(id) {
    var W = DB.wizard;
    if (!W) return notFound();
    var node = W.nodes[id || W.start];
    if (!node) return notFound();
    if (node.result) return wizardResult(node.result);
    var h = '<span class="eyebrow">Symptom wizard</span>' +
      '<h1 class="pg">' + esc(node.q) + "</h1>" +
      '<p class="lead dim">Pick what best matches what you see &mdash; back steps you through the questions.</p>' +
      '<div style="height:12px"></div><div class="stack">' +
      node.options.map(function (o) {
        return '<a class="card row" href="#/wizard/' + esc(o.next) + '"><div class="rc"><div class="rt">' +
          esc(o.a) + '</div></div><span class="chev">' + I.chev + "</span></a>";
      }).join("") + "</div>" +
      '<div class="sect"><a class="chip" href="#/wizard"><span class="ck">Restart</span>Start over</a></div>';
    return h;
  }
  function wizardResult(res) {
    var p = DF[res.primary];
    if (!p) return notFound();
    var h = '<span class="eyebrow">Symptom wizard<span class="sep">&middot;</span>likely cause</span>' +
      '<h1 class="pg">' + esc(p.name) + '</h1><p class="lead">' + esc(p.description) + "</p>" +
      '<div style="height:14px"></div>' +
      '<a class="card row" href="#/defect/' + p.id + '"><span class="icobox">' + I.defects + "</span>" +
      '<div class="rc"><div class="rt">Open full troubleshooting</div>' +
      '<div class="rs">Ranked causes, exact setting fixes, diagnostic path</div></div>' +
      '<span class="chev">' + I.chev + "</span></a>";
    if (res.also && res.also.length) {
      h += '<div class="sect"><span class="eyebrow">If that’s not it, also consider</span>' + chips(res.also) + "</div>";
    }
    h += '<div class="sect"><a class="chip" href="#/wizard"><span class="ck">Restart</span>Start over</a></div>';
    return h;
  }

  /* ---------- search ---------- */
  var q = "";
  var INDEX = [];
  function buildIndex() {
    DB.settings.forEach(function (x) { INDEX.push(ix("setting", x.id, x.name, x.screen + " \u00b7 " + x.group, [x.name, (x.alsoCalled || []).join(" "), x.whatItIs, x.units])); });
    DB.defects.forEach(function (x) { INDEX.push(ix("defect", x.id, x.name, x.category, [x.name, x.description, x.category])); });
    DB.alarms.forEach(function (x) { INDEX.push(ix("alarm", x.id, x.name, x.group === "robot" ? "Robot fault" : "Alarm", [x.name, x.whatTriggers])); });
    DB.actuals.forEach(function (x) { INDEX.push(ix("actual", x.id, x.name, "Actual value", [x.name, x.whatItTells])); });
    DB.guides.forEach(function (x) { INDEX.push(ix("guide", x.id, x.name, x.minutes + " min read", [x.name, x.body])); });
  }
  function ix(kind, id, name, sub, hayParts) {
    return { kind: kind, id: id, name: name, sub: sub, lname: name.toLowerCase(), hay: hayParts.join(" ").toLowerCase() };
  }
  function doSearch(query) {
    var qq = query.toLowerCase().trim();
    if (!qq) return null;
    var scored = [];
    INDEX.forEach(function (it) {
      var sc = 0;
      if (it.lname.indexOf(qq) === 0) sc = 4;
      else if (it.lname.indexOf(qq) >= 0) sc = 3;
      else if (it.hay.indexOf(qq) >= 0) sc = 1;
      if (sc) scored.push([sc, it]);
    });
    scored.sort(function (a, b) { return b[0] - a[0]; });
    return scored.map(function (p) { return p[1]; });
  }
  var KIND_LABEL = { setting: "SETTINGS", defect: "DEFECTS", alarm: "ALARMS", actual: "ACTUAL VALUES", guide: "FUNDAMENTALS" };
  function pageSearch() {
    return '<h1 class="pg">Search</h1>' +
      '<input class="search" id="q" type="search" placeholder="splay, cushion, back pressure, flash\u2026" value="' + esc(q) + '" autocomplete="off">' +
      '<div id="sr">' + resultsHtml(q) + "</div>";
  }
  function resultsHtml(query) {
    if (!query.trim()) return '<div class="hint" style="margin-top:14px">Search across ' + INDEX.length + " entries: settings, actuals, defects, alarms, and guides.</div>";
    var res = doSearch(query);
    if (!res || !res.length) return '<div class="empty">Nothing found for &ldquo;' + esc(query) + '&rdquo;. Try one word.</div>';
    var order = ["setting", "defect", "alarm", "actual", "guide"];
    return order.map(function (k) {
      var of = res.filter(function (r) { return r.kind === k; }).slice(0, 6);
      if (!of.length) return "";
      return ghead(KIND_LABEL[k]) + '<div class="stack">' +
        of.map(function (r) { return listRow("#/" + r.kind + "/" + r.id, r.name, r.sub); }).join("") + "</div>";
    }).join("");
  }

  function notFound() {
    return '<div class="empty">Not found. <a href="#/" style="color:var(--accent)">Back to home</a></div>';
  }

  /* ---------- router ---------- */
  var TABS = [
    ["settings", "Settings"], ["actuals", "Actuals"], ["defects", "Defects"], ["alarms", "Alarms"], ["guides", "Guides"]
  ];
  function parse() {
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("/");
    return { page: parts[0] || "home", id: parts[1] ? decodeURIComponent(parts[1]) : null };
  }
  /* explicit nav trail — reliable when opened from a file or Home Screen,
     where history.length is unreliable */
  var trail = [];
  function currentHash() { return location.hash || "#/"; }
  function render() {
    var r = parse(), html = "";
    var ch = currentHash();
    if (trail[trail.length - 1] !== ch) trail.push(ch);
    switch (r.page) {
      case "home": html = pageHome(); break;
      case "settings": html = pageSettings(); break;
      case "setting": html = pageSetting(r.id); break;
      case "actuals": html = pageActuals(); break;
      case "actual": html = pageActual(r.id); break;
      case "defects": html = pageDefects(); break;
      case "defect": html = pageDefect(r.id); break;
      case "alarms": html = pageAlarms(); break;
      case "alarm": html = pageAlarm(r.id); break;
      case "guides": html = pageGuides(); break;
      case "guide": html = pageGuide(r.id); break;
      case "wizard": html = pageWizard(r.id); break;
      case "search": html = pageSearch(); break;
      default: html = notFound();
    }
    var view = document.getElementById("view");
    view.innerHTML = html;
    view.classList.remove("view"); void view.offsetWidth; view.classList.add("view");
    document.getElementById("backBtn").hidden = (r.page === "home" || (!r.id && r.page !== "search" && TABS.some(function (t) { return t[0] === r.page; })));
    paintTabs(r.page);
    window.scrollTo(0, 0);
    wire(r);
  }
  function paintTabs(page) {
    var singular = { setting: "settings", actual: "actuals", defect: "defects", alarm: "alarms", guide: "guides" };
    var active = singular[page] || page;
    document.getElementById("tabs").innerHTML = TABS.map(function (t) {
      return '<a class="tab' + (active === t[0] ? " active" : "") + '" href="#/' + t[0] + '">' + I[t[0]] + "<span>" + t[1] + "</span></a>";
    }).join("");
  }
  function wire(r) {
    var hs = document.getElementById("homeSearch");
    if (hs) hs.onclick = function () { location.hash = "#/search"; };
    var qi = document.getElementById("q");
    if (qi) {
      qi.focus();
      try { qi.setSelectionRange(qi.value.length, qi.value.length); } catch (e) {}
      qi.oninput = function () { q = qi.value; document.getElementById("sr").innerHTML = resultsHtml(q); };
    }
    var df = document.getElementById("dfilter");
    if (df) df.oninput = function () { defectFilter = df.value; document.getElementById("dlist").innerHTML = defectListHtml(defectFilter); };
  }

  /* ---------- chrome ---------- */
  document.getElementById("backBtn").innerHTML = I.back;
  document.getElementById("backBtn").onclick = function () {
    if (trail.length > 1) {
      trail.pop();                       // drop current
      location.hash = trail[trail.length - 1];  // navigate to previous (render won't re-push it)
    } else {
      location.hash = "#/";
    }
  };
  document.getElementById("searchBtn").innerHTML = I.search;
  document.getElementById("searchBtn").onclick = function () { location.hash = "#/search"; };
  var themeBtn = document.getElementById("themeBtn");
  function paintTheme() { themeBtn.innerHTML = document.body.classList.contains("light") ? I.moon : I.sun; }
  themeBtn.onclick = function () { document.body.classList.toggle("light"); paintTheme(); };
  paintTheme();

  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      if (parse().page !== "search") location.hash = "#/search";
      else { var qi = document.getElementById("q"); if (qi) qi.focus(); }
    }
  });

  window.addEventListener("hashchange", render);
  buildIndex();
  render();
})();
