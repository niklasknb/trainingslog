'use strict';
/* Trainingslog – App-Logik (Vanilla JS, keine Abhängigkeiten) */

const VERSION = '1.0.0';
const WD_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WD_LONG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const COLORS = ['#ff7a1a', '#3b8cff', '#3ccf7a', '#b26bff', '#f5c04a', '#ff5a5a', '#16c2b0', '#ff6fb1'];
const CHECK_SVG = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>';

let S = null;
const UI = {
  tab: 'kalender', calMode: 'week', anchor: null, selDay: null, sessionId: null,
  ex: { q: '', muscle: '', equip: '' }, prog: { q: '' }, planDraft: null,
  metric: 'top', pick: null, persisted: null
};
const sheetStack = [];

/* ---------- Hilfsfunktionen ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function pad(n) { return String(n).padStart(2, '0'); }
function iso(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parse(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(s, n) { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
function todayISO() { return iso(new Date()); }
function wdOf(s) { return (parse(s).getDay() + 6) % 7; }
function weekStart(s) { return addDays(s, -wdOf(s)); }
function daysBetween(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
function fmtShort(s) { const d = parse(s); return `${d.getDate()}.${d.getMonth() + 1}.`; }
function fmtDay(s) { const d = parse(s); return `${WD_SHORT[wdOf(s)]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`; }
function fmtLong(s) { const d = parse(s); return `${WD_LONG[wdOf(s)]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; }
function fmtNum(n) { if (n == null || n === '' || !isFinite(n)) return '–'; return String(Math.round(n * 100) / 100).replace('.', ','); }
function inNum(n) { return n == null ? '' : String(Math.round(n * 100) / 100).replace('.', ','); }
function parseNum(v) {
  if (v == null) return null;
  v = String(v).trim().replace(',', '.');
  if (v === '') return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}
function parseIntOrNull(v) { const n = parseNum(v); return n == null ? null : Math.max(0, Math.round(n)); }
function exCount(n) { return `${n} Übung${n === 1 ? '' : 'en'}`; }
function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- Zustand ---------- */
function defaultState() {
  return {
    version: 1,
    exercises: CATALOG.map(e => ({ ...e })),
    equipmentWeights: JSON.parse(JSON.stringify(DEFAULT_WEIGHTS)),
    templates: [
      { id: uid(), name: 'Push', color: COLORS[0], items: [] },
      { id: uid(), name: 'Pull', color: COLORS[1], items: [] }
    ],
    plans: [],
    overrides: {},
    extras: [],
    sessions: [],
    settings: { strategy: 'same' },
    lastExport: null
  };
}

function migrate(s) {
  const d = defaultState();
  for (const k of Object.keys(d)) if (s[k] == null) s[k] = d[k];
  s.settings = { ...d.settings, ...s.settings };
  for (const eq of EQUIPMENT) if (!Array.isArray(s.equipmentWeights[eq])) s.equipmentWeights[eq] = [...DEFAULT_WEIGHTS[eq]];
  const have = new Set(s.exercises.map(e => e.id));
  for (const c of CATALOG) if (!have.has(c.id)) s.exercises.push({ ...c });
  return s;
}

let saveTimer = null;
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => DB.save(S), 250); }
function saveNow() { clearTimeout(saveTimer); return DB.save(S); }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && S) saveNow(); });
window.addEventListener('pagehide', () => { if (S) saveNow(); });

const exById = id => S.exercises.find(e => e.id === id);
const tplById = id => S.templates.find(t => t.id === id);
const getSession = id => S.sessions.find(s => s.id === id);
function weightsFor(ex) {
  if (!ex) return [];
  if (ex.weights && ex.weights.length) return ex.weights;
  return S.equipmentWeights[ex.equipment] || [];
}
function parseWeightList(text) {
  const vals = String(text || '').split(/[;\s]+/).map(parseNum).filter(v => v != null && v >= 0);
  return [...new Set(vals.map(v => Math.round(v * 100) / 100))].sort((a, b) => a - b);
}
function weightSummary(list) {
  if (!list || !list.length) return 'keine Stufen';
  const sorted = [...list].sort((a, b) => a - b);
  let step = null, even = sorted.length > 2;
  for (let i = 1; i < sorted.length; i++) {
    const d = Math.round((sorted[i] - sorted[i - 1]) * 100) / 100;
    if (step == null) step = d; else if (d !== step) even = false;
  }
  const base = `${fmtNum(sorted[0])}–${fmtNum(sorted[sorted.length - 1])} kg`;
  return even ? `${base}, ${fmtNum(step)}er Schritte` : `${base}, ${sorted.length} Stufen`;
}
function filterExercises(f, includeHidden) {
  const words = norm(f.q || '').split(/\s+/).filter(Boolean);
  return S.exercises
    .filter(e => includeHidden || !e.hidden)
    .filter(e => !f.muscle || e.muscle === f.muscle)
    .filter(e => !f.equip || e.equipment === f.equip)
    .filter(e => { const h = norm(`${e.name} ${e.muscle} ${e.equipment}`); return words.every(w => h.includes(w)); })
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
}
function muscleSelect(key, val) {
  return `<select data-ch="${key}"><option value="">Alle Muskelgruppen</option>${MUSCLES.map(m => `<option ${m === val ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>`;
}
function equipSelect(key, val) {
  return `<select data-ch="${key}"><option value="">Alle Ausrüstung</option>${EQUIPMENT.map(m => `<option ${m === val ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>`;
}

/* ---------- Kalender-Logik ---------- */
function planFor(date) {
  let p = null;
  for (const pl of S.plans) if (pl.validFrom <= date && (!p || pl.validFrom >= p.validFrom)) p = pl;
  return p;
}
function latestPlan() {
  let p = null;
  for (const pl of S.plans) if (!p || pl.validFrom >= p.validFrom) p = pl;
  return p;
}

function occurrences(start, end) {
  const out = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    const plan = planFor(d);
    if (!plan) continue;
    const wd = wdOf(d);
    for (const slot of plan.slots) {
      if (slot.weekday !== wd) continue;
      const key = d + '|' + slot.id;
      const ov = S.overrides[key];
      if (ov && ov.date && ov.date !== d) continue;
      out.push({ key, origDate: d, date: d, templateId: slot.templateId, skipped: !!(ov && ov.skipped) });
    }
  }
  for (const [key, ov] of Object.entries(S.overrides)) {
    if (!ov.date) continue;
    const origDate = key.slice(0, 10);
    if (ov.date === origDate || ov.date < start || ov.date > end) continue;
    const plan = planFor(origDate);
    const slot = plan && plan.slots.find(s => s.id === key.slice(11));
    if (!slot) continue;
    out.push({ key, origDate, date: ov.date, templateId: slot.templateId, moved: true, skipped: !!ov.skipped });
  }
  for (const x of S.extras) {
    if (x.date >= start && x.date <= end) out.push({ key: 'x|' + x.id, extraId: x.id, origDate: x.date, date: x.date, templateId: x.templateId, extra: true });
  }
  const used = new Set();
  for (const o of out) {
    const s = S.sessions.find(s => s.plannedKey === o.key);
    if (s) { o.sessionId = s.id; o.date = s.date; used.add(s.id); }
  }
  for (const s of S.sessions) {
    if (used.has(s.id) || s.date < start || s.date > end) continue;
    out.push({ key: 's|' + s.id, origDate: s.date, date: s.date, templateId: s.templateId, sessionId: s.id, adhoc: true });
  }
  return out.filter(o => o.date >= start && o.date <= end).sort((a, b) => a.date.localeCompare(b.date));
}
function findOcc(key, date) { return occurrences(date, date).find(o => o.key === key); }

function occStatus(o) {
  const t = todayISO();
  const sess = o.sessionId && getSession(o.sessionId);
  if (sess) return sess.finishedAt ? { label: 'Erledigt', cls: 'ok' } : { label: 'Läuft', cls: 'run' };
  if (o.skipped) return { label: 'Ausgelassen', cls: 'skip' };
  if (o.date < t) return { label: 'Verpasst', cls: 'miss' };
  if (o.date === t) return { label: 'Heute', cls: 'run' };
  return { label: 'Geplant', cls: '' };
}

function moveOcc(o, date) {
  if (o.extra) {
    const x = S.extras.find(x => x.id === o.extraId);
    if (x) x.date = date;
    return;
  }
  const ov = S.overrides[o.key] || {};
  if (date === o.origDate) delete ov.date; else ov.date = date;
  ov.templateId = o.templateId;
  if (!ov.date && !ov.skipped) delete S.overrides[o.key]; else S.overrides[o.key] = ov;
}
function setSkipped(o, skipped) {
  const ov = S.overrides[o.key] || {};
  if (skipped) ov.skipped = true; else delete ov.skipped;
  ov.templateId = o.templateId;
  if (!ov.date && !ov.skipped) delete S.overrides[o.key]; else S.overrides[o.key] = ov;
}

/* ---------- Trainings-Logik ---------- */
function makeItem(ex, setCount, repMin, repMax, session) {
  const sug = Progression.suggest(S, {
    exerciseId: ex.id, excludeSessionId: session.id, beforeDate: session.date,
    setCount, repMin, repMax, weights: weightsFor(ex)
  });
  return {
    id: uid(), exerciseId: ex.id, name: ex.name, repMin, repMax,
    sets: sug.sets.map(x => ({ weight: x.weight, reps: x.reps, rir: null, done: false, sugg: true, sw: x.weight, sr: x.reps }))
  };
}
function createSession(tpl, date, plannedKey) {
  const s = {
    id: uid(), date, templateId: tpl ? tpl.id : null, name: tpl ? tpl.name : 'Training', color: tpl ? tpl.color : COLORS[2],
    plannedKey, startedAt: Date.now(), finishedAt: null, items: []
  };
  if (tpl) for (const it of tpl.items) {
    const ex = exById(it.exerciseId);
    if (ex) s.items.push(makeItem(ex, it.sets, it.repMin, it.repMax, s));
  }
  S.sessions.push(s);
  return s;
}
function startFromOcc(o) {
  const t = todayISO();
  let date = o.date;
  if (o.date > t) { moveOcc(o, t); date = t; }
  const tpl = tplById(o.templateId);
  if (!tpl) { toast('Die Vorlage existiert nicht mehr'); return; }
  if (!tpl.items.length) toast('Die Vorlage ist leer – füge Übungen im Training hinzu');
  const s = createSession(tpl, date, o.key);
  save();
  openSession(s.id);
}
function openSession(id) {
  while (sheetStack.length) sheetStack.pop();
  renderSheets();
  UI.sessionId = id;
  render();
  window.scrollTo(0, 0);
}
function doneSets(s) { return s.items.reduce((n, it) => n + it.sets.filter(x => x.done).length, 0); }
function runningSession() {
  return S.sessions.filter(s => !s.finishedAt).sort((a, b) => b.startedAt - a.startedAt)[0] || null;
}

/* ---------- Historie / Fortschritt ---------- */
function exerciseHistory(exId) {
  const res = [];
  for (const s of S.sessions) {
    if (!s.finishedAt) continue;
    for (const it of s.items) {
      if (it.exerciseId !== exId) continue;
      const sets = it.sets.filter(x => x.done && x.reps != null);
      if (!sets.length) continue;
      let top = sets[0], best1rm = 0, volume = 0, maxReps = 0;
      for (const x of sets) {
        const w = x.weight || 0;
        if (w > (top.weight || 0) || (w === (top.weight || 0) && x.reps > top.reps)) top = x;
        best1rm = Math.max(best1rm, Progression.e1rm(w, x.reps, x.rir));
        volume += w * x.reps;
        maxReps = Math.max(maxReps, x.reps);
      }
      res.push({ date: s.date, sessionId: s.id, finishedAt: s.finishedAt, sets, top, e1rm: best1rm, volume, maxReps });
    }
  }
  return res.sort((a, b) => (a.date + a.finishedAt).localeCompare(b.date + b.finishedAt));
}
const METRICS = {
  top: { label: 'Gewicht', unit: 'kg', get: h => h.top.weight || 0 },
  e1rm: { label: 'e1RM', unit: 'kg', get: h => h.e1rm },
  volume: { label: 'Volumen', unit: 'kg', get: h => h.volume },
  reps: { label: 'Max. Wdh', unit: 'Wdh', get: h => h.maxReps }
};

function chartSvg(hist, metricKey) {
  if (hist.length < 2) return '<div class="empty small">Ab zwei Einheiten erscheint hier ein Diagramm.</div>';
  const m = METRICS[metricKey];
  const W = 340, H = 190, pl = 40, pr = 12, pt = 12, pb = 26;
  const ys = hist.map(m.get);
  let mn = Math.min(...ys), mx = Math.max(...ys);
  if (mn === mx) { mn -= 1; mx += 1; }
  const padY = (mx - mn) * 0.12;
  mn = Math.max(0, mn - padY); mx += padY;
  const t0 = parse(hist[0].date).getTime();
  const span = parse(hist[hist.length - 1].date).getTime() - t0;
  const xOf = (h, i) => pl + (W - pl - pr) * (span > 0 ? (parse(h.date).getTime() - t0) / span : i / (hist.length - 1));
  const yOf = v => pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn));
  let g = '';
  for (let i = 0; i <= 3; i++) {
    const v = mn + (mx - mn) * i / 3, y = yOf(v);
    g += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}"/><text x="${pl - 6}" y="${y + 3}" text-anchor="end">${fmtNum(Math.round(v * 10) / 10)}</text>`;
  }
  const pts = hist.map((h, i) => [xOf(h, i), yOf(m.get(h))]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - pb} L${pts[0][0].toFixed(1)},${H - pb} Z`;
  const dots = pts.map(p => `<circle class="pt" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5"/>`).join('');
  const xl = `<text x="${pl}" y="${H - 8}">${fmtShort(hist[0].date)}</text><text x="${W - pr}" y="${H - 8}" text-anchor="end">${fmtShort(hist[hist.length - 1].date)}</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(m.label)}-Verlauf">${g}<path class="area" d="${area}"/><path class="ln" d="${line}"/>${dots}${xl}</svg>`;
}

/* ---------- Rendering: Rahmen ---------- */
function setTop(title, left, right) {
  $('#title').textContent = title;
  $('#topLeft').innerHTML = left || '';
  $('#topRight').innerHTML = right || '';
}
function render(opts = {}) {
  const y = window.scrollY;
  if (UI.sessionId && !getSession(UI.sessionId)) UI.sessionId = null;
  document.body.classList.toggle('in-session', !!UI.sessionId);
  $$('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === UI.tab));
  const r = UI.sessionId ? viewSession() : VIEWS[UI.tab]();
  setTop(r.title, r.left, r.right);
  $('#view').innerHTML = r.html;
  renderBanner();
  if (!opts.top) window.scrollTo(0, y);
}
function renderBanner() {
  const b = $('#banner');
  const s = runningSession();
  if (!s || UI.sessionId) { b.innerHTML = ''; return; }
  b.innerHTML = `<button class="banner-inner" data-act="openSession" data-id="${s.id}" style="width:100%"><span>Training läuft: ${esc(s.name)}</span><span>Fortsetzen ›</span></button>`;
}

/* ---------- Sheets ---------- */
function openSheet(def) { sheetStack.push(def); renderSheets(); }
function topSheet() { return sheetStack[sheetStack.length - 1]; }
function closeSheet() {
  sheetStack.pop();
  renderSheets();
  render();
}
function renderSheets() {
  const root = $('#sheets');
  const prev = $$('.sheet-body', root).map(b => b.scrollTop);
  root.innerHTML = sheetStack.map((d, i) => {
    const r = d.render(d.ctx || {});
    const anim = d._shown ? '' : ' anim';
    d._shown = true;
    const left = r.left != null ? r.left : '<button class="tb-btn" data-act="closeSheet">Schließen</button>';
    return `<div class="backdrop${anim}" data-act="closeSheet" style="z-index:${40 + i * 2}"></div>
      <div class="sheet${d.full ? ' full' : ''}${anim}" style="z-index:${41 + i * 2}">
        <div class="sheet-head"><div class="l">${left}</div><h3>${esc(r.title || '')}</h3><div class="r">${r.right || ''}</div></div>
        <div class="sheet-body">${r.body}</div>
        ${r.foot ? `<div class="sheet-foot">${r.foot}</div>` : ''}
      </div>`;
  }).join('');
  $$('.sheet-body', root).forEach((b, i) => { if (prev[i] != null) b.scrollTop = prev[i]; });
  document.body.style.overflow = sheetStack.length ? 'hidden' : '';
}

/* ---------- Ansicht: Kalender ---------- */
function occHtml(o) {
  const tpl = tplById(o.templateId);
  const sess = o.sessionId && getSession(o.sessionId);
  const name = sess ? sess.name : (tpl ? tpl.name : 'Gelöschte Vorlage');
  const color = sess ? sess.color : (tpl ? tpl.color : '#888');
  const st = occStatus(o);
  let sub = tpl ? exCount(tpl.items.length) : '';
  if (o.extra) sub = 'Zusatztraining';
  if (o.moved) sub = `verschoben von ${WD_SHORT[wdOf(o.origDate)]}, ${fmtShort(o.origDate)}`;
  if (sess) sub = `${doneSets(sess)} Sätze erledigt`;
  return `<button class="occ${o.skipped ? ' skipped' : ''}" data-act="occ" data-key="${esc(o.key)}" data-date="${o.date}">
    <span class="bar" style="background:${color}"></span>
    <span class="grow"><div class="n">${esc(name)}</div><div class="small muted">${esc(sub)}</div></span>
    <span class="pill ${st.cls}">${st.label}</span></button>`;
}

function viewKalender() {
  const t = todayISO();
  const left = `<button class="tb-btn" data-act="calMode">${UI.calMode === 'week' ? 'Monat' : 'Woche'}</button>`;
  const right = `<button class="tb-btn" data-act="calToday">Heute</button>`;
  let html = '';
  const hasItems = S.templates.some(x => x.items.length);
  const hasPlan = S.plans.some(p => p.slots.length);
  if (!hasItems || !hasPlan) {
    html += `<div class="hint"><b>Erste Schritte</b><br>
      ${!hasItems ? '1. Unter <b>Pläne</b> deine Push- und Pull-Vorlage mit Übungen füllen.<br>' : ''}
      ${!hasPlan ? `${hasItems ? '' : '2. '}Unter <b>Pläne</b> den Wochenplan festlegen, z. B. Push am Dienstag.` : ''}
      <div style="margin-top:10px"><button class="btn sm primary" data-act="tab" data-tab="plaene">Zu den Plänen</button></div></div>`;
  }
  const finished = S.sessions.filter(s => s.finishedAt).length;
  if (finished >= 5 && (!S.lastExport || daysBetween(S.lastExport.slice(0, 10), t) > 14)) {
    html += `<div class="hint">Dein letztes Backup ist ${S.lastExport ? `vom ${fmtShort(S.lastExport.slice(0, 10))}` : 'noch nicht erstellt'}. Sichere deine Daten regelmäßig.
      <div style="margin-top:10px"><button class="btn sm primary" data-act="exportData">Backup jetzt erstellen</button></div></div>`;
  }

  if (UI.calMode === 'week') {
    const ws = weekStart(UI.anchor), we = addDays(ws, 6);
    const occ = occurrences(ws, we);
    const a = parse(ws), b = parse(we);
    const lbl = a.getMonth() === b.getMonth()
      ? `${a.getDate()}.–${b.getDate()}. ${MONTHS[b.getMonth()]} ${b.getFullYear()}`
      : `${a.getDate()}. ${MONTHS[a.getMonth()].slice(0, 3)} – ${b.getDate()}. ${MONTHS[b.getMonth()].slice(0, 3)} ${b.getFullYear()}`;
    html += `<div class="cal-nav"><button class="arrow" data-act="calShift" data-d="-1" aria-label="Vorherige Woche">‹</button>
      <div class="lbl">${lbl}</div><button class="arrow" data-act="calShift" data-d="1" aria-label="Nächste Woche">›</button></div><div class="list">`;
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i);
      const items = occ.filter(o => o.date === d);
      html += `<div class="day${d === t ? ' today' : ''}"><div class="dl"><div class="wd">${WD_SHORT[i]}</div><div class="dn">${parse(d).getDate()}</div></div>
        <div class="items">${items.map(occHtml).join('')}${items.length ? '' : `<button class="add-day" data-act="addExtra" data-date="${d}">+ Training</button>`}</div></div>`;
    }
    html += '</div>';
  } else {
    const a = parse(UI.anchor);
    const first = iso(new Date(a.getFullYear(), a.getMonth(), 1));
    const last = iso(new Date(a.getFullYear(), a.getMonth() + 1, 0));
    const gs = weekStart(first), ge = addDays(weekStart(last), 6);
    const occ = occurrences(gs, ge);
    html += `<div class="cal-nav"><button class="arrow" data-act="calShift" data-d="-1" aria-label="Vorheriger Monat">‹</button>
      <div class="lbl">${MONTHS[a.getMonth()]} ${a.getFullYear()}</div><button class="arrow" data-act="calShift" data-d="1" aria-label="Nächster Monat">›</button></div>
      <div class="month-grid">${WD_SHORT.map(w => `<div class="mh">${w}</div>`).join('')}`;
    for (let d = gs; d <= ge; d = addDays(d, 1)) {
      const items = occ.filter(o => o.date === d && !o.skipped);
      const cls = [parse(d).getMonth() !== a.getMonth() ? 'out' : '', d === t ? 'today' : '', d === UI.selDay ? 'sel' : ''].join(' ');
      const dots = items.map(o => {
        const tpl = tplById(o.templateId), s = o.sessionId && getSession(o.sessionId);
        const c = s ? s.color : (tpl ? tpl.color : '#888');
        return `<span class="dot${s && s.finishedAt ? ' done' : ''}" style="background:${c}"></span>`;
      }).join('');
      html += `<button class="mcell ${cls}" data-act="selDay" data-date="${d}"><span class="num">${parse(d).getDate()}</span><span class="dots">${dots}</span></button>`;
    }
    html += '</div>';
    const sel = UI.selDay;
    const items = occurrences(sel, sel);
    html += `<h2 class="sec">${fmtLong(sel)}</h2><div class="list"><div class="day" style="grid-template-columns:1fr"><div class="items">
      ${items.map(occHtml).join('') || '<div class="muted small">Kein Training geplant</div>'}
      <button class="add-day" data-act="addExtra" data-date="${sel}">+ Training hinzufügen</button></div></div></div>`;
  }
  return { title: 'Kalender', left, right, html };
}

function openOccSheet(key, date) {
  const o = findOcc(key, date);
  if (!o) { toast('Termin nicht gefunden'); return; }
  openSheet({
    ctx: { o },
    render({ o }) {
      const tpl = tplById(o.templateId);
      const sess = o.sessionId && getSession(o.sessionId);
      const st = occStatus(o);
      let body = `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div><div style="font-weight:650;font-size:18px">${esc(sess ? sess.name : (tpl ? tpl.name : 'Gelöschte Vorlage'))}</div>
        <div class="muted small">${fmtLong(o.date)}${o.moved ? ` · ursprünglich ${fmtDay(o.origDate)}` : ''}</div></div>
        <span class="pill ${st.cls}">${st.label}</span></div>`;
      if (tpl && !sess) {
        body += `<div class="small muted" style="margin-top:10px">${tpl.items.length ? tpl.items.map(it => esc((exById(it.exerciseId) || {}).name || '?')).join(' · ') : 'Noch keine Übungen in dieser Vorlage.'}</div>`;
      }
      body += '</div><div class="stack">';
      if (sess) {
        body += `<button class="btn primary block" data-act="openSession" data-id="${sess.id}">${sess.finishedAt ? 'Training ansehen' : 'Training fortsetzen'}</button>`;
      } else if (!o.skipped) {
        body += `<button class="btn primary block" data-act="startOcc">Training starten</button>`;
      }
      body += '</div>';
      if (!sess && !o.skipped) {
        const ws = weekStart(o.date);
        body += `<h2 class="sec">Verschieben</h2><div class="week-chips">`;
        for (let i = 0; i < 7; i++) {
          const d = addDays(ws, i);
          body += `<button class="${d === o.date ? 'on' : ''}${d === o.origDate && d !== o.date ? ' orig' : ''}" data-act="moveTo" data-date="${d}">${WD_SHORT[i]}<b>${parse(d).getDate()}</b></button>`;
        }
        body += `</div><label class="field"><span>Oder anderes Datum</span><input type="date" data-ch="moveDate" value="${o.date}"></label>`;
        if (o.moved) body += `<button class="btn block" data-act="moveTo" data-date="${o.origDate}">Zurück auf ${fmtDay(o.origDate)}</button>`;
        body += `<p class="small muted">Verschiebt nur diesen einen Termin. Den festen Wochentag änderst du unter Pläne im Wochenplan.</p>`;
      }
      if (!sess) {
        body += '<div class="stack" style="margin-top:12px">';
        if (o.extra) body += `<button class="btn danger block" data-act="removeExtra">Zusatztraining entfernen</button>`;
        else if (o.skipped) body += `<button class="btn block" data-act="skipOcc" data-v="0">Wiederherstellen</button>`;
        else body += `<button class="btn danger block" data-act="skipOcc" data-v="1">Diesen Termin auslassen</button>`;
        body += '</div>';
      }
      return { title: 'Termin', body };
    }
  });
}

/* ---------- Ansicht: Pläne ---------- */
function planDraft() {
  if (!UI.planDraft) {
    const p = latestPlan();
    const days = Array(7).fill('');
    if (p) for (const s of p.slots) if (tplById(s.templateId)) days[s.weekday] = s.templateId;
    const t = todayISO();
    UI.planDraft = { days, from: p && p.validFrom > t ? p.validFrom : t, dirty: false };
  }
  return UI.planDraft;
}
function viewPlaene() {
  const d = planDraft();
  const p = latestPlan();
  let html = `<h2 class="sec">Wochenplan</h2><div class="list">`;
  for (let i = 0; i < 7; i++) {
    html += `<div class="wp-row"><div>${WD_LONG[i]}</div><select data-ch="wpDay" data-i="${i}">
      <option value="">Ruhetag</option>${S.templates.map(t => `<option value="${t.id}" ${d.days[i] === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></div>`;
  }
  html += `</div><div class="card"><label class="field"><span>Gültig ab</span><input type="date" data-ch="wpFrom" value="${d.from}"></label>
    <button class="btn primary block" data-act="savePlan" ${d.dirty ? '' : 'disabled'}>Wochenplan speichern</button>
    <p class="small muted" style="margin:10px 0 0">${p ? `Aktueller Plan gilt seit ${fmtLong(p.validFrom)}. ` : ''}Termine vor dem Gültig-ab-Datum bleiben unverändert. Einzeln verschobene Termine von Tagen, die es im neuen Plan nicht mehr gibt, werden zurückgesetzt.</p></div>`;
  html += `<h2 class="sec">Vorlagen</h2><div class="list">`;
  for (const t of S.templates) {
    const sets = t.items.reduce((n, it) => n + it.sets, 0);
    html += `<button class="row" data-act="editTpl" data-id="${t.id}"><span class="dot" style="background:${t.color}"></span>
      <span class="grow"><div class="t">${esc(t.name)}</div><div class="s">${exCount(t.items.length)} · ${sets} Sätze</div></span><span class="chev">›</span></button>`;
  }
  html += `</div><button class="btn block" data-act="newTpl">+ Neue Vorlage</button>`;
  return { title: 'Pläne', html };
}

function openTplEditor(id) {
  openSheet({
    full: true,
    ctx: { id },
    render({ id }) {
      const t = tplById(id);
      if (!t) return { title: '', body: '<div class="empty">Vorlage gelöscht</div>' };
      let body = `<label class="field"><span>Name</span><input data-in="tplName" value="${esc(t.name)}" maxlength="40"></label>
        <label class="field"><span>Farbe</span></label><div class="colors" style="margin:-6px 0 14px">${COLORS.map(c => `<button class="${c === t.color ? 'on' : ''}" style="background:${c}" data-act="tplColor" data-c="${c}" aria-label="Farbe"></button>`).join('')}</div>
        <h2 class="sec">Übungen</h2>`;
      if (!t.items.length) body += `<div class="card empty">Noch keine Übungen. Füge Übungen aus dem Katalog hinzu.</div>`;
      else {
        body += '<div class="list">';
        t.items.forEach((it, i) => {
          const ex = exById(it.exerciseId) || { name: 'Unbekannte Übung', muscle: '', equipment: '' };
          body += `<div class="ti-item" data-ti="${it.id}">
            <div class="ti-head"><div class="grow"><div class="t">${i + 1}. ${esc(ex.name)}</div><div class="small muted">${esc(ex.muscle)} · ${esc(ex.equipment)}</div></div>
              <button class="icon-btn" data-act="tiMove" data-d="-1" aria-label="Nach oben" ${i === 0 ? 'disabled style="opacity:.3"' : ''}>↑</button>
              <button class="icon-btn" data-act="tiMove" data-d="1" aria-label="Nach unten" ${i === t.items.length - 1 ? 'disabled style="opacity:.3"' : ''}>↓</button>
              <button class="icon-btn red" data-act="tiDel" aria-label="Entfernen">✕</button></div>
            <div class="ti-ctrl"><span class="lab">Sätze</span>
              <span><span class="stepper"><button data-act="tiSets" data-d="-1">−</button><span class="v">${it.sets}</span><button data-act="tiSets" data-d="1">+</button></span></span>
              <span class="lab">Wdh-Bereich</span>
              <span class="range-in"><input inputmode="numeric" data-in="tiMin" data-ch="tiRange" value="${it.repMin}" aria-label="Minimum"><span>–</span><input inputmode="numeric" data-in="tiMax" data-ch="tiRange" value="${it.repMax}" aria-label="Maximum"></span></div></div>`;
        });
        body += '</div>';
      }
      body += `<button class="btn primary block" data-act="tplAdd">+ Übungen hinzufügen</button>
        <button class="btn danger block" style="margin-top:24px" data-act="tplDelete">Vorlage löschen</button>`;
      return { title: t.name || 'Vorlage', left: '<button class="tb-btn" data-act="closeSheet">Fertig</button>', body };
    }
  });
}

/* ---------- Übungsauswahl (Picker) ---------- */
function pickListHtml() {
  const list = filterExercises(UI.pick);
  if (!list.length) return '<div class="empty">Keine Übung gefunden</div>';
  return `<div class="count">${list.length} Übungen</div><div class="list">` + list.map(e => {
    const on = UI.pick.sel.includes(e.id);
    return `<button class="row" data-act="pickToggle" data-id="${e.id}"><span class="check${on ? ' on' : ''}">${on ? CHECK_SVG : ''}</span>
      <span class="grow"><div class="t">${esc(e.name)}</div><div class="s">${esc(e.muscle)} · ${esc(e.equipment)}</div></span></button>`;
  }).join('') + '</div>';
}
function pickBtnLabel() { const n = UI.pick.sel.length; return n ? `${n} Übung${n > 1 ? 'en' : ''} hinzufügen` : 'Übungen auswählen'; }
function openPicker(title, onDone) {
  UI.pick = { sel: [], q: '', muscle: '', equip: '' };
  openSheet({
    full: true,
    onDone,
    render() {
      return {
        title,
        left: '<button class="tb-btn" data-act="closeSheet">Abbrechen</button>',
        right: '<button class="tb-btn" data-act="newEx">Neu</button>',
        body: `<input class="search" type="search" placeholder="Übung suchen" data-in="pickQ" value="${esc(UI.pick.q)}">
          <div class="filters">${muscleSelect('pickM', UI.pick.muscle)}${equipSelect('pickE', UI.pick.equip)}</div>
          <div id="pickList">${pickListHtml()}</div>`,
        foot: `<button class="btn primary block" data-act="pickDone" id="pickBtn" ${UI.pick.sel.length ? '' : 'disabled'}>${pickBtnLabel()}</button>`
      };
    }
  });
}
function refreshPick() {
  const l = $('#pickList');
  if (l) l.innerHTML = pickListHtml();
  const b = $('#pickBtn');
  if (b) { b.textContent = pickBtnLabel(); b.disabled = !UI.pick.sel.length; }
}

/* ---------- Ansicht: Übungen ---------- */
function exListHtml() {
  const list = filterExercises(UI.ex);
  if (!list.length) return '<div class="empty">Keine Übung gefunden</div>';
  return `<div class="count">${list.length} Übungen</div><div class="list">` + list.map(e =>
    `<button class="row" data-act="editEx" data-id="${e.id}"><span class="grow"><div class="t">${esc(e.name)}</div>
      <div class="s">${esc(e.muscle)} · ${esc(e.equipment)}${e.custom ? ' · eigene' : ''}${e.weights && e.weights.length ? ' · eigene Gewichte' : ''}</div></span><span class="chev">›</span></button>`
  ).join('') + '</div>';
}
function viewUebungen() {
  const html = `<input class="search" type="search" placeholder="Übung suchen" data-in="exQ" value="${esc(UI.ex.q)}">
    <div class="filters">${muscleSelect('exM', UI.ex.muscle)}${equipSelect('exE', UI.ex.equip)}</div>
    <div id="exList">${exListHtml()}</div>`;
  return { title: 'Übungen', right: '<button class="tb-btn" data-act="newEx">+ Neu</button>', html };
}
function openExEditor(id, onCreated) {
  const ex = id ? exById(id) : null;
  const draft = ex
    ? { name: ex.name, muscle: ex.muscle, equipment: ex.equipment, weightsText: (ex.weights || []).map(inNum).join('; ') }
    : { name: '', muscle: UI.ex.muscle || MUSCLES[0], equipment: UI.ex.equip || EQUIPMENT[0], weightsText: '' };
  openSheet({
    ctx: { id, draft, onCreated },
    render({ id, draft }) {
      const hist = id ? exerciseHistory(id) : [];
      const body = `<label class="field"><span>Name</span><input data-in="exdName" value="${esc(draft.name)}" maxlength="60" placeholder="z. B. Kabel-Seitheben einarmig"></label>
        <label class="field"><span>Muskelgruppe</span><select data-ch="exdMuscle">${MUSCLES.map(m => `<option ${m === draft.muscle ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select></label>
        <label class="field"><span>Ausrüstung</span><select data-ch="exdEquip">${EQUIPMENT.map(m => `<option ${m === draft.equipment ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select></label>
        <label class="field"><span>Eigene Gewichtsstufen (optional)</span>
          <textarea data-in="exdWeights" rows="3" placeholder="Leer lassen = Standard für ${esc(draft.equipment)}: ${esc(weightSummary(S.equipmentWeights[draft.equipment]))}">${esc(draft.weightsText)}</textarea></label>
        <p class="small muted" style="margin-top:-6px">Für Geräte, die von deinem Standard abweichen. Werte mit Semikolon oder Leerzeichen trennen, z. B. 5; 10; 12,5; 15</p>
        <div class="stack"><button class="btn primary block" data-act="exdSave">Speichern</button>
        ${hist.length ? `<button class="btn block" data-act="showProgress" data-id="${id}">Verlauf ansehen (${hist.length} Einheiten)</button>` : ''}
        ${id ? `<button class="btn danger block" data-act="exdHide">Übung ausblenden</button>` : ''}</div>`;
      return { title: id ? 'Übung bearbeiten' : 'Neue Übung', body };
    }
  });
}

/* ---------- Ansicht: Fortschritt ---------- */
function viewFortschritt() {
  const t = todayISO();
  const fin = S.sessions.filter(s => s.finishedAt);
  const ws = weekStart(t);
  const ms = t.slice(0, 8) + '01';
  let html = `<div class="stats">
    <div class="stat"><div class="v">${fin.filter(s => s.date >= ws && s.date <= t).length}</div><div class="l">diese Woche</div></div>
    <div class="stat"><div class="v">${fin.filter(s => s.date >= ms && s.date <= t).length}</div><div class="l">diesen Monat</div></div>
    <div class="stat"><div class="v">${fin.length}</div><div class="l">gesamt</div></div></div>`;
  const recent = [...fin].sort((a, b) => (b.date + b.finishedAt).localeCompare(a.date + a.finishedAt)).slice(0, 5);
  if (recent.length) {
    html += `<h2 class="sec">Letzte Trainings</h2><div class="list">${recent.map(s => `<button class="row" data-act="openSession" data-id="${s.id}">
      <span class="dot" style="background:${s.color}"></span><span class="grow"><div class="t">${esc(s.name)}</div><div class="s">${fmtDay(s.date)} · ${doneSets(s)} Sätze</div></span><span class="chev">›</span></button>`).join('')}</div>`;
  }
  html += `<h2 class="sec">Übungen</h2><input class="search" type="search" placeholder="Übung suchen" data-in="progQ" value="${esc(UI.prog.q)}"><div id="progList">${progListHtml()}</div>`;
  return { title: 'Fortschritt', html };
}
function progListHtml() {
  const ids = new Set();
  for (const s of S.sessions) if (s.finishedAt) for (const it of s.items) if (it.sets.some(x => x.done)) ids.add(it.exerciseId);
  const words = norm(UI.prog.q).split(/\s+/).filter(Boolean);
  const rows = [];
  for (const id of ids) {
    const ex = exById(id);
    const name = ex ? ex.name : 'Unbekannte Übung';
    if (!words.every(w => norm(name).includes(w))) continue;
    const h = exerciseHistory(id);
    if (!h.length) continue;
    const last = h[h.length - 1], prev = h[h.length - 2];
    let trend = '';
    if (prev) {
      const d = Math.round((last.e1rm - prev.e1rm) * 10) / 10;
      trend = d > 0 ? `<span class="trend-up small">+${fmtNum(d)}</span>` : d < 0 ? `<span class="trend-down small">${fmtNum(d)}</span>` : '<span class="muted small">±0</span>';
    }
    rows.push({ last: last.date, html: `<button class="row" data-act="showProgress" data-id="${id}"><span class="grow"><div class="t">${esc(name)}</div>
      <div class="s">${fmtShort(last.date)} · Top ${fmtNum(last.top.weight)} kg × ${last.top.reps} · ${h.length} Einheiten</div></span>${trend}<span class="chev">›</span></button>` });
  }
  if (!rows.length) return `<div class="card empty">${ids.size ? 'Keine Treffer' : 'Sobald du ein Training abschließt, siehst du hier deinen Verlauf pro Übung.'}</div>`;
  rows.sort((a, b) => b.last.localeCompare(a.last));
  return `<div class="list">${rows.map(r => r.html).join('')}</div><p class="small muted">Trend = Veränderung des geschätzten 1RM zur vorherigen Einheit.</p>`;
}
function openProgress(exId) {
  openSheet({
    full: true,
    ctx: { exId },
    render({ exId }) {
      const ex = exById(exId);
      const h = exerciseHistory(exId);
      if (!h.length) return { title: ex ? ex.name : '', body: '<div class="empty">Noch keine abgeschlossenen Sätze.</div>' };
      const bestW = h.reduce((b, x) => (x.top.weight || 0) > (b.top.weight || 0) ? x : b, h[0]);
      const best1 = h.reduce((b, x) => x.e1rm > b.e1rm ? x : b, h[0]);
      let body = `<div class="seg" style="margin-bottom:12px">${Object.entries(METRICS).map(([k, m]) => `<button class="${UI.metric === k ? 'on' : ''}" data-act="metric" data-m="${k}">${m.label}</button>`).join('')}</div>
        <div class="card">${chartSvg(h, UI.metric)}</div>
        <div class="stats" style="grid-template-columns:1fr 1fr">
          <div class="stat"><div class="v">${fmtNum(bestW.top.weight)}<span class="small muted"> kg</span></div><div class="l">Bestes Gewicht (${bestW.top.reps} Wdh, ${fmtShort(bestW.date)})</div></div>
          <div class="stat"><div class="v">${fmtNum(Math.round(best1.e1rm * 10) / 10)}<span class="small muted"> kg</span></div><div class="l">Bestes e1RM (${fmtShort(best1.date)})</div></div></div>
        <p class="small muted">e1RM = geschätztes Maximalgewicht für eine Wiederholung, berechnet aus Gewicht, Wiederholungen und RIR.</p>
        <h2 class="sec">Verlauf</h2><div class="list">`;
      for (const x of [...h].reverse()) {
        body += `<button class="row" data-act="openSession" data-id="${x.sessionId}"><span class="grow"><div class="t small">${fmtDay(x.date)}</div>
          <div class="hist-sets">${x.sets.map(s => `<span>${fmtNum(s.weight)} × ${s.reps}${s.rir != null ? ` <span class="muted">@${s.rir}</span>` : ''}</span>`).join('')}</div></span><span class="chev">›</span></button>`;
      }
      body += '</div>';
      return { title: ex ? ex.name : 'Verlauf', body };
    }
  });
}

/* ---------- Ansicht: Mehr ---------- */
function viewMehr() {
  const hidden = S.exercises.filter(e => e.hidden).length;
  let html = `<h2 class="sec">Gewichte in deinem Gym</h2><div class="list">${EQUIPMENT.map(eq => `<button class="row" data-act="editWeights" data-eq="${esc(eq)}">
    <span class="grow"><div class="t">${esc(eq)}</div><div class="s">${esc(weightSummary(S.equipmentWeights[eq]))}</div></span><span class="chev">›</span></button>`).join('')}</div>
    <p class="small muted" style="margin:0 4px">Vorschläge werden immer auf ein Gewicht gerundet, das es bei dir gibt. Abweichende Geräte stellst du direkt bei der Übung ein.</p>`;
  html += `<h2 class="sec">Progression</h2><div class="card"><label class="field"><span>Vorschlagslogik</span><select data-ch="strategy">${Object.entries(Progression.STRATEGIES).map(([k, s]) => `<option value="${k}" ${S.settings.strategy === k ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select></label>
    <p class="small muted" style="margin:0">${esc((Progression.STRATEGIES[S.settings.strategy] || Progression.STRATEGIES.same).description)}</p></div>`;
  html += `<h2 class="sec">Datensicherung</h2><div class="card"><div class="stack">
    <button class="btn primary block" data-act="exportData">Backup exportieren</button>
    <label class="btn block">Backup importieren<input type="file" accept="application/json,.json" data-ch="importFile" hidden></label></div>
    <p class="small muted" style="margin:10px 0 0">Deine Daten liegen nur auf diesem iPhone. ${S.lastExport ? `Letztes Backup: ${fmtShort(S.lastExport.slice(0, 10))}.` : 'Noch kein Backup erstellt.'} Speichere das Backup z. B. in iCloud Drive.</p></div>`;
  html += `<h2 class="sec">Speicher</h2><div class="card"><div class="small">${UI.persisted === true ? 'Dauerhafter Speicher ist aktiv.' : UI.persisted === false ? 'Der Browser hat dauerhaften Speicher noch nicht bestätigt. Installiert als App auf dem Home-Bildschirm ist das Risiko eines Datenverlusts gering, ein regelmäßiges Backup ist trotzdem sinnvoll.' : 'Status wird geprüft …'}</div>
    ${UI.persisted === true ? '' : '<button class="btn sm" style="margin-top:10px" data-act="persist">Dauerhaften Speicher anfordern</button>'}</div>`;
  if (hidden) html += `<h2 class="sec">Übungen</h2><button class="btn block" data-act="unhideAll">${hidden} ausgeblendete Übung${hidden > 1 ? 'en' : ''} wiederherstellen</button>`;
  html += `<h2 class="sec">App</h2><div class="card small"><b>Trainingslog ${VERSION}</b><br>
    <span class="muted">Installation: In Safari auf Teilen tippen, dann „Zum Home-Bildschirm“. Danach startet die App im Vollbild und funktioniert offline.</span></div>
    <button class="btn danger block" data-act="resetAll" style="margin-top:20px">Alle Daten löschen</button>`;
  return { title: 'Mehr', html };
}
function openWeightsEditor(eq) {
  const draft = { text: S.equipmentWeights[eq].map(inNum).join('; '), from: '', to: '', step: '' };
  openSheet({
    ctx: { eq, draft },
    render({ eq, draft }) {
      const body = `<p class="small muted" style="margin-top:0">Alle Gewichte, die es für ${esc(eq)} in deinem Gym gibt (in kg${eq === 'Körpergewicht' ? ', als Zusatzgewicht' : ''}${eq === 'Band' ? ', als Bandstufe' : ''}).</p>
        <label class="field"><span>Gewichtsstufen</span><textarea data-in="wText" rows="5">${esc(draft.text)}</textarea></label>
        <div class="card"><div class="small" style="font-weight:600;margin-bottom:8px">Bereich erzeugen</div>
          <div class="filters" style="grid-template-columns:1fr 1fr 1fr">
            <input inputmode="decimal" placeholder="von" data-in="wFrom" value="${esc(draft.from)}">
            <input inputmode="decimal" placeholder="bis" data-in="wTo" value="${esc(draft.to)}">
            <input inputmode="decimal" placeholder="Schritt" data-in="wStep" value="${esc(draft.step)}"></div>
          <button class="btn sm block" data-act="wGenerate">Erzeugen und ersetzen</button></div>
        <div class="stack"><button class="btn primary block" data-act="wSave">Speichern</button>
        <button class="btn block" data-act="wDefault">Auf Standard zurücksetzen</button></div>`;
      return { title: eq, body };
    }
  });
}

/* ---------- Ansicht: Training ---------- */
function setRowHtml(it, set, i, ex) {
  const cls = `set-grid set-row${set.done ? ' done' : ''}${set.sugg && !set.done ? ' sugg' : ''}`;
  return `<div class="${cls}" data-item="${it.id}" data-i="${i}">
    <div class="set-no">${i + 1}</div>
    <div class="wbox"><button data-act="wStepSet" data-d="-1" aria-label="Weniger">−</button>
      <input inputmode="decimal" data-in="setW" value="${inNum(set.weight)}" placeholder="kg" aria-label="Gewicht">
      <button data-act="wStepSet" data-d="1" aria-label="Mehr">+</button></div>
    <input class="num" inputmode="numeric" data-in="setR" value="${set.reps ?? ''}" placeholder="–" aria-label="Wiederholungen">
    <input class="num" inputmode="numeric" data-in="setRir" value="${set.rir ?? ''}" placeholder="–" aria-label="RIR">
    <button class="done-btn" data-act="toggleSet" aria-label="Satz erledigt">${CHECK_SVG}</button></div>`;
}
function exCardHtml(s, it) {
  const ex = exById(it.exerciseId);
  const last = Progression.lastPerformance(S, it.exerciseId, s.id, s.date);
  const lastTxt = last
    ? `Letztes Mal (${fmtShort(last.date)}): ` + last.sets.map(x => `<b>${fmtNum(x.weight)}</b>×${x.reps}${x.rir != null ? ` @${x.rir}` : ''}`).join(' · ')
    : 'Noch keine Historie. Trage dein Startgewicht ein.';
  const first = it.sets.find(x => x.sw != null);
  const sugg = first ? `Vorschlag: ${fmtNum(first.sw)} kg × ${first.sr} Wdh` : `Ziel: ${it.repMin}–${it.repMax} Wdh`;
  return `<div class="ex-card" data-card="${it.id}">
    <div class="ex-top"><div class="grow"><div class="name">${esc(ex ? ex.name : it.name)}</div>
      <div class="meta">${it.sets.length} × ${it.repMin}–${it.repMax} Wdh${ex ? ' · ' + esc(ex.equipment) : ''}</div></div>
      <button class="icon-btn" data-act="itemMenu" data-item="${it.id}" aria-label="Optionen">⋯</button></div>
    <div class="ex-sugg">${sugg}</div>
    <div class="ex-last">${lastTxt}</div>
    <div class="set-grid head"><div>#</div><div>kg</div><div>Wdh</div><div>RIR</div><div></div></div>
    ${it.sets.map((set, i) => setRowHtml(it, set, i, ex)).join('')}
    <div class="ex-actions"><button class="btn sm" data-act="addSet" data-item="${it.id}">+ Satz</button>
      <button class="btn sm" data-act="removeSet" data-item="${it.id}" ${it.sets.length ? '' : 'disabled'}>− Satz</button></div></div>`;
}
function viewSession() {
  const s = getSession(UI.sessionId);
  const total = s.items.reduce((n, it) => n + it.sets.length, 0);
  let html = `<div class="sess-head"><div><input type="date" data-ch="sessDate" value="${s.date}" style="width:auto;padding:6px 10px"></div>
    <div><span class="pill ${s.finishedAt ? 'ok' : 'run'}">${s.finishedAt ? 'Abgeschlossen' : 'Läuft'}</span> <span class="small muted">${doneSets(s)}/${total} Sätze</span></div></div>`;
  if (!s.items.length) html += '<div class="card empty">Noch keine Übungen in diesem Training.</div>';
  html += s.items.map(it => exCardHtml(s, it)).join('');
  html += `<div class="stack"><button class="btn block" data-act="sessAddEx">+ Übung hinzufügen</button>
    ${s.finishedAt ? '<button class="btn block" data-act="reopenSession">Training wieder öffnen</button>' : '<button class="btn primary block" data-act="finishSession">Training abschließen</button>'}
    <button class="btn danger block" data-act="deleteSession">Training löschen</button></div>`;
  return {
    title: s.name,
    left: '<button class="tb-btn" data-act="closeSession">‹ Zurück</button>',
    right: s.finishedAt ? '' : '<button class="tb-btn" data-act="finishSession">Fertig</button>',
    html
  };
}
function rowCtx(el) {
  const row = el.closest('[data-item][data-i]');
  if (!row) return null;
  const s = getSession(UI.sessionId);
  const it = s && s.items.find(x => x.id === row.dataset.item);
  if (!it) return null;
  return { s, it, row, i: Number(row.dataset.i), set: it.sets[Number(row.dataset.i)] };
}
function itemCtx(el) {
  const s = getSession(UI.sessionId);
  const id = el.dataset.item || (el.closest('[data-item]') || {}).dataset?.item;
  const it = s && s.items.find(x => x.id === id);
  return it ? { s, it } : null;
}
function openItemMenu(itemId) {
  openSheet({
    ctx: { itemId },
    render({ itemId }) {
      const s = getSession(UI.sessionId);
      const idx = s.items.findIndex(x => x.id === itemId);
      const it = s.items[idx];
      if (!it) return { title: '', body: '' };
      const body = `<label class="field"><span>Wiederholungsbereich für dieses Training</span>
        <span class="range-in"><input inputmode="numeric" data-in="imMin" value="${it.repMin}"><span>–</span><input inputmode="numeric" data-in="imMax" value="${it.repMax}"></span></label>
        <div class="stack">
        <button class="btn block" data-act="imMove" data-d="-1" ${idx === 0 ? 'disabled' : ''}>Nach oben</button>
        <button class="btn block" data-act="imMove" data-d="1" ${idx === s.items.length - 1 ? 'disabled' : ''}>Nach unten</button>
        ${exerciseHistory(it.exerciseId).length ? `<button class="btn block" data-act="showProgress" data-id="${it.exerciseId}">Verlauf ansehen</button>` : ''}
        <button class="btn danger block" data-act="imRemove">Übung aus Training entfernen</button></div>`;
      return { title: it.name, body };
    }
  });
}

const VIEWS = { kalender: viewKalender, plaene: viewPlaene, fortschritt: viewFortschritt, uebungen: viewUebungen, mehr: viewMehr };

/* ---------- Aktionen (Klicks) ---------- */
const A = {
  tab(el) {
    while (sheetStack.length) sheetStack.pop();
    renderSheets();
    UI.sessionId = null;
    UI.tab = el.dataset.tab;
    if (UI.tab === 'plaene') UI.planDraft = null;
    render({ top: true });
    window.scrollTo(0, 0);
  },
  closeSheet() { closeSheet(); },

  // Kalender
  calMode() { UI.calMode = UI.calMode === 'week' ? 'month' : 'week'; render(); },
  calToday() { UI.anchor = todayISO(); UI.selDay = UI.anchor; render(); },
  calShift(el) {
    const d = Number(el.dataset.d);
    if (UI.calMode === 'week') UI.anchor = addDays(UI.anchor, d * 7);
    else { const a = parse(UI.anchor); UI.anchor = iso(new Date(a.getFullYear(), a.getMonth() + d, 1)); }
    render();
  },
  selDay(el) { UI.selDay = el.dataset.date; render(); },
  occ(el) { openOccSheet(el.dataset.key, el.dataset.date); },
  startOcc() {
    const o = topSheet().ctx.o;
    const run = runningSession();
    if (run && !confirm(`Es läuft bereits ein Training (${run.name}). Trotzdem ein neues starten?`)) return;
    while (sheetStack.length) sheetStack.pop();
    renderSheets();
    startFromOcc(o);
  },
  moveTo(el) {
    const o = topSheet().ctx.o;
    moveOcc(o, el.dataset.date);
    save();
    closeSheet();
    toast(`Verschoben auf ${fmtDay(el.dataset.date)}`);
  },
  skipOcc(el) {
    const o = topSheet().ctx.o;
    setSkipped(o, el.dataset.v === '1');
    save();
    closeSheet();
    toast(el.dataset.v === '1' ? 'Termin ausgelassen' : 'Termin wiederhergestellt');
  },
  removeExtra() {
    const o = topSheet().ctx.o;
    S.extras = S.extras.filter(x => x.id !== o.extraId);
    save();
    closeSheet();
  },
  addExtra(el) {
    const date = el.dataset.date;
    openSheet({
      ctx: { date },
      render({ date }) {
        return {
          title: fmtDay(date),
          body: `<p class="small muted" style="margin-top:0">Welches Training möchtest du an diesem Tag hinzufügen?</p><div class="list">${S.templates.map(t => `<button class="row" data-act="addExtraTpl" data-id="${t.id}">
            <span class="dot" style="background:${t.color}"></span><span class="grow"><div class="t">${esc(t.name)}</div><div class="s">${exCount(t.items.length)}</div></span></button>`).join('')}</div>`
        };
      }
    });
  },
  addExtraTpl(el) {
    const date = topSheet().ctx.date;
    S.extras.push({ id: uid(), date, templateId: el.dataset.id });
    save();
    closeSheet();
    toast('Training hinzugefügt');
  },

  // Pläne
  savePlan() {
    const d = planDraft();
    const from = d.from || todayISO();
    const slots = d.days.map((tid, i) => tid ? { id: `${i}-${tid}`, weekday: i, templateId: tid } : null).filter(Boolean);
    S.plans = S.plans.filter(p => p.validFrom < from);
    S.plans.push({ id: uid(), validFrom: from, slots });
    const slotIds = new Set(slots.map(s => s.id));
    for (const key of Object.keys(S.overrides)) {
      if (key.slice(0, 10) >= from && !slotIds.has(key.slice(11)) && !S.sessions.some(s => s.plannedKey === key)) delete S.overrides[key];
    }
    save();
    UI.planDraft = null;
    render();
    toast('Wochenplan gespeichert');
  },
  editTpl(el) { openTplEditor(el.dataset.id); },
  newTpl() {
    const t = { id: uid(), name: 'Neue Vorlage', color: COLORS[S.templates.length % COLORS.length], items: [] };
    S.templates.push(t);
    save();
    UI.planDraft = null;
    render();
    openTplEditor(t.id);
  },
  tplColor(el) { const t = tplById(topSheet().ctx.id); t.color = el.dataset.c; save(); renderSheets(); },
  tiMove(el) {
    const t = tplById(topSheet().ctx.id);
    const id = el.closest('[data-ti]').dataset.ti;
    const i = t.items.findIndex(x => x.id === id), j = i + Number(el.dataset.d);
    if (j < 0 || j >= t.items.length) return;
    [t.items[i], t.items[j]] = [t.items[j], t.items[i]];
    save(); renderSheets();
  },
  tiDel(el) {
    const t = tplById(topSheet().ctx.id);
    const id = el.closest('[data-ti]').dataset.ti;
    t.items = t.items.filter(x => x.id !== id);
    save(); renderSheets();
  },
  tiSets(el) {
    const t = tplById(topSheet().ctx.id);
    const it = t.items.find(x => x.id === el.closest('[data-ti]').dataset.ti);
    it.sets = Math.min(10, Math.max(1, it.sets + Number(el.dataset.d)));
    save(); renderSheets();
  },
  tplAdd() {
    const tid = topSheet().ctx.id;
    openPicker('Übungen hinzufügen', ids => {
      const t = tplById(tid);
      for (const id of ids) t.items.push({ id: uid(), exerciseId: id, sets: 3, repMin: 8, repMax: 12 });
      toast(`${ids.length} Übung${ids.length > 1 ? 'en' : ''} hinzugefügt`);
    });
  },
  tplDelete() {
    const id = topSheet().ctx.id;
    const t = tplById(id);
    if (!confirm(`Vorlage „${t.name}“ wirklich löschen? Bereits absolvierte Trainings bleiben erhalten.`)) return;
    S.templates = S.templates.filter(x => x.id !== id);
    for (const p of S.plans) p.slots = p.slots.filter(s => s.templateId !== id);
    S.extras = S.extras.filter(x => x.templateId !== id || S.sessions.some(s => s.plannedKey === 'x|' + x.id));
    UI.planDraft = null;
    save();
    closeSheet();
  },

  // Picker
  pickToggle(el) {
    const id = el.dataset.id, sel = UI.pick.sel;
    const i = sel.indexOf(id);
    if (i >= 0) sel.splice(i, 1); else sel.push(id);
    const on = sel.includes(id);
    const c = $('.check', el);
    c.classList.toggle('on', on);
    c.innerHTML = on ? CHECK_SVG : '';
    const b = $('#pickBtn');
    if (b) { b.textContent = pickBtnLabel(); b.disabled = !sel.length; }
  },
  pickDone() {
    const d = topSheet();
    const ids = [...UI.pick.sel];
    sheetStack.pop();
    if (ids.length) d.onDone(ids);
    save();
    renderSheets();
    render();
  },

  // Übungen
  newEx() {
    const fromPicker = topSheet() && topSheet().onDone;
    openExEditor(null, fromPicker ? id => { UI.pick.sel.push(id); } : null);
  },
  editEx(el) { openExEditor(el.dataset.id); },
  exdSave() {
    const { id, draft, onCreated } = topSheet().ctx;
    const name = draft.name.trim();
    if (!name) { toast('Bitte einen Namen eingeben'); return; }
    const weights = parseWeightList(draft.weightsText);
    if (id) {
      const ex = exById(id);
      Object.assign(ex, { name, muscle: draft.muscle, equipment: draft.equipment, weights: weights.length ? weights : undefined });
    } else {
      const ex = { id: 'u-' + uid(), name, muscle: draft.muscle, equipment: draft.equipment, custom: true };
      if (weights.length) ex.weights = weights;
      S.exercises.push(ex);
      if (onCreated) onCreated(ex.id);
    }
    save();
    sheetStack.pop();
    renderSheets();
    if (UI.pick && $('#pickList')) refreshPick();
    render();
    toast('Übung gespeichert');
  },
  exdHide() {
    const ex = exById(topSheet().ctx.id);
    ex.hidden = true;
    save();
    closeSheet();
    toast('Übung ausgeblendet');
  },
  unhideAll() { S.exercises.forEach(e => delete e.hidden); save(); render(); toast('Alle Übungen wieder sichtbar'); },

  // Fortschritt
  showProgress(el) { openProgress(el.dataset.id); },
  metric(el) { UI.metric = el.dataset.m; renderSheets(); },

  // Mehr
  editWeights(el) { openWeightsEditor(el.dataset.eq); },
  wGenerate() {
    const { draft } = topSheet().ctx;
    const f = parseNum(draft.from), t = parseNum(draft.to), st = parseNum(draft.step);
    if (f == null || t == null || !st || st <= 0 || t < f || (t - f) / st > 400) { toast('Bitte gültige Werte für von, bis und Schritt eingeben'); return; }
    draft.text = rangeList(f, t, st).map(inNum).join('; ');
    renderSheets();
  },
  wSave() {
    const { eq, draft } = topSheet().ctx;
    const list = parseWeightList(draft.text);
    if (!list.length) { toast('Mindestens ein Gewicht eingeben'); return; }
    S.equipmentWeights[eq] = list;
    save();
    closeSheet();
    toast('Gewichte gespeichert');
  },
  wDefault() {
    const { eq, draft } = topSheet().ctx;
    draft.text = DEFAULT_WEIGHTS[eq].map(inNum).join('; ');
    renderSheets();
  },
  exportData() { exportData(); },
  async persist() {
    UI.persisted = await DB.requestPersist();
    render();
    if (!UI.persisted) toast('Der Browser hat die Anfrage nicht bestätigt');
  },
  async resetAll() {
    if (!confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden.')) return;
    if (!confirm('Letzte Rückfrage: Hast du ein Backup? Alle Trainings werden gelöscht.')) return;
    await DB.clear();
    S = defaultState();
    await saveNow();
    UI.sessionId = null; UI.planDraft = null;
    render();
    toast('Alle Daten gelöscht');
  },

  // Training
  openSession(el) { openSession(el.dataset.id); },
  closeSession() { saveNow(); UI.sessionId = null; render(); },
  wStepSet(el) {
    const c = rowCtx(el);
    if (!c) return;
    const ex = exById(c.it.exerciseId);
    c.set.weight = Progression.nextWeight(c.set.weight, weightsFor(ex), Number(el.dataset.d));
    c.set.sugg = false;
    $('[data-in="setW"]', c.row).value = inNum(c.set.weight);
    c.row.classList.remove('sugg');
    save();
  },
  toggleSet(el) {
    const c = rowCtx(el);
    if (!c) return;
    const ex = exById(c.it.exerciseId);
    if (!c.set.done) {
      if (c.set.weight == null) {
        if (ex && (ex.equipment === 'Körpergewicht')) c.set.weight = 0;
        else { toast('Bitte Gewicht eintragen'); return; }
      }
      if (c.set.reps == null) { toast('Bitte Wiederholungen eintragen'); return; }
      c.set.done = true;
      c.set.sugg = false;
      // nächsten offenen Satz mit dem gleichen Gewicht vorbelegen, falls er noch ein reiner Vorschlag ohne Gewicht ist
      const next = c.it.sets[c.i + 1];
      if (next && !next.done && next.weight == null) { next.weight = c.set.weight; }
    } else {
      c.set.done = false;
    }
    save();
    render();
  },
  addSet(el) {
    const c = itemCtx(el);
    if (!c) return;
    const prev = c.it.sets[c.it.sets.length - 1];
    c.it.sets.push(prev
      ? { weight: prev.weight, reps: prev.reps, rir: null, done: false, sugg: true, sw: prev.sw, sr: prev.sr }
      : { weight: null, reps: c.it.repMin, rir: null, done: false, sugg: true, sw: null, sr: c.it.repMin });
    save(); render();
  },
  removeSet(el) {
    const c = itemCtx(el);
    if (!c || !c.it.sets.length) return;
    const last = c.it.sets[c.it.sets.length - 1];
    if (last.done && !confirm('Der letzte Satz ist bereits erledigt. Trotzdem entfernen?')) return;
    c.it.sets.pop();
    save(); render();
  },
  itemMenu(el) { openItemMenu(el.dataset.item); },
  imMove(el) {
    const s = getSession(UI.sessionId);
    const i = s.items.findIndex(x => x.id === topSheet().ctx.itemId), j = i + Number(el.dataset.d);
    if (j < 0 || j >= s.items.length) return;
    [s.items[i], s.items[j]] = [s.items[j], s.items[i]];
    save(); closeSheet();
  },
  imRemove() {
    const s = getSession(UI.sessionId);
    const id = topSheet().ctx.itemId;
    const it = s.items.find(x => x.id === id);
    if (it.sets.some(x => x.done) && !confirm('Diese Übung hat erledigte Sätze. Wirklich entfernen?')) return;
    s.items = s.items.filter(x => x.id !== id);
    save(); closeSheet();
  },
  sessAddEx() {
    const sid = UI.sessionId;
    openPicker('Übung hinzufügen', ids => {
      const s = getSession(sid);
      const tpl = tplById(s.templateId);
      for (const id of ids) {
        const ex = exById(id);
        const ti = tpl && tpl.items.find(x => x.exerciseId === id);
        s.items.push(makeItem(ex, ti ? ti.sets : 3, ti ? ti.repMin : 8, ti ? ti.repMax : 12, s));
      }
    });
  },
  finishSession() {
    const s = getSession(UI.sessionId);
    const open = s.items.reduce((n, it) => n + it.sets.filter(x => !x.done).length, 0);
    if (!doneSets(s)) { if (!confirm('Noch kein Satz abgehakt. Training trotzdem abschließen?')) return; }
    else if (open && !confirm(`${open} Satz/Sätze sind nicht abgehakt und zählen nicht in die Historie. Trotzdem abschließen?`)) return;
    s.finishedAt = Date.now();
    saveNow();
    UI.sessionId = null;
    render({ top: true });
    window.scrollTo(0, 0);
    toast(`Training gespeichert: ${doneSets(s)} Sätze`);
  },
  reopenSession() { const s = getSession(UI.sessionId); s.finishedAt = null; save(); render(); },
  deleteSession() {
    if (!confirm('Dieses Training inklusive aller Sätze löschen?')) return;
    S.sessions = S.sessions.filter(s => s.id !== UI.sessionId);
    UI.sessionId = null;
    saveNow();
    render();
    toast('Training gelöscht');
  }
};

/* ---------- Eingaben (input-Events, ohne Neu-Rendern) ---------- */
const I = {
  setW(el) { const c = rowCtx(el); if (!c) return; c.set.weight = parseNum(el.value); c.set.sugg = false; c.row.classList.remove('sugg'); save(); },
  setR(el) { const c = rowCtx(el); if (!c) return; c.set.reps = parseIntOrNull(el.value); c.set.sugg = false; c.row.classList.remove('sugg'); save(); },
  setRir(el) { const c = rowCtx(el); if (!c) return; c.set.rir = parseIntOrNull(el.value); save(); },
  tplName(el) { const t = tplById(topSheet().ctx.id); t.name = el.value; const h = $$('#sheets .sheet h3').pop(); if (h) h.textContent = el.value; UI.planDraft = null; save(); },
  tiMin(el) { const t = tplById(topSheet().ctx.id); const it = t.items.find(x => x.id === el.closest('[data-ti]').dataset.ti); const v = parseIntOrNull(el.value); if (v) { it.repMin = v; save(); } },
  tiMax(el) { const t = tplById(topSheet().ctx.id); const it = t.items.find(x => x.id === el.closest('[data-ti]').dataset.ti); const v = parseIntOrNull(el.value); if (v) { it.repMax = v; save(); } },
  imMin(el) { const s = getSession(UI.sessionId); const it = s.items.find(x => x.id === topSheet().ctx.itemId); const v = parseIntOrNull(el.value); if (v) { it.repMin = v; if (it.repMax < v) it.repMax = v; save(); } },
  imMax(el) { const s = getSession(UI.sessionId); const it = s.items.find(x => x.id === topSheet().ctx.itemId); const v = parseIntOrNull(el.value); if (v && v >= it.repMin) { it.repMax = v; save(); } },
  pickQ(el) { UI.pick.q = el.value; refreshPick(); },
  exQ(el) { UI.ex.q = el.value; $('#exList').innerHTML = exListHtml(); },
  progQ(el) { UI.prog.q = el.value; $('#progList').innerHTML = progListHtml(); },
  exdName(el) { topSheet().ctx.draft.name = el.value; },
  exdWeights(el) { topSheet().ctx.draft.weightsText = el.value; },
  wText(el) { topSheet().ctx.draft.text = el.value; },
  wFrom(el) { topSheet().ctx.draft.from = el.value; },
  wTo(el) { topSheet().ctx.draft.to = el.value; },
  wStep(el) { topSheet().ctx.draft.step = el.value; }
};

/* ---------- Änderungen (change-Events) ---------- */
const C = {
  wpDay(el) { const d = planDraft(); d.days[Number(el.dataset.i)] = el.value; d.dirty = true; render(); },
  wpFrom(el) { const d = planDraft(); d.from = el.value || todayISO(); d.dirty = true; render(); },
  moveDate(el) {
    if (!el.value) return;
    const o = topSheet().ctx.o;
    moveOcc(o, el.value);
    save();
    closeSheet();
    toast(`Verschoben auf ${fmtDay(el.value)}`);
  },
  tiRange(el) {
    const t = tplById(topSheet().ctx.id);
    const it = t.items.find(x => x.id === el.closest('[data-ti]').dataset.ti);
    if (!it.repMin || it.repMin < 1) it.repMin = 1;
    if (it.repMax < it.repMin) [it.repMin, it.repMax] = [it.repMax, it.repMin];
    save(); renderSheets();
  },
  pickM(el) { UI.pick.muscle = el.value; refreshPick(); },
  pickE(el) { UI.pick.equip = el.value; refreshPick(); },
  exM(el) { UI.ex.muscle = el.value; $('#exList').innerHTML = exListHtml(); },
  exE(el) { UI.ex.equip = el.value; $('#exList').innerHTML = exListHtml(); },
  exdMuscle(el) { topSheet().ctx.draft.muscle = el.value; },
  exdEquip(el) { topSheet().ctx.draft.equipment = el.value; renderSheets(); },
  strategy(el) { S.settings.strategy = el.value; save(); render(); },
  sessDate(el) {
    if (!el.value) return;
    const s = getSession(UI.sessionId);
    s.date = el.value;
    save();
    toast(`Datum geändert auf ${fmtDay(el.value)}`);
  },
  importFile(el) {
    const f = el.files && el.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const data = JSON.parse(r.result);
        if (!data || !Array.isArray(data.sessions) || !Array.isArray(data.exercises)) throw new Error('Format');
        if (!confirm(`Backup mit ${data.sessions.length} Trainings importieren? Die aktuellen Daten werden ersetzt.`)) return;
        S = migrate(data);
        await saveNow();
        UI.sessionId = null; UI.planDraft = null;
        render();
        toast('Backup importiert');
      } catch (e) {
        toast('Die Datei ist kein gültiges Trainingslog-Backup');
      }
      el.value = '';
    };
    r.readAsText(f);
  }
};

async function exportData() {
  const json = JSON.stringify(S, null, 1);
  const name = `trainingslog-backup-${todayISO()}.json`;
  const file = new File([json], name, { type: 'application/json' });
  const mark = () => { S.lastExport = new Date().toISOString(); save(); render(); };
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Trainingslog Backup' });
      mark();
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  mark();
}

/* ---------- Event-Delegation ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = A[el.dataset.act];
  if (!fn) return;
  e.preventDefault();
  try { fn(el, e); } catch (err) { console.error(err); toast('Fehler: ' + err.message); }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset && el.dataset.in && I[el.dataset.in]) I[el.dataset.in](el, e);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset && el.dataset.ch && C[el.dataset.ch]) C[el.dataset.ch](el, e);
});
// Beim Fokus Inhalt markieren, damit Werte schnell überschrieben werden können
document.addEventListener('focusin', e => {
  const el = e.target;
  if (el.matches && el.matches('.set-row input')) setTimeout(() => { try { el.select(); } catch (_) { /* iOS */ } }, 0);
});

/* ---------- Start ---------- */
async function init() {
  let loaded = null;
  try { loaded = await DB.load(); } catch (e) { loaded = null; }
  S = loaded ? migrate(loaded) : defaultState();
  if (!loaded) await saveNow();
  UI.anchor = todayISO();
  UI.selDay = UI.anchor;
  render({ top: true });
  DB.isPersisted().then(p => {
    UI.persisted = p;
    if (!p) return DB.requestPersist().then(r => { UI.persisted = r; });
  }).then(() => { if (UI.tab === 'mehr' && !UI.sessionId) render(); });
}
init();
