'use strict';
/* Trainingslog – App-Logik (Vanilla JS, keine Abhängigkeiten) */

const VERSION = '2.0.0';
const WD_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WD_LONG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const COLORS = ['#f2703f', '#3a5bff', '#34c759', '#a855f7', '#f5b83d', '#ef4444', '#14b8a6', '#ec4899'];
const CHECK_SVG = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>';

let S = null;
const UI = {
  tab: 'home', calMode: 'week', selDay: null, sessionId: null, preview: null,
  ex: { q: '', muscle: '', equip: '' }, statTab: 'training', planDraft: null,
  metric: 'e1rm', pick: null, persisted: null
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
    settings: { strategy: 'same', bwStep: 0.1 },
    bodyweights: {},
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
  const remap = { '#ff7a1a': COLORS[0], '#3b8cff': COLORS[1], '#3ccf7a': COLORS[2], '#b26bff': COLORS[3] };
  for (const t of s.templates) if (remap[t.color]) t.color = remap[t.color];
  for (const x of s.sessions) if (remap[x.color]) x.color = remap[x.color];
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
  UI.preview = null;
  render({ top: true });
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

