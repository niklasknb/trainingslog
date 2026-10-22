'use strict';
/* Trainingslog 2 – Oberfläche */

/* ---------- Icons ---------- */
const sv = (d, cls = 'i', vb = '0 0 24 24') => `<svg class="${cls}" viewBox="${vb}">${d}</svg>`;
const IC = {
  home: sv('<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6.5H9V21H4.5a1 1 0 0 1-1-1z"/>'),
  route: sv('<circle cx="6" cy="5.5" r="2.5"/><path d="M8.5 5.5H15a3.3 3.3 0 0 1 0 6.6H9a3.3 3.3 0 0 0 0 6.6h6.5"/><circle cx="18" cy="18.7" r="2.5"/>'),
  stats: sv('<path d="M5 20v-7M12 20V5M19 20v-5" style="stroke-width:3.4"/>'),
  gear: sv('<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  flame: `<svg viewBox="0 0 24 24"><defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc53d"/><stop offset="1" stop-color="#f2703f"/></linearGradient></defs><path fill="url(#fl)" d="M12 2c.6 3.2 4.9 5.6 4.9 11A5.6 5.6 0 0 1 12 22a5.6 5.6 0 0 1-5.4-6.3c.3-2.6 2-3.6 2.5-6 1.4 1.4 1.6 2.8 1.6 2.8S12.6 9.6 12 2z"/><path fill="#e8432f" d="M12 13.5c1.6 1.6 2.6 3 2.6 4.6a2.6 2.6 0 1 1-5.2 0c0-1.3.7-2.2 1.5-3 .2.6.6 1 .6 1s.4-1.4.5-2.6z"/></svg>`,
  flameOff: `<svg viewBox="0 0 24 24"><path fill="#3a3a3d" d="M12 2c.6 3.2 4.9 5.6 4.9 11A5.6 5.6 0 0 1 12 22a5.6 5.6 0 0 1-5.4-6.3c.3-2.6 2-3.6 2.5-6 1.4 1.4 1.6 2.8 1.6 2.8S12.6 9.6 12 2z"/></svg>`,
  dots: '<svg class="i" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.8" fill="currentColor" stroke="none"/></svg>',
  dotsV: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.9" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.9" fill="currentColor" stroke="none"/></svg>',
  back: sv('<path d="M15 4.5 7.5 12l7.5 7.5"/>'),
  chevR: sv('<path d="m9 5 7 7-7 7"/>', 'i sm'),
  chevL: sv('<path d="m15 5-7 7 7 7"/>', 'i sm'),
  up: sv('<path d="m6 15 6-6 6 6"/>', 'i sm'),
  down: sv('<path d="m6 9 6 6 6-6"/>', 'i sm'),
  plus: sv('<path d="M12 5v14M5 12h14"/>'),
  minus: sv('<path d="M5 12h14"/>'),
  play: '<svg class="i" viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/></svg>',
  check: sv('<path d="m5 12.5 4.5 4.5L19 7"/>'),
  checkCircle: sv('<circle cx="12" cy="12" r="9.5"/><path d="m7.5 12.3 3 3 6-6.3"/>'),
  clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>'),
  list: sv('<path d="M3 7.5h6M3 16.5h6"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'),
  person: sv('<circle cx="12" cy="4.2" r="2"/><path d="M5 8.5h14M12 8.5v5.5m0 0-2.6 7m2.6-7 2.6 7"/>'),
  cal: sv('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.3h.01M12 17.3h.01" style="stroke-width:2.6"/>'),
  bars: sv('<path d="M6 20v-7M12 20V6M18 20v-4" style="stroke-width:3"/>'),
  repeat: sv('<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15m0 5v-5h5"/>'),
  info: sv('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>'),
  edit: sv('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
  trash: sv('<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>'),
  scale: sv('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 9.5a5 5 0 0 1 8 0M12 9.5l1.5-2"/>'),
  dumbbell: sv('<path d="m6.2 6.2 11.6 11.6M3.8 9.7l5.9-5.9M14.3 20.2l5.9-5.9M2.4 11.1l1.4 1.4m7.3-11.1 1.4 1.4m-.1 18.4 1.4 1.4m7.3-11.1 1.4 1.4" style="stroke-width:2.6"/>')
};

const EQ_GLYPH = {
  'Langhantel': '<path d="M4 24h40"/><rect x="9" y="14" width="5" height="20" rx="1.5"/><rect x="34" y="14" width="5" height="20" rx="1.5"/><rect x="5" y="18" width="4" height="12" rx="1"/><rect x="39" y="18" width="4" height="12" rx="1"/>',
  'SZ-Stange': '<path d="M5 24h8l3-3 4 6 4-6 4 6 4-6 3 3h8"/><rect x="8" y="16" width="4" height="16" rx="1.5"/><rect x="36" y="16" width="4" height="16" rx="1.5"/>',
  'Kurzhantel': '<path d="M17 24h14"/><rect x="11" y="15" width="6" height="18" rx="2"/><rect x="31" y="15" width="6" height="18" rx="2"/><rect x="7" y="19" width="4" height="10" rx="1.5"/><rect x="37" y="19" width="4" height="10" rx="1.5"/>',
  'Kabelzug': '<path d="M12 6v38M12 6h22"/><circle cx="34" cy="10" r="4"/><path d="M34 14v16"/><path d="M28 30h12l-2 5H30z"/><rect x="7" y="30" width="10" height="12" rx="1.5"/>',
  'Maschine': '<path d="M10 42V8M10 8h14M10 26h20l4 16"/><rect x="26" y="10" width="12" height="14" rx="2"/><path d="M18 26v-8"/>',
  'Multipresse': '<path d="M8 6v36M40 6v36M6 6h36M8 22h32"/><rect x="11" y="17" width="4" height="10" rx="1"/><rect x="33" y="17" width="4" height="10" rx="1"/>',
  'Körpergewicht': '<circle cx="24" cy="8" r="4"/><path d="M12 16h24M24 16v12m0 0-6 14m6-14 6 14"/>',
  'Kettlebell': '<path d="M17 18a7 7 0 1 1 14 0"/><path d="M14 22h20a4 4 0 0 1 4 4c0 8-6 15-14 15S10 34 10 26a4 4 0 0 1 4-4z"/>',
  'Band': '<path d="M10 14c6-6 22-6 28 0s0 20-14 20S4 20 10 14z"/><path d="M14 18c5-4 15-4 20 0"/>'
};
function tileHtml(ex, cls = '') {
  const g = EQ_GLYPH[ex && ex.equipment] || EQ_GLYPH['Kurzhantel'];
  return `<div class="tile ${cls}"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${g}</svg></div>`;
}
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
const SHORT_MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
function fmtMed(s) { const d = parse(s); return `${d.getDate()}. ${SHORT_MONTHS[d.getMonth()]}. ${d.getFullYear()}`; }

/* ---------- Ableitungen ---------- */
function tplStats(items, getEx) {
  const sets = items.reduce((n, it) => n + (Array.isArray(it.sets) ? it.sets.length : it.sets), 0);
  const minutes = Math.max(10, Math.round((sets * 2.6 + items.length * 1.5) / 5) * 5);
  const muscles = [];
  for (const it of items) { const ex = getEx(it); if (ex && !muscles.includes(ex.muscle)) muscles.push(ex.muscle); }
  return { sets, minutes, muscles };
}
function sessionMinutes(s) {
  const end = s.finishedAt || Date.now();
  return Math.max(1, Math.round((end - s.startedAt) / 60000));
}
function fmtElapsed(s) {
  const m = sessionMinutes(s);
  return m >= 60 ? `${Math.floor(m / 60)}:${pad(m % 60)} h` : `${m} Min`;
}
function finishedOn(date) { return S.sessions.some(s => s.finishedAt && s.date === date); }

function weekPlannedDone(ws) {
  const we = addDays(ws, 6);
  const occ = occurrences(ws, we);
  const planned = occ.filter(o => !o.adhoc && !o.skipped).length;
  const done = S.sessions.filter(s => s.finishedAt && s.date >= ws && s.date <= we).length;
  return { planned, done };
}
function streak() {
  const t = todayISO();
  let ws = weekStart(t);
  let n = 0;
  const cur = weekPlannedDone(ws);
  if (cur.done > 0 && cur.done >= Math.max(1, cur.planned)) n++;
  const firstSession = S.sessions.filter(s => s.finishedAt).map(s => s.date).sort()[0];
  if (!firstSession) return n;
  for (let i = 0; i < 260; i++) {
    ws = addDays(ws, -7);
    if (addDays(ws, 6) < firstSession) break;
    const w = weekPlannedDone(ws);
    if (w.done > 0 && w.done >= Math.max(1, w.planned)) n++; else break;
  }
  return n;
}

/* Körpergewicht */
function bwEntries() { return Object.entries(S.bodyweights).map(([date, kg]) => ({ date, kg })).sort((a, b) => a.date.localeCompare(b.date)); }
function bwLast(beforeOrOn) {
  const e = bwEntries().filter(x => !beforeOrOn || x.date <= beforeOrOn);
  return e[e.length - 1] || null;
}

/* ---------- Rendering: Rahmen ---------- */
function topbar(title, opts = {}) {
  const left = opts.back ? `<button class="back" data-act="${opts.back}" aria-label="Zurück">${IC.back}</button>` : '';
  return `${left}<h1>${esc(title)}</h1><div class="top-actions">${opts.right || ''}</div>`;
}
function streakHtml() {
  const n = streak();
  return `<button class="streak" data-act="streakInfo" aria-label="Streak">${n ? IC.flame : IC.flameOff}<span>${n}</span></button>`;
}
function renderNav() {
  const tabs = [['home', 'Home', IC.home], ['training', 'Training', IC.route], ['stats', 'Statistiken', IC.stats]];
  $('#nav').innerHTML = tabs.map(([k, l, ic]) => `<button data-act="tab" data-tab="${k}" class="${UI.tab === k ? 'active' : ''}">${ic}${l}</button>`).join('');
}
function render(opts = {}) {
  const y = window.scrollY;
  if (UI.sessionId && !getSession(UI.sessionId)) UI.sessionId = null;
  let r;
  if (UI.sessionId) r = viewSession();
  else if (UI.preview) r = viewPreview();
  else r = VIEWS[UI.tab]();
  if (!r) { UI.preview = null; r = VIEWS[UI.tab](); }
  document.body.classList.toggle('full', !!r.full);
  $('#top').innerHTML = r.top;
  $('#view').innerHTML = r.html;
  $('#bar').innerHTML = r.bar ? `<div class="bottom-bar">${r.bar}</div>` : '';
  renderNav();
  window.scrollTo(0, opts.top ? 0 : y);
}

/* ---------- Sheets ---------- */
function openSheet(def) { sheetStack.push(def); renderSheets(); }
function topSheet() { return sheetStack[sheetStack.length - 1]; }
function closeSheet() { sheetStack.pop(); renderSheets(); render(); }
function closeAllSheets() { sheetStack.length = 0; renderSheets(); }
function renderSheets() {
  const root = $('#sheets');
  const prev = $$('.sheet-body', root).map(b => b.scrollTop);
  root.innerHTML = sheetStack.map((d, i) => {
    const r = d.render(d.ctx || {});
    const anim = d._shown ? '' : ' anim';
    d._shown = true;
    const head = r.bare
      ? '<div class="grabber"></div>'
      : `<div class="sheet-head"><div class="l">${r.left != null ? r.left : '<button class="sh-btn" data-act="closeSheet">Schließen</button>'}</div><h3>${esc(r.title || '')}</h3><div class="r">${r.right || ''}</div></div>`;
    return `<div class="backdrop${anim}" data-act="closeSheet" style="z-index:${40 + i * 2}"></div>
      <div class="sheet${d.full ? ' full' : ''}${anim}" style="z-index:${41 + i * 2}">${head}
        <div class="sheet-body">${r.body}</div>${r.foot ? `<div class="sheet-foot">${r.foot}</div>` : ''}</div>`;
  }).join('');
  $$('.sheet-body', root).forEach((b, i) => { if (prev[i] != null) b.scrollTop = prev[i]; });
  document.body.style.overflow = sheetStack.length ? 'hidden' : '';
}

/* ---------- Diagramm (wie Statistik-Karten) ---------- */
function lineChart(points, color, opts = {}) {
  if (points.length < 2) return `<div class="empty small">${opts.emptyText || 'Ab zwei Einheiten erscheint hier ein Diagramm.'}</div>`;
  const W = 360, H = opts.h || 190, pl = 26, pr = 26, pt = 34, pb = 52;
  const vs = points.map(p => p.v);
  let mn = Math.min(...vs), mx = Math.max(...vs);
  if (mn === mx) { mn -= 1; mx += 1; }
  const xOf = i => pl + (W - pl - pr) * (i / (points.length - 1));
  const yOf = v => pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn));
  const many = points.length > 8;
  const lblIdx = new Set();
  if (!many) points.forEach((_, i) => lblIdx.add(i));
  else {
    lblIdx.add(0); lblIdx.add(points.length - 1);
    lblIdx.add(vs.indexOf(Math.max(...vs))); lblIdx.add(vs.indexOf(Math.min(...vs)));
  }
  const xIdx = new Set();
  if (!many) points.forEach((_, i) => xIdx.add(i));
  else for (let k = 0; k < 5; k++) xIdx.add(Math.round(k * (points.length - 1) / 4));
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${xOf(i).toFixed(1)},${yOf(p.v).toFixed(1)}`).join(' ');
  let out = `<svg class="chart" viewBox="0 0 ${W} ${H}"><path class="ln" d="${line}" stroke="${color}"/>`;
  points.forEach((p, i) => {
    const x = xOf(i), y = yOf(p.v);
    out += `<circle class="pt" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${many ? 3.5 : 6}" stroke="${color}"/>`;
    if (lblIdx.has(i)) {
      const anchor = i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle';
      out += `<text class="vl" x="${x.toFixed(1)}" y="${(y - 13).toFixed(1)}" fill="${color}" style="text-anchor:${many ? anchor : 'middle'}">${fmtNum(Math.round(p.v * 10) / 10)}</text>`;
    }
    if (xIdx.has(i)) {
      out += `<text class="xl" x="${x.toFixed(1)}" y="${H - 28}">${esc(p.l1)}</text><text class="xl" x="${x.toFixed(1)}" y="${H - 8}">${esc(p.l2)}</text>`;
    }
  });
  return out + '</svg>';
}
function dateLabels(date) { const d = parse(date); return { l1: SHORT_MONTHS[d.getMonth()], l2: String(d.getDate()) }; }
function chgHtml(diff, unit = 'kg') {
  const r = Math.round(diff * 10) / 10;
  const cls = r > 0 ? 'up' : r < 0 ? 'down' : 'flat';
  return `<span class="chg ${cls}">${r > 0 ? '+' : r < 0 ? '−' : '±'}${fmtNum(Math.abs(r))} ${unit}</span>`;
}

/* ---------- Ansicht: Home ---------- */
function nextOccurrence() {
  const t = todayISO();
  const list = occurrences(t, addDays(t, 21)).filter(o => !o.skipped && !(o.sessionId && getSession(o.sessionId).finishedAt));
  return list[0] || null;
}
function viewHome() {
  const t = todayISO();
  let html = '';
  const hasItems = S.templates.some(x => x.items.length);
  const hasPlan = S.plans.some(p => p.slots.length);
  if (!hasItems || !hasPlan) {
    html += `<div class="hint"><b>Erste Schritte</b><div class="small" style="margin:6px 0 12px;color:#e5e5ea">
      ${!hasItems ? 'Fülle deine Push- und Pull-Vorlage mit Übungen. ' : ''}${!hasPlan ? 'Lege fest, an welchen Tagen du trainierst.' : ''}</div>
      <div class="stack">${!hasItems ? '<button class="btn sm accent block" data-act="templates">Vorlagen bearbeiten</button>' : ''}
      ${!hasPlan ? '<button class="btn sm block" data-act="weekPlan">Wochenplan festlegen</button>' : ''}</div></div>`;
  }
  const fin = S.sessions.filter(s => s.finishedAt).length;
  if (fin >= 5 && (!S.lastExport || daysBetween(S.lastExport.slice(0, 10), t) > 14)) {
    html += `<div class="hint small">Dein letztes Backup ist ${S.lastExport ? `vom ${fmtShort(S.lastExport.slice(0, 10))}` : 'noch nicht erstellt'}.
      <div style="margin-top:10px"><button class="btn sm accent" data-act="exportData">Backup jetzt erstellen</button></div></div>`;
  }

  html += `<div class="sec">Willkommen zurück</div>`;
  const run = runningSession();
  if (run) {
    const st = tplStats(run.items, it => exById(it.exerciseId));
    html += heroHtml(run.name, run.color, `${doneSets(run)}/${st.sets} Sätze · seit ${fmtElapsed(run)}`, 'Läuft gerade', `<button class="btn outline" data-act="openSession" data-id="${run.id}">Fortsetzen</button>`);
  } else {
    const o = nextOccurrence();
    if (o) {
      const tpl = tplById(o.templateId);
      const items = tpl ? tpl.items : [];
      const st = tplStats(items, it => exById(it.exerciseId));
      const when = o.date === t ? 'Heute' : o.date === addDays(t, 1) ? 'Morgen' : fmtDay(o.date);
      const btn = o.sessionId
        ? `<button class="btn outline" data-act="openSession" data-id="${o.sessionId}">Fortsetzen</button>`
        : `<button class="btn outline" data-act="${o.date === t ? 'startDirect' : 'preview'}" data-key="${esc(o.key)}" data-date="${o.date}">${o.date === t ? 'Starten' : 'Ansehen'}</button>`;
      html += heroHtml(tpl ? tpl.name : 'Training', tpl ? tpl.color : COLORS[0], `${fmtMin(st.minutes)}, ${exCount(items.length)}`, when, btn);
    } else {
      html += heroHtml('Kein Training geplant', COLORS[1], 'In den nächsten drei Wochen', '', '<button class="btn outline" data-act="weekPlan">Wochenplan</button>');
    }
  }

  // Gewohnheiten
  const ws = weekStart(t);
  const days30 = [...Array(30)].map((_, i) => addDays(t, i - 29));
  const bwWeek = Object.keys(S.bodyweights).filter(d => d >= ws && d <= t).length;
  const wk = weekPlannedDone(ws);
  html += `<div class="sec">Gewohnheiten</div><div class="grid2">
    <div class="card habit tap" data-act="statsBw"><div class="h">Weigh-In</div><div class="sub">Letzte 30 Tage</div>
      <div class="body"><div class="sq-grid">${days30.map(d => `<i class="${S.bodyweights[d] != null ? 'on-g' : ''}${d === t ? ' today' : ''}"></i>`).join('')}</div></div>
      <div class="foot"><b>${bwWeek}/7</b><span>diese Woche</span></div></div>
    <div class="card habit tap" data-act="tab" data-tab="training"><div class="h">Trainings</div><div class="sub">Letzte 30 Tage</div>
      <div class="body"><div class="sq-grid">${days30.map(d => `<i class="${finishedOn(d) ? 'on-o' : ''}${d === t ? ' today' : ''}"></i>`).join('')}</div></div>
      <div class="foot"><b>${wk.done}/${Math.max(wk.planned, wk.done)}</b><span>diese Woche</span></div></div></div>`;

  // Gewicht heute
  const todayBw = S.bodyweights[t];
  const last = bwLast(t);
  const shown = todayBw != null ? todayBw : last ? last.kg : null;
  const sub = todayBw != null ? 'Heute eingetragen' : last ? `Zuletzt am ${fmtShort(last.date)}` : 'Noch kein Eintrag';
  html += `<div class="sec">Gewicht eingeben ${IC.info.replace('class="i"', 'class="i" data-act="bwInfo"')}</div>
    <div class="card weigh"><button class="round-btn" data-act="bwStep" data-d="-1" aria-label="Weniger">${IC.minus}</button>
      <div class="val"><input inputmode="decimal" data-ch="bwToday" value="${shown != null ? inNum(shown) + ' kg' : ''}" placeholder="– kg" class="${todayBw != null ? '' : 'unset'}" aria-label="Körpergewicht heute"><div class="u">${sub}</div></div>
      <button class="round-btn" data-act="bwStep" data-d="1" aria-label="Mehr">${IC.plus}</button></div>`;

  return {
    top: topbar('Dashboard', { right: `${streakHtml()}<button class="icon-btn" data-act="settings" aria-label="Einstellungen">${IC.gear}</button>` }),
    html
  };
}
function minutesTxt(m) { return `${m} Minute${m === 1 ? '' : 'n'}`; }
function fmtMin(m) { return m >= 60 ? `${Math.floor(m / 60)}:${pad(m % 60)} h` : `${m} Min`; }
function heroHtml(name, color, meta, when, btn) {
  return `<div class="card hero">
    <svg class="art" viewBox="0 0 24 24" fill="none" stroke="${hexA(color, .35)}" stroke-width="1.6" stroke-linecap="round"><path d="m6.2 6.2 11.6 11.6M3.8 9.7l5.9-5.9M14.3 20.2l5.9-5.9M2.4 11.1l1.4 1.4m7.3-11.1 1.4 1.4m-.1 18.4 1.4 1.4m7.3-11.1 1.4 1.4"/></svg>
    ${when ? `<div class="when">${esc(when)}</div>` : ''}<div class="name">${esc(name)}</div><div class="meta">${esc(meta)}</div>${btn}</div>`;
}

/* ---------- Ansicht: Training ---------- */
function marksHtml(list) {
  const vis = list.filter(o => !o.skipped);
  if (!vis.length) return '';
  const cols = vis.slice(0, 3).map(o => {
    const s = o.sessionId && getSession(o.sessionId);
    const tpl = tplById(o.templateId);
    return s ? s.color : tpl ? tpl.color : '#888';
  });
  if (cols.length === 1) return `<span class="mark"><i style="background:${cols[0]};border-radius:5px"></i></span>`;
  return `<span class="mark two" style="width:${cols.length * 9}px">${cols.map(c => `<i style="background:${c}"></i>`).join('')}</span>`;
}
function calDayHtml(d, occ, out) {
  const t = todayISO();
  const list = occ.filter(o => o.date === d);
  const done = finishedOn(d);
  const cls = ['cal-day', d === UI.selDay ? 'sel' : '', d === t ? 'today' : '', out ? 'out' : ''].join(' ');
  const num = done ? `<span class="done-ic">${IC.checkCircle}</span>` : `<span class="n">${parse(d).getDate()}</span>`;
  return `<button class="${cls}" data-act="selDay" data-date="${d}">${num}<span class="marks">${done ? '' : marksHtml(list)}</span></button>`;
}
function viewTraining() {
  const t = todayISO();
  if (!UI.selDay) UI.selDay = t;
  const sel = UI.selDay;
  let cal = '';
  if (UI.calMode === 'week') {
    const ws = weekStart(sel), we = addDays(ws, 6);
    const occ = occurrences(ws, we);
    cal = `<div class="cal-head"><div class="lbl">${fmtMed(sel)}</div><div class="nav">
        <button class="icon-btn" data-act="calShift" data-d="-1" aria-label="Zurück">${IC.chevL}</button>
        <button class="icon-btn" data-act="calShift" data-d="1" aria-label="Weiter">${IC.chevR}</button>
        <button class="icon-btn" data-act="trainMenu" aria-label="Menü">${IC.dots}</button></div></div>
      <div class="cal-grid">${WD_SHORT.map(w => `<div class="wd">${w}</div>`).join('')}${[...Array(7)].map((_, i) => calDayHtml(addDays(ws, i), occ)).join('')}</div>`;
  } else {
    const a = parse(sel);
    const first = iso(new Date(a.getFullYear(), a.getMonth(), 1));
    const last = iso(new Date(a.getFullYear(), a.getMonth() + 1, 0));
    const occ = occurrences(first, last);
    let cells = '';
    for (let i = 0; i < wdOf(first); i++) cells += '<div></div>';
    for (let d = first; d <= last; d = addDays(d, 1)) cells += calDayHtml(d, occ);
    cal = `<div class="cal-head"><div class="lbl">${MONTHS[a.getMonth()]} ${a.getFullYear()}</div><div class="nav">
        <button class="icon-btn" data-act="calShift" data-d="-1" aria-label="Zurück">${IC.chevL}</button>
        <button class="icon-btn" data-act="calShift" data-d="1" aria-label="Weiter">${IC.chevR}</button>
        <button class="icon-btn" data-act="trainMenu" aria-label="Menü">${IC.dots}</button></div></div>
      <div class="cal-grid">${WD_SHORT.map(w => `<div class="wd">${w}</div>`).join('')}${cells}</div>`;
  }
  let html = `<div class="calbox" id="calbox">${cal}</div>`;
  const items = occurrences(sel, sel);
  html += items.map(workoutCardHtml).join('');
  if (!items.length) html += `<div class="card empty">${sel === t ? 'Heute ist Ruhetag.' : `${fmtDay(sel)}: kein Training geplant.`}</div>`;
  html += `<button class="btn block" data-act="addExtra" data-date="${sel}">${IC.plus} Training hinzufügen</button>`;
  return {
    top: topbar('Training', { right: streakHtml() }),
    html
  };
}
function workoutCardHtml(o) {
  const tpl = tplById(o.templateId);
  const sess = o.sessionId && getSession(o.sessionId);
  const name = sess ? sess.name : tpl ? tpl.name : 'Gelöschte Vorlage';
  const color = sess ? sess.color : tpl ? tpl.color : '#888';
  const items = sess ? sess.items : tpl ? tpl.items : [];
  const st = tplStats(items, it => exById(it.exerciseId));
  const status = occStatus(o);
  const stCls = { ok: 'ok', run: 'run', miss: 'miss', skip: 'plan', '': 'plan' }[status.cls];
  let stText = status.label;
  if (o.moved && !sess) stText += ` · verschoben von ${WD_SHORT[wdOf(o.origDate)]}`;
  if (o.extra && !sess) stText += ' · Zusatz';
  const timeTxt = sess ? (sess.finishedAt ? minutesTxt(sessionMinutes(sess)) : `seit ${fmtElapsed(sess)}`) : `≈ ${st.minutes} Minuten`;
  const setsTxt = sess ? `${doneSets(sess)}/${st.sets} Sätze` : exCount(items.length);
  return `<div class="wcard${o.skipped ? ' skipped' : ''}" data-act="occ" data-key="${esc(o.key)}" data-date="${o.date}" role="button">
    <div class="wc-head"><div class="wc-icon" style="background:${hexA(color, .22)};color:${color}">${IC.dumbbell}</div>
      <div class="wc-title"><div class="n">${esc(name)}</div><div class="st ${stCls}">${esc(stText)}</div></div>
      <button class="icon-btn" data-act="occMenu" data-key="${esc(o.key)}" data-date="${o.date}" aria-label="Optionen">${IC.dotsV}</button></div>
    <div class="wc-meta"><div>${IC.clock}<span>${timeTxt}</span></div><div>${IC.list}<span>${setsTxt}</span></div>
      ${st.muscles.length ? `<div class="full">${IC.person}<span class="ell">${esc(st.muscles.join(', '))}</span></div>` : ''}</div>
    ${items.length ? `<div class="wc-tiles">${items.slice(0, 5).map(it => tileHtml(exById(it.exerciseId))).join('')}</div>` : ''}</div>`;
}

/* ---------- Vorschau eines geplanten Trainings ---------- */
function viewPreview() {
  const p = UI.preview;
  const o = findOcc(p.key, p.date);
  if (!o) return null;
  if (o.sessionId) { UI.preview = null; UI.sessionId = o.sessionId; return viewSession(); }
  const tpl = tplById(o.templateId);
  if (!tpl) return null;
  const st = tplStats(tpl.items, it => exById(it.exerciseId));
  let html = `<div class="pills"><span class="pill">${IC.cal}${fmtDay(o.date)}</span><span class="pill">${IC.clock}≈ ${st.minutes} Minuten</span><span class="pill">${IC.list}${exCount(tpl.items.length)}</span></div>`;
  if (!tpl.items.length) html += `<div class="card empty">Diese Vorlage hat noch keine Übungen.<div style="margin-top:12px"><button class="btn sm accent" data-act="editTplPreview">Übungen hinzufügen</button></div></div>`;
  for (const it of tpl.items) {
    const ex = exById(it.exerciseId);
    if (!ex) continue;
    const sug = Progression.suggest(S, { exerciseId: ex.id, setCount: it.sets, repMin: it.repMin, repMax: it.repMax, weights: weightsFor(ex), beforeDate: o.date });
    const w = sug.sets[0] && sug.sets[0].weight;
    const inf = w != null ? `${it.sets} Sätze × ${fmtNum(w)} kg` : `${it.sets} Sätze × ${it.repMin}–${it.repMax} Wdh`;
    html += `<button class="ex-card" data-act="exInfo" data-id="${ex.id}">${tileHtml(ex)}<div class="grow"><div class="mg">${esc(ex.muscle)}</div><div class="nm">${esc(ex.name)}</div><div class="inf">${inf}</div></div><span class="side">${IC.chevR}</span></button>`;
  }
  return {
    full: true,
    top: topbar(tpl.name, { back: 'closePreview', right: `<button class="icon-btn" data-act="occMenu" data-key="${esc(o.key)}" data-date="${o.date}" aria-label="Optionen">${IC.dotsV}</button>` }),
    html,
    bar: `<button class="btn spread" data-act="editTplPreview">Bearbeiten ${IC.edit}</button><button class="btn white spread" data-act="startPreview">Starten ${IC.play}</button>`
  };
}

/* ---------- Trainingsmodus ---------- */
function ringHtml(done, total) {
  const r = 16, c = 2 * Math.PI * r, f = total ? done / total : 0;
  return `<svg class="progress-ring" viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="${r}"/><circle class="fg" cx="20" cy="20" r="${r}" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}"/></svg>`;
}
function viewSession() {
  const s = getSession(UI.sessionId);
  const total = s.items.reduce((n, it) => n + it.sets.length, 0);
  let html = `<div class="pills"><span class="pill">${IC.cal}${fmtDay(s.date)}</span><span class="pill" id="elapsed">${IC.clock}${s.finishedAt ? minutesTxt(sessionMinutes(s)) : fmtElapsed(s)}</span><span class="pill${s.finishedAt ? ' hl' : ''}">${IC.check}${doneSets(s)}/${total} Sätze</span></div>`;
  if (!s.items.length) html += '<div class="card empty">Noch keine Übungen. Füge unten Übungen hinzu.</div>';
  for (const it of s.items) {
    const ex = exById(it.exerciseId);
    const done = it.sets.filter(x => x.done);
    const allDone = it.sets.length && done.length === it.sets.length;
    let inf;
    if (done.length) {
      const top = done.reduce((a, b) => (b.weight || 0) > (a.weight || 0) ? b : a, done[0]);
      inf = `${done.length}/${it.sets.length} Sätze · bis ${fmtNum(top.weight)} kg`;
    } else {
      const w = it.sets[0] && it.sets[0].sw;
      inf = w != null ? `${it.sets.length} Sätze × ${fmtNum(w)} kg` : `${it.sets.length} Sätze × ${it.repMin}–${it.repMax} Wdh`;
    }
    html += `<button class="ex-card${allDone ? ' done' : ''}" data-act="openSet" data-item="${it.id}">${tileHtml(ex)}
      <div class="grow"><div class="mg">${esc(ex ? ex.muscle : '')}</div><div class="nm">${esc(ex ? ex.name : it.name)}</div><div class="inf">${inf}</div></div>
      <span class="side">${allDone ? IC.checkCircle : ringHtml(done.length, it.sets.length)}</span></button>`;
  }
  return {
    full: true,
    top: topbar(s.name, { back: 'closeSession', right: `<button class="icon-btn" data-act="sessMenu" aria-label="Optionen">${IC.dotsV}</button>` }),
    html,
    bar: s.finishedAt
      ? `<button class="btn spread" data-act="sessAddEx">Hinzufügen ${IC.plus}</button><button class="btn white spread" data-act="closeSession">Fertig ${IC.check}</button>`
      : `<button class="btn spread" data-act="sessAddEx">Hinzufügen ${IC.plus}</button><button class="btn white spread" data-act="finishSession">Beenden ${IC.play}</button>`
  };
}
function openSetSheet(itemId) {
  const s = getSession(UI.sessionId);
  const it = s.items.find(x => x.id === itemId);
  const firstOpen = it.sets.findIndex(x => !x.done);
  openSheet({ ctx: { itemId, active: firstOpen >= 0 ? firstOpen : Math.max(0, it.sets.length - 1) }, render: renderSetSheet });
}
function renderSetSheet(ctx) {
  const s = getSession(UI.sessionId);
  const it = s && s.items.find(x => x.id === ctx.itemId);
  if (!it) return { bare: true, body: '' };
  const ex = exById(it.exerciseId);
  if (ctx.active >= it.sets.length) ctx.active = Math.max(0, it.sets.length - 1);
  const a = it.sets[ctx.active];
  const first = it.sets.find(x => x.sw != null);
  let body = `<div class="set-head">${tileHtml(ex)}<div><div class="mg">${esc(ex ? ex.muscle : '')}</div><div class="nm">${esc(ex ? ex.name : it.name)}</div></div></div>
    <div class="pills"><span class="pill">${IC.bars}${it.sets.length} Sätze</span><span class="pill">${IC.repeat}${it.repMin}–${it.repMax} Wdh</span>
      ${first ? `<span class="pill hl">${IC.info}${fmtNum(first.sw)} kg × ${first.sr}</span>` : ''}</div>
    <div class="set-table"><div class="th"><div>SATZ</div><div>WDH</div><div>KG</div><div>RIR</div></div>`;
  it.sets.forEach((x, i) => {
    const cls = ['tr', x.done ? 'done' : '', i === ctx.active ? 'active' : ''].join(' ');
    const v = (val, f) => val == null ? '-' : f(val);
    const dimmed = !x.done && i !== ctx.active;
    body += `<button class="${cls}" data-act="selSet" data-i="${i}"><div class="no">${x.done ? '✓' : i + 1}</div>
      <div class="${dimmed ? 'sg' : ''}">${v(x.reps, String)}</div><div class="${dimmed ? 'sg' : ''}">${v(x.weight, fmtNum)}</div><div class="${dimmed ? 'sg' : ''}">${v(x.rir, String)}</div></button>`;
  });
  body += `</div>`;
  if (a) {
    body += `<div class="steppers">
      <div class="stp"><div class="l">WDH</div><div class="c"><button data-act="stp" data-f="reps" data-d="-1" aria-label="Weniger">${IC.minus}</button><input inputmode="numeric" data-in="stReps" data-ch="stDone" value="${a.reps ?? ''}" placeholder="–"><button data-act="stp" data-f="reps" data-d="1" aria-label="Mehr">${IC.plus}</button></div></div>
      <div class="stp"><div class="l">KG</div><div class="c"><button data-act="stp" data-f="weight" data-d="-1" aria-label="Weniger">${IC.minus}</button><input inputmode="decimal" data-in="stWeight" data-ch="stDone" value="${inNum(a.weight)}" placeholder="–"><button data-act="stp" data-f="weight" data-d="1" aria-label="Mehr">${IC.plus}</button></div></div>
      <div class="stp"><div class="l">RIR</div><div class="c"><button data-act="stp" data-f="rir" data-d="-1" aria-label="Weniger">${IC.minus}</button><input inputmode="numeric" data-in="stRir" data-ch="stDone" value="${a.rir ?? ''}" placeholder="–"><button data-act="stp" data-f="rir" data-d="1" aria-label="Mehr">${IC.plus}</button></div></div></div>`;
  }
  const last = Progression.lastPerformance(S, it.exerciseId, s.id, s.date);
  body += `<div class="set-info">${last
    ? `Letztes Mal (${fmtShort(last.date)}): ${last.sets.map(x => `<b>${fmtNum(x.weight)}</b>×${x.reps}${x.rir != null ? ` @${x.rir}` : ''}`).join(' · ')}`
    : 'Noch keine Historie. Trage dein Startgewicht ein, ab dem nächsten Mal bekommst du Vorschläge.'}</div>`;
  body += `<div style="display:flex;justify-content:space-between;margin-top:6px"><button class="link" data-act="addSet">+ Satz</button>
    ${a && a.done ? '<button class="link" data-act="unsetSet">Als offen markieren</button>' : ''}<button class="link" data-act="removeSet" ${it.sets.length ? '' : 'disabled'}>− Satz</button></div>`;
  body += `<div class="set-actions"><button class="gear" data-act="itemMenu" aria-label="Optionen">${IC.gear}</button>
    ${a ? `<button class="btn white spread" data-act="saveSet">${a.done ? 'Satz aktualisieren' : 'Satz speichern'} ${IC.play}</button>` : `<button class="btn white" data-act="addSet">Satz hinzufügen</button>`}</div>`;
  return { bare: true, body };
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

/* ---------- Ansicht: Statistiken ---------- */
function viewStats() {
  let html = `<div class="tabs-u"><button class="${UI.statTab === 'training' ? 'on' : ''}" data-act="statTab" data-t="training">Training</button>
    <button class="${UI.statTab === 'bw' ? 'on' : ''}" data-act="statTab" data-t="bw">Körpergewicht</button></div>`;
  html += UI.statTab === 'bw' ? statsBwHtml() : statsTrainingHtml();
  return { top: topbar('Statistiken'), html };
}
function statsTrainingHtml() {
  const t = todayISO();
  const fin = S.sessions.filter(s => s.finishedAt);
  const ws = weekStart(t), ms = t.slice(0, 8) + '01';
  let html = `<div class="stats3"><div class="stat"><div class="v">${fin.filter(s => s.date >= ws && s.date <= t).length}</div><div class="l">diese Woche</div></div>
    <div class="stat"><div class="v">${fin.filter(s => s.date >= ms && s.date <= t).length}</div><div class="l">diesen Monat</div></div>
    <div class="stat"><div class="v">${fin.length}</div><div class="l">gesamt</div></div></div>`;
  const ids = new Set();
  for (const s of fin) for (const it of s.items) if (it.sets.some(x => x.done)) ids.add(it.exerciseId);
  if (!ids.size) return html + '<div class="card empty">Sobald du ein Training abschließt, siehst du hier deinen Fortschritt pro Übung.</div>';
  const byMuscle = {};
  for (const id of ids) {
    const ex = exById(id);
    const m = ex ? ex.muscle : 'Sonstige';
    const h = exerciseHistory(id);
    if (!h.length) continue;
    (byMuscle[m] = byMuscle[m] || []).push({ id, ex, h });
  }
  const order = [...MUSCLES, 'Sonstige'];
  for (const m of order) {
    const list = byMuscle[m];
    if (!list) continue;
    list.sort((a, b) => b.h[b.h.length - 1].date.localeCompare(a.h[a.h.length - 1].date));
    html += `<div class="sec">${esc(m)} ${IC.chevR}</div>`;
    for (const { id, ex, h } of list) {
      const win = h.slice(-7);
      const pts = win.map(x => ({ v: Math.round(x.e1rm * 10) / 10, ...dateLabels(x.date) }));
      const diff = win.length > 1 ? win[win.length - 1].e1rm - win[0].e1rm : 0;
      html += `<div class="card stat-card tap" data-act="showProgress" data-id="${id}"><div class="hd"><div class="grow"><div class="ttl">${esc(ex ? ex.name : 'Übung')}</div>
        <div class="sb">Letzte ${win.length} Training${win.length === 1 ? '' : 's'} · e1RM</div></div>${win.length > 1 ? chgHtml(diff) : ''}<span class="chg flat">${IC.chevR}</span></div>
        ${lineChart(pts, COLORS[0], { emptyText: `Erst eine Einheit: ${fmtNum(Math.round(win[0].e1rm * 10) / 10)} kg e1RM am ${fmtShort(win[0].date)}` })}</div>`;
    }
  }
  html += '<p class="small muted" style="margin:4px 6px">e1RM = geschätztes Maximalgewicht für eine Wiederholung, berechnet aus Gewicht, Wiederholungen und RIR.</p>';
  return html;
}
function statsBwHtml() {
  const e = bwEntries();
  let html = '';
  if (!e.length) return '<div class="card empty">Noch kein Gewicht eingetragen. Das geht auf dem Dashboard oder hier.<div style="margin-top:12px"><button class="btn sm accent" data-act="bwAdd">Gewicht eintragen</button></div></div>';
  const last7 = e.slice(-7);
  const cur = e[e.length - 1];
  const green = '#34c759';
  html += `<div class="card stat-card"><div class="hd"><div class="grow"><div class="ttl">Körpergewicht</div><div class="sb">${last7.length === 1 ? 'Letzter Eintrag' : `Letzte ${last7.length} Einträge`}</div></div>
    <span class="chg flat"><span class="big">${fmtNum(cur.kg)} kg</span></span>${last7.length > 1 ? chgHtml(cur.kg - last7[0].kg) : ''}</div>
    ${lineChart(last7.map(x => ({ v: x.kg, l1: WD_SHORT[wdOf(x.date)], l2: String(parse(x.date).getDate()) })), green, { emptyText: 'Ab zwei Einträgen erscheint hier ein Diagramm.' })}</div>`;
  const t = todayISO();
  const last30 = e.filter(x => x.date >= addDays(t, -29));
  if (last30.length > 2) {
    html += `<div class="card stat-card"><div class="hd"><div class="grow"><div class="ttl">Letzte 30 Tage</div><div class="sb">${last30.length} Einträge</div></div>${chgHtml(last30[last30.length - 1].kg - last30[0].kg)}</div>
      ${lineChart(last30.map(x => ({ v: x.kg, ...dateLabels(x.date) })), green)}</div>`;
  }
  if (e.length > 30) {
    html += `<div class="card stat-card"><div class="hd"><div class="grow"><div class="ttl">Gesamt</div><div class="sb">seit ${fmtShort(e[0].date)}</div></div>${chgHtml(cur.kg - e[0].kg)}</div>
      ${lineChart(e.map(x => ({ v: x.kg, ...dateLabels(x.date) })), green)}</div>`;
  }
  html += `<div class="sec">Einträge</div><div class="list">${[...e].reverse().slice(0, 60).map(x => `<button class="row" data-act="bwEdit" data-date="${x.date}"><span class="grow"><div class="t">${fmtNum(x.kg)} kg</div><div class="s">${fmtLong(x.date)}</div></span>${IC.chevR}</button>`).join('')}</div>
    <button class="btn block" data-act="bwAdd">${IC.plus} Eintrag hinzufügen</button>`;
  return html;
}
function openProgress(exId) {
  openSheet({
    full: true,
    ctx: { exId },
    render({ exId }) {
      const ex = exById(exId);
      const h = exerciseHistory(exId);
      if (!h.length) return { title: ex ? ex.name : '', body: '<div class="empty">Noch keine abgeschlossenen Sätze.</div>' };
      const m = METRICS[UI.metric] || METRICS.e1rm;
      const bestW = h.reduce((b, x) => (x.top.weight || 0) > (b.top.weight || 0) ? x : b, h[0]);
      const best1 = h.reduce((b, x) => x.e1rm > b.e1rm ? x : b, h[0]);
      const pts = h.map(x => ({ v: Math.round(m.get(x) * 10) / 10, ...dateLabels(x.date) }));
      let body = `<div class="seg" style="margin-bottom:12px">${Object.entries(METRICS).map(([k, mm]) => `<button class="${UI.metric === k ? 'on' : ''}" data-act="metric" data-m="${k}">${mm.label}</button>`).join('')}</div>
        <div class="card stat-card" style="padding-top:8px">${lineChart(pts, COLORS[0])}</div>
        <div class="grid2" style="margin-bottom:12px">
          <div class="stat"><div class="v">${fmtNum(bestW.top.weight)}<span class="small muted"> kg</span></div><div class="l">Bestes Gewicht · ${bestW.top.reps} Wdh · ${fmtShort(bestW.date)}</div></div>
          <div class="stat"><div class="v">${fmtNum(Math.round(best1.e1rm * 10) / 10)}<span class="small muted"> kg</span></div><div class="l">Bestes e1RM · ${fmtShort(best1.date)}</div></div></div>
        <div class="sec">Verlauf</div><div class="list">`;
      for (const x of [...h].reverse()) {
        body += `<button class="row" data-act="openSession" data-id="${x.sessionId}"><span class="grow"><div class="t small">${fmtDay(x.date)}</div>
          <div class="hist-sets">${x.sets.map(st => `<span>${fmtNum(st.weight)} × ${st.reps}${st.rir != null ? ` <span class="muted">@${st.rir}</span>` : ''}</span>`).join('')}</div></span>${IC.chevR}</button>`;
      }
      body += '</div>';
      return { title: ex ? ex.name : 'Verlauf', body };
    }
  });
}
function openBwSheet(date) {
  const exists = S.bodyweights[date] != null;
  const last = bwLast(date);
  openSheet({
    ctx: { date, orig: exists ? date : null, val: exists ? inNum(S.bodyweights[date]) : last ? inNum(last.kg) : '' },
    render(ctx) {
      return {
        title: ctx.orig ? 'Eintrag bearbeiten' : 'Gewicht eintragen',
        body: `<label class="field"><span>Datum</span><input type="date" data-in="bwDate" value="${ctx.date}" max="${todayISO()}"></label>
          <label class="field"><span>Gewicht in kg</span><input inputmode="decimal" data-in="bwVal" value="${esc(ctx.val)}" placeholder="z. B. 74,5"></label>
          <div class="stack"><button class="btn white block" data-act="bwSave">Speichern</button>
          ${ctx.orig ? '<button class="btn danger block" data-act="bwDelete">Eintrag löschen</button>' : ''}</div>`
      };
    }
  });
}

/* ---------- Sheets: Training-Menüs ---------- */
function openOccMenu(key, date) {
  const o = findOcc(key, date);
  if (!o) { toast('Termin nicht gefunden'); return; }
  openSheet({
    ctx: { o },
    render({ o }) {
      const tpl = tplById(o.templateId);
      const sess = o.sessionId && getSession(o.sessionId);
      let body = `<div class="muted small" style="margin-bottom:8px">${fmtLong(o.date)}${o.moved ? ` · ursprünglich ${fmtDay(o.origDate)}` : ''}</div>`;
      if (sess) body += `<button class="btn white block" data-act="openSession" data-id="${sess.id}">${sess.finishedAt ? 'Training ansehen' : 'Training fortsetzen'}</button>`;
      if (!sess && !o.skipped) {
        const ws = weekStart(o.date);
        body += `<div class="sec">Verschieben</div><div class="week-chips">`;
        for (let i = 0; i < 7; i++) {
          const d = addDays(ws, i);
          body += `<button class="${d === o.date ? 'on' : ''}${d === o.origDate && d !== o.date ? ' orig' : ''}" data-act="moveTo" data-date="${d}">${WD_SHORT[i]}<b>${parse(d).getDate()}</b></button>`;
        }
        body += `</div><label class="field"><span>Oder anderes Datum</span><input type="date" data-ch="moveDate" value="${o.date}"></label>`;
        if (o.moved) body += `<button class="btn block" data-act="moveTo" data-date="${o.origDate}">Zurück auf ${fmtDay(o.origDate)}</button>`;
        body += `<p class="small muted">Verschiebt nur diesen Termin. Feste Wochentage änderst du im Wochenplan.</p>`;
      }
      body += '<div class="stack" style="margin-top:12px">';
      if (tpl) body += `<button class="btn block" data-act="editTpl" data-id="${tpl.id}">Vorlage „${esc(tpl.name)}“ bearbeiten</button>`;
      if (!sess) {
        if (o.extra) body += `<button class="btn danger block" data-act="removeExtra">Zusatztraining entfernen</button>`;
        else if (o.skipped) body += `<button class="btn block" data-act="skipOcc" data-v="0">Wiederherstellen</button>`;
        else body += `<button class="btn danger block" data-act="skipOcc" data-v="1">Diesen Termin auslassen</button>`;
      }
      body += '</div>';
      return { title: sess ? sess.name : tpl ? tpl.name : 'Termin', body };
    }
  });
}
function openTrainMenu() {
  openSheet({
    render() {
      return {
        title: 'Training',
        body: `<div class="list">
          <button class="row" data-act="calMode"><span class="grow"><div class="t">${UI.calMode === 'week' ? 'Monatsansicht' : 'Wochenansicht'}</div></span>${IC.cal}</button>
          <button class="row" data-act="weekPlan"><span class="grow"><div class="t">Wochenplan</div><div class="s">Feste Trainingstage festlegen</div></span>${IC.chevR}</button>
          <button class="row" data-act="templates"><span class="grow"><div class="t">Vorlagen</div><div class="s">Push, Pull und weitere bearbeiten</div></span>${IC.chevR}</button>
          <button class="row" data-act="catalog"><span class="grow"><div class="t">Übungskatalog</div><div class="s">${S.exercises.filter(e => !e.hidden).length} Übungen</div></span>${IC.chevR}</button>
          <button class="row" data-act="calToday"><span class="grow"><div class="t">Zu heute springen</div></span>${IC.chevR}</button></div>`
      };
    }
  });
}
function openSessMenu() {
  openSheet({
    render() {
      const s = getSession(UI.sessionId);
      return {
        title: s.name,
        body: `<label class="field"><span>Datum des Trainings</span><input type="date" data-ch="sessDate" value="${s.date}"></label>
          <div class="stack">${s.finishedAt ? '<button class="btn block" data-act="reopenSession">Training wieder öffnen</button>' : '<button class="btn white block" data-act="finishSession">Training beenden</button>'}
          <button class="btn danger block" data-act="deleteSession">Training löschen</button></div>`
      };
    }
  });
}

/* ---------- Sheets: Wochenplan & Vorlagen ---------- */
function openWeekPlan() {
  const p = latestPlan();
  const days = Array(7).fill('');
  if (p) for (const s of p.slots) if (tplById(s.templateId)) days[s.weekday] = s.templateId;
  const t = todayISO();
  openSheet({
    ctx: { days, from: p && p.validFrom > t ? p.validFrom : t },
    render(ctx) {
      let body = '<div class="list">';
      for (let i = 0; i < 7; i++) {
        body += `<div class="wp-row"><div>${WD_LONG[i]}</div><select data-ch="wpDay" data-i="${i}"><option value="">Ruhetag</option>
          ${S.templates.map(x => `<option value="${x.id}" ${ctx.days[i] === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>`;
      }
      body += `</div><label class="field"><span>Gültig ab</span><input type="date" data-ch="wpFrom" value="${ctx.from}"></label>
        <button class="btn white block" data-act="savePlan">Wochenplan speichern</button>
        <p class="small muted">${p ? `Aktueller Plan gilt seit ${fmtLong(p.validFrom)}. ` : ''}Termine vor dem Datum bleiben unverändert. Einzeln verschobene Termine an Tagen, die es im neuen Plan nicht mehr gibt, werden zurückgesetzt.</p>`;
      return { title: 'Wochenplan', body };
    }
  });
}
function openTemplates() {
  openSheet({
    render() {
      return {
        title: 'Vorlagen',
        body: `<div class="list">${S.templates.map(t => {
          const st = tplStats(t.items, it => exById(it.exerciseId));
          return `<button class="row" data-act="editTpl" data-id="${t.id}"><span class="wc-icon" style="width:44px;height:44px;border-radius:12px;background:${hexA(t.color, .22)};color:${t.color}">${IC.dumbbell}</span>
            <span class="grow"><div class="t">${esc(t.name)}</div><div class="s">${exCount(t.items.length)} · ${st.sets} Sätze · ≈ ${st.minutes} Min</div></span>${IC.chevR}</button>`;
        }).join('')}</div><button class="btn block" data-act="newTpl">${IC.plus} Neue Vorlage</button>`
      };
    }
  });
}
function openTplEditor(id) {
  openSheet({
    full: true,
    ctx: { id },
    render({ id }) {
      const t = tplById(id);
      if (!t) return { title: '', body: '<div class="empty">Vorlage gelöscht</div>' };
      let body = `<label class="field"><span>Name</span><input data-in="tplName" value="${esc(t.name)}" maxlength="40"></label>
        <label class="field"><span>Farbe</span></label><div class="colors">${COLORS.map(c => `<button class="${c === t.color ? 'on' : ''}" style="background:${c}" data-act="tplColor" data-c="${c}" aria-label="Farbe"></button>`).join('')}</div>
        <div class="sec">Übungen</div>`;
      if (!t.items.length) body += `<div class="card empty">Noch keine Übungen. Füge Übungen aus dem Katalog hinzu.</div>`;
      else {
        body += '<div class="list">';
        t.items.forEach((it, i) => {
          const ex = exById(it.exerciseId) || { name: 'Unbekannte Übung', muscle: '', equipment: '' };
          body += `<div class="ti-item" data-ti="${it.id}">
            <div class="ti-head">${tileHtml(ex, '')}<div class="grow"><div class="t">${esc(ex.name)}</div><div class="small muted">${esc(ex.muscle)} · ${esc(ex.equipment)}</div></div></div>
            <div class="ti-ctrl"><span class="lab">Sätze</span>
              <span><span class="stepper"><button data-act="tiSets" data-d="-1">−</button><span class="v">${it.sets}</span><button data-act="tiSets" data-d="1">+</button></span></span>
              <span class="lab">Wdh-Bereich</span>
              <span class="range-in"><input inputmode="numeric" data-in="tiMin" data-ch="tiRange" value="${it.repMin}" aria-label="Minimum"><span>–</span><input inputmode="numeric" data-in="tiMax" data-ch="tiRange" value="${it.repMax}" aria-label="Maximum"></span>
              <span class="lab">Position</span>
              <span style="display:flex;gap:6px"><button class="icon-btn" data-act="tiMove" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach oben">${IC.up}</button>
                <button class="icon-btn" data-act="tiMove" data-d="1" ${i === t.items.length - 1 ? 'disabled' : ''} aria-label="Nach unten">${IC.down}</button>
                <button class="icon-btn" data-act="tiDel" style="color:var(--red)" aria-label="Entfernen">${IC.trash}</button></span></div></div>`;
        });
        body += '</div>';
      }
      body += `<button class="btn white block" data-act="tplAdd">${IC.plus} Übungen hinzufügen</button>
        <button class="btn danger block" style="margin-top:24px" data-act="tplDelete">Vorlage löschen</button>`;
      return { title: t.name || 'Vorlage', left: '<button class="sh-btn" data-act="closeSheet">Fertig</button>', body };
    }
  });
}

/* ---------- Übungsauswahl / Katalog ---------- */
function exRowsHtml(list, mode) {
  if (!list.length) return '<div class="empty">Keine Übung gefunden</div>';
  return `<div class="count">${list.length} Übungen</div><div class="list">` + list.map(e => {
    if (mode === 'pick') {
      const on = UI.pick.sel.includes(e.id);
      return `<button class="row" data-act="pickToggle" data-id="${e.id}"><span class="check${on ? ' on' : ''}">${on ? CHECK_SVG : ''}</span>
        <span class="grow"><div class="t">${esc(e.name)}</div><div class="s">${esc(e.muscle)} · ${esc(e.equipment)}</div></span></button>`;
    }
    return `<button class="row" data-act="editEx" data-id="${e.id}">${tileHtml(e)}<span class="grow"><div class="t">${esc(e.name)}</div>
      <div class="s">${esc(e.muscle)} · ${esc(e.equipment)}${e.custom ? ' · eigene' : ''}${e.weights && e.weights.length ? ' · eigene Gewichte' : ''}</div></span>${IC.chevR}</button>`;
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
        left: '<button class="sh-btn" data-act="closeSheet">Abbrechen</button>',
        right: '<button class="sh-btn" data-act="newEx">Neu</button>',
        body: `<input class="search" type="search" placeholder="Übung suchen" data-in="pickQ" value="${esc(UI.pick.q)}">
          <div class="filters">${muscleSelect('pickM', UI.pick.muscle)}${equipSelect('pickE', UI.pick.equip)}</div>
          <div id="pickList">${exRowsHtml(filterExercises(UI.pick), 'pick')}</div>`,
        foot: `<button class="btn white block" data-act="pickDone" id="pickBtn" ${UI.pick.sel.length ? '' : 'disabled'}>${pickBtnLabel()}</button>`
      };
    }
  });
}
function refreshPick() {
  const l = $('#pickList');
  if (l) l.innerHTML = exRowsHtml(filterExercises(UI.pick), 'pick');
  const b = $('#pickBtn');
  if (b) { b.textContent = pickBtnLabel(); b.disabled = !UI.pick.sel.length; }
}
function openCatalog() {
  openSheet({
    full: true,
    render() {
      return {
        title: 'Übungskatalog',
        right: '<button class="sh-btn" data-act="newEx">+ Neu</button>',
        body: `<input class="search" type="search" placeholder="Übung suchen" data-in="exQ" value="${esc(UI.ex.q)}">
          <div class="filters">${muscleSelect('exM', UI.ex.muscle)}${equipSelect('exE', UI.ex.equip)}</div>
          <div id="exList">${exRowsHtml(filterExercises(UI.ex), 'edit')}</div>`
      };
    }
  });
}
function refreshCatalog() { const l = $('#exList'); if (l) l.innerHTML = exRowsHtml(filterExercises(UI.ex), 'edit'); }
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
          <textarea data-in="exdWeights" rows="3" placeholder="Leer = Standard für ${esc(draft.equipment)}: ${esc(weightSummary(S.equipmentWeights[draft.equipment]))}">${esc(draft.weightsText)}</textarea></label>
        <p class="small muted" style="margin-top:-6px">Für Geräte, die von deinem Standard abweichen. Werte mit Semikolon trennen, z. B. 5; 10; 12,5; 15</p>
        <div class="stack"><button class="btn white block" data-act="exdSave">Speichern</button>
        ${hist.length ? `<button class="btn block" data-act="showProgress" data-id="${id}">Verlauf ansehen (${hist.length} Einheiten)</button>` : ''}
        ${id ? `<button class="btn danger block" data-act="exdHide">Übung ausblenden</button>` : ''}</div>`;
      return { title: id ? 'Übung bearbeiten' : 'Neue Übung', body };
    }
  });
}

/* ---------- Einstellungen ---------- */
function openSettings() {
  openSheet({
    full: true,
    render() {
      const hidden = S.exercises.filter(e => e.hidden).length;
      const strat = Progression.STRATEGIES[S.settings.strategy] || Progression.STRATEGIES.same;
      let body = `<div class="sec">Training</div><div class="list">
        <button class="row" data-act="weekPlan"><span class="grow"><div class="t">Wochenplan</div></span>${IC.chevR}</button>
        <button class="row" data-act="templates"><span class="grow"><div class="t">Vorlagen</div><div class="s">${S.templates.map(t => esc(t.name)).join(', ')}</div></span>${IC.chevR}</button>
        <button class="row" data-act="catalog"><span class="grow"><div class="t">Übungskatalog</div></span>${IC.chevR}</button></div>
        <div class="sec">Gewichte in deinem Gym</div><div class="list">${EQUIPMENT.map(eq => `<button class="row" data-act="editWeights" data-eq="${esc(eq)}">
          <span class="grow"><div class="t">${esc(eq)}</div><div class="s">${esc(weightSummary(S.equipmentWeights[eq]))}</div></span>${IC.chevR}</button>`).join('')}</div>
        <div class="sec">Progression</div><div class="card"><select data-ch="strategy">${Object.entries(Progression.STRATEGIES).map(([k, s]) => `<option value="${k}" ${S.settings.strategy === k ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select>
          <p class="small muted" style="margin:10px 0 0">${esc(strat.description)}</p></div>
        <div class="sec">Körpergewicht</div><div class="card"><label class="field" style="margin:0"><span>Schrittweite der +/− Tasten</span>
          <select data-ch="bwStepSel">${[0.1, 0.2, 0.5, 1].map(v => `<option value="${v}" ${S.settings.bwStep === v ? 'selected' : ''}>${fmtNum(v)} kg</option>`).join('')}</select></label></div>
        <div class="sec">Datensicherung</div><div class="card"><div class="stack">
          <button class="btn white block" data-act="exportData">Backup exportieren</button>
          <label class="btn block">Backup importieren<input type="file" accept="application/json,.json" data-ch="importFile" hidden></label></div>
          <p class="small muted" style="margin:10px 0 0">Deine Daten liegen nur auf diesem iPhone. ${S.lastExport ? `Letztes Backup: ${fmtShort(S.lastExport.slice(0, 10))}.` : 'Noch kein Backup erstellt.'}</p></div>
        <div class="sec">Speicher</div><div class="card small">${UI.persisted === true ? 'Dauerhafter Speicher ist aktiv.' : 'Dauerhafter Speicher ist nicht bestätigt. Als App auf dem Home-Bildschirm ist das Risiko gering, ein regelmäßiges Backup ist trotzdem sinnvoll.'}
          ${UI.persisted === true ? '' : '<div style="margin-top:10px"><button class="btn sm" data-act="persist">Dauerhaften Speicher anfordern</button></div>'}</div>`;
      if (hidden) body += `<button class="btn block" data-act="unhideAll" style="margin-top:12px">${hidden} ausgeblendete Übung${hidden > 1 ? 'en' : ''} wiederherstellen</button>`;
      body += `<div class="sec">App</div><div class="card small"><b>Trainingslog ${VERSION}</b><br><span class="muted">Installation: In Safari auf Teilen tippen, dann „Zum Home-Bildschirm“.</span></div>
        <button class="btn danger block" data-act="resetAll" style="margin-top:12px">Alle Daten löschen</button>`;
      return { title: 'Einstellungen', left: '<button class="sh-btn" data-act="closeSheet">Fertig</button>', body };
    }
  });
}
function openWeightsEditor(eq) {
  const draft = { text: S.equipmentWeights[eq].map(inNum).join('; '), from: '', to: '', step: '' };
  openSheet({
    ctx: { eq, draft },
    render({ eq, draft }) {
      const body = `<p class="small muted" style="margin-top:0">Alle Gewichte, die es für ${esc(eq)} in deinem Gym gibt (in kg${eq === 'Körpergewicht' ? ', als Zusatzgewicht' : ''}${eq === 'Band' ? ', als Bandstufe' : ''}).</p>
        <label class="field"><span>Gewichtsstufen</span><textarea data-in="wText" rows="5">${esc(draft.text)}</textarea></label>
        <div class="card"><div class="small" style="font-weight:700;margin-bottom:8px">Bereich erzeugen</div>
          <div class="filters" style="grid-template-columns:1fr 1fr 1fr">
            <input inputmode="decimal" placeholder="von" data-in="wFrom" value="${esc(draft.from)}">
            <input inputmode="decimal" placeholder="bis" data-in="wTo" value="${esc(draft.to)}">
            <input inputmode="decimal" placeholder="Schritt" data-in="wStep" value="${esc(draft.step)}"></div>
          <button class="btn sm block" data-act="wGenerate">Erzeugen und ersetzen</button></div>
        <div class="stack"><button class="btn white block" data-act="wSave">Speichern</button>
        <button class="btn block" data-act="wDefault">Auf Standard zurücksetzen</button></div>`;
      return { title: eq, body };
    }
  });
}

const VIEWS = { home: viewHome, training: viewTraining, stats: viewStats };

/* ---------- Aktionen ---------- */
function startOccurrence(o) {
  const run = runningSession();
  if (run && !confirm(`Es läuft bereits ein Training (${run.name}). Trotzdem ein neues starten?`)) return;
  closeAllSheets();
  UI.preview = null;
  startFromOcc(o);
}
const A = {
  tab(el) { closeAllSheets(); UI.sessionId = null; UI.preview = null; UI.tab = el.dataset.tab; render({ top: true }); },
  closeSheet() { closeSheet(); },
  settings() { openSettings(); },
  streakInfo() {
    const n = streak();
    toast(n ? `${n} Woche${n > 1 ? 'n' : ''} in Folge alle geplanten Trainings geschafft` : 'Schaffe alle geplanten Trainings einer Woche, um deinen Streak zu starten');
  },
  bwInfo() { toast('Am besten morgens nach dem Aufstehen wiegen'); },

  // Körpergewicht
  bwStep(el) {
    const t = todayISO();
    const cur = S.bodyweights[t] != null ? S.bodyweights[t] : (bwLast(t) || { kg: 75 }).kg;
    const base = S.bodyweights[t] != null ? cur + Number(el.dataset.d) * S.settings.bwStep : cur;
    S.bodyweights[t] = Math.round(base * 10) / 10;
    save(); render();
  },
  statsBw() { closeAllSheets(); UI.tab = 'stats'; UI.statTab = 'bw'; render({ top: true }); },
  bwAdd() { openBwSheet(todayISO()); },
  bwEdit(el) { openBwSheet(el.dataset.date); },
  bwSave() {
    const c = topSheet().ctx;
    const v = parseNum(c.val);
    if (!v || v < 20 || v > 400) { toast('Bitte ein gültiges Gewicht eingeben'); return; }
    if (!c.date) { toast('Bitte ein Datum wählen'); return; }
    if (c.orig && c.orig !== c.date) delete S.bodyweights[c.orig];
    S.bodyweights[c.date] = Math.round(v * 10) / 10;
    save(); closeSheet(); toast('Gewicht gespeichert');
  },
  bwDelete() { const c = topSheet().ctx; delete S.bodyweights[c.orig]; save(); closeSheet(); toast('Eintrag gelöscht'); },

  // Kalender
  calMode() { UI.calMode = UI.calMode === 'week' ? 'month' : 'week'; closeAllSheets(); render(); },
  calToday() { UI.selDay = todayISO(); closeAllSheets(); render(); },
  calShift(el) {
    const d = Number(el.dataset.d);
    if (UI.calMode === 'week') UI.selDay = addDays(UI.selDay, d * 7);
    else {
      const a = parse(UI.selDay);
      const n = new Date(a.getFullYear(), a.getMonth() + d, 1);
      const t = todayISO();
      UI.selDay = t.slice(0, 7) === iso(n).slice(0, 7) ? t : iso(n);
    }
    render();
  },
  selDay(el) { UI.selDay = el.dataset.date; render(); },
  trainMenu() { openTrainMenu(); },
  occ(el) {
    const o = findOcc(el.dataset.key, el.dataset.date);
    if (!o) return;
    if (o.sessionId) openSession(o.sessionId);
    else { UI.preview = { key: o.key, date: o.date }; render({ top: true }); }
  },
  occMenu(el) { openOccMenu(el.dataset.key, el.dataset.date); },
  preview(el) { UI.preview = { key: el.dataset.key, date: el.dataset.date }; render({ top: true }); },
  startDirect(el) { const o = findOcc(el.dataset.key, el.dataset.date); if (o) startOccurrence(o); },
  closePreview() { UI.preview = null; render({ top: true }); },
  startPreview() { const o = findOcc(UI.preview.key, UI.preview.date); if (o) startOccurrence(o); },
  editTplPreview() { const o = findOcc(UI.preview.key, UI.preview.date); if (o) openTplEditor(o.templateId); },
  exInfo(el) {
    if (exerciseHistory(el.dataset.id).length) openProgress(el.dataset.id);
    else toast('Für diese Übung gibt es noch keinen Verlauf');
  },
  moveTo(el) { const o = topSheet().ctx.o; moveOcc(o, el.dataset.date); if (UI.preview) UI.preview.date = el.dataset.date; save(); closeSheet(); toast(`Verschoben auf ${fmtDay(el.dataset.date)}`); },
  skipOcc(el) { const o = topSheet().ctx.o; setSkipped(o, el.dataset.v === '1'); save(); closeSheet(); toast(el.dataset.v === '1' ? 'Termin ausgelassen' : 'Termin wiederhergestellt'); },
  removeExtra() { const o = topSheet().ctx.o; S.extras = S.extras.filter(x => x.id !== o.extraId); UI.preview = null; save(); closeSheet(); },
  addExtra(el) {
    const date = el.dataset.date;
    openSheet({
      ctx: { date },
      render({ date }) {
        return {
          title: fmtDay(date),
          body: `<p class="small muted" style="margin-top:0">Welches Training möchtest du an diesem Tag hinzufügen?</p><div class="list">${S.templates.map(t => `<button class="row" data-act="addExtraTpl" data-id="${t.id}">
            <span class="wc-icon" style="width:44px;height:44px;border-radius:12px;background:${hexA(t.color, .22)};color:${t.color}">${IC.dumbbell}</span><span class="grow"><div class="t">${esc(t.name)}</div><div class="s">${exCount(t.items.length)}</div></span></button>`).join('')}</div>`
        };
      }
    });
  },
  addExtraTpl(el) { const date = topSheet().ctx.date; S.extras.push({ id: uid(), date, templateId: el.dataset.id }); save(); closeSheet(); toast('Training hinzugefügt'); },

  // Wochenplan & Vorlagen
  weekPlan() { openWeekPlan(); },
  templates() { openTemplates(); },
  catalog() { openCatalog(); },
  savePlan() {
    const d = topSheet().ctx;
    const from = d.from || todayISO();
    const slots = d.days.map((tid, i) => tid ? { id: `${i}-${tid}`, weekday: i, templateId: tid } : null).filter(Boolean);
    S.plans = S.plans.filter(p => p.validFrom < from);
    S.plans.push({ id: uid(), validFrom: from, slots });
    const slotIds = new Set(slots.map(s => s.id));
    for (const key of Object.keys(S.overrides)) {
      if (key.slice(0, 10) >= from && !slotIds.has(key.slice(11)) && !S.sessions.some(s => s.plannedKey === key)) delete S.overrides[key];
    }
    save(); closeSheet(); toast('Wochenplan gespeichert');
  },
  editTpl(el) { openTplEditor(el.dataset.id); },
  newTpl() {
    const t = { id: uid(), name: 'Neue Vorlage', color: COLORS[S.templates.length % COLORS.length], items: [] };
    S.templates.push(t); save(); renderSheets(); openTplEditor(t.id);
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
  tiDel(el) { const t = tplById(topSheet().ctx.id); const id = el.closest('[data-ti]').dataset.ti; t.items = t.items.filter(x => x.id !== id); save(); renderSheets(); },
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
      toast(`${exCount(ids.length)} hinzugefügt`);
    });
  },
  tplDelete() {
    const id = topSheet().ctx.id;
    const t = tplById(id);
    if (!confirm(`Vorlage „${t.name}“ wirklich löschen? Bereits absolvierte Trainings bleiben erhalten.`)) return;
    S.templates = S.templates.filter(x => x.id !== id);
    for (const p of S.plans) p.slots = p.slots.filter(s => s.templateId !== id);
    S.extras = S.extras.filter(x => x.templateId !== id || S.sessions.some(s => s.plannedKey === 'x|' + x.id));
    UI.preview = null;
    save(); closeSheet();
  },

  // Picker & Katalog
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
  pickDone() { const d = topSheet(); const ids = [...UI.pick.sel]; sheetStack.pop(); if (ids.length) d.onDone(ids); save(); renderSheets(); render(); },
  newEx() { const fromPicker = topSheet() && topSheet().onDone; openExEditor(null, fromPicker ? id => { UI.pick.sel.push(id); } : null); },
  editEx(el) { openExEditor(el.dataset.id); },
  exdSave() {
    const { id, draft, onCreated } = topSheet().ctx;
    const name = draft.name.trim();
    if (!name) { toast('Bitte einen Namen eingeben'); return; }
    const weights = parseWeightList(draft.weightsText);
    if (id) {
      const ex = exById(id);
      Object.assign(ex, { name, muscle: draft.muscle, equipment: draft.equipment });
      if (weights.length) ex.weights = weights; else delete ex.weights;
    } else {
      const ex = { id: 'u-' + uid(), name, muscle: draft.muscle, equipment: draft.equipment, custom: true };
      if (weights.length) ex.weights = weights;
      S.exercises.push(ex);
      if (onCreated) onCreated(ex.id);
    }
    save(); sheetStack.pop(); renderSheets(); refreshPick(); refreshCatalog(); render(); toast('Übung gespeichert');
  },
  exdHide() { const ex = exById(topSheet().ctx.id); ex.hidden = true; save(); closeSheet(); toast('Übung ausgeblendet'); },
  unhideAll() { S.exercises.forEach(e => delete e.hidden); save(); renderSheets(); toast('Alle Übungen wieder sichtbar'); },

  // Statistik
  statTab(el) { UI.statTab = el.dataset.t; render(); },
  showProgress(el) { openProgress(el.dataset.id); },
  metric(el) { UI.metric = el.dataset.m; renderSheets(); },

  // Einstellungen
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
    S.equipmentWeights[eq] = list; save(); closeSheet(); toast('Gewichte gespeichert');
  },
  wDefault() { const { eq, draft } = topSheet().ctx; draft.text = DEFAULT_WEIGHTS[eq].map(inNum).join('; '); renderSheets(); },
  exportData() { exportData(); },
  async persist() { UI.persisted = await DB.requestPersist(); renderSheets(); if (!UI.persisted) toast('Der Browser hat die Anfrage nicht bestätigt'); },
  async resetAll() {
    if (!confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden.')) return;
    if (!confirm('Letzte Rückfrage: Hast du ein Backup? Alle Trainings werden gelöscht.')) return;
    await DB.clear();
    S = defaultState(); await saveNow();
    UI.sessionId = null; UI.preview = null; closeAllSheets(); render({ top: true }); toast('Alle Daten gelöscht');
  },

  // Trainingsmodus
  openSession(el) { openSession(el.dataset.id); },
  closeSession() { saveNow(); UI.sessionId = null; render({ top: true }); },
  sessMenu() { openSessMenu(); },
  openSet(el) { openSetSheet(el.dataset.item); },
  selSet(el) { topSheet().ctx.active = Number(el.dataset.i); renderSheets(); },
  stp(el) {
    const c = topSheet().ctx;
    const s = getSession(UI.sessionId);
    const it = s.items.find(x => x.id === c.itemId);
    const set = it.sets[c.active];
    if (!set) return;
    const d = Number(el.dataset.d);
    if (el.dataset.f === 'reps') set.reps = Math.max(0, (set.reps ?? (d > 0 ? it.repMin - 1 : it.repMin + 1)) + d);
    if (el.dataset.f === 'rir') set.rir = set.rir == null ? (d > 0 ? 0 : 0) : Math.max(0, Math.min(10, set.rir + d));
    if (el.dataset.f === 'weight') set.weight = Progression.nextWeight(set.weight, weightsFor(exById(it.exerciseId)), d);
    set.sugg = false;
    save(); renderSheets();
  },
  saveSet() {
    const c = topSheet().ctx;
    const s = getSession(UI.sessionId);
    const it = s.items.find(x => x.id === c.itemId);
    const set = it.sets[c.active];
    const ex = exById(it.exerciseId);
    if (set.weight == null) {
      if (ex && ex.equipment === 'Körpergewicht') set.weight = 0;
      else { toast('Bitte Gewicht eintragen'); return; }
    }
    if (set.reps == null) { toast('Bitte Wiederholungen eintragen'); return; }
    const wasDone = set.done;
    set.done = true; set.sugg = false;
    const next = it.sets[c.active + 1];
    if (next && !next.done && next.weight == null) next.weight = set.weight;
    save();
    const nextOpen = it.sets.findIndex((x, i) => !x.done && i > c.active);
    const anyOpen = it.sets.findIndex(x => !x.done);
    if (wasDone) { renderSheets(); toast('Satz aktualisiert'); return; }
    if (nextOpen >= 0 || anyOpen >= 0) { c.active = nextOpen >= 0 ? nextOpen : anyOpen; renderSheets(); }
    else { closeSheet(); toast(`${ex ? ex.name : 'Übung'} erledigt`); }
  },
  unsetSet() {
    const c = topSheet().ctx;
    const it = getSession(UI.sessionId).items.find(x => x.id === c.itemId);
    it.sets[c.active].done = false; save(); renderSheets();
  },
  addSet() {
    const c = topSheet().ctx;
    const it = getSession(UI.sessionId).items.find(x => x.id === c.itemId);
    const prev = it.sets[it.sets.length - 1];
    it.sets.push(prev
      ? { weight: prev.weight, reps: prev.reps, rir: null, done: false, sugg: true, sw: prev.sw, sr: prev.sr }
      : { weight: null, reps: it.repMin, rir: null, done: false, sugg: true, sw: null, sr: it.repMin });
    c.active = it.sets.length - 1;
    save(); renderSheets();
  },
  removeSet() {
    const c = topSheet().ctx;
    const it = getSession(UI.sessionId).items.find(x => x.id === c.itemId);
    if (!it.sets.length) return;
    const last = it.sets[it.sets.length - 1];
    if (last.done && !confirm('Der letzte Satz ist bereits erledigt. Trotzdem entfernen?')) return;
    it.sets.pop();
    save(); renderSheets();
  },
  itemMenu() { openItemMenu(topSheet().ctx.itemId); },
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
    save(); closeAllSheets(); render();
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
    if (!doneSets(s)) { if (!confirm('Noch kein Satz gespeichert. Training trotzdem beenden?')) return; }
    else if (open && !confirm(`${open} Satz/Sätze sind nicht gespeichert und zählen nicht in die Historie. Trotzdem beenden?`)) return;
    s.finishedAt = Date.now();
    saveNow();
    closeAllSheets();
    UI.sessionId = null;
    render({ top: true });
    toast(`Training gespeichert: ${doneSets(s)} Sätze in ${sessionMinutes(s)} Min`);
  },
  reopenSession() { const s = getSession(UI.sessionId); s.finishedAt = null; save(); closeSheet(); },
  deleteSession() {
    if (!confirm('Dieses Training inklusive aller Sätze löschen?')) return;
    S.sessions = S.sessions.filter(s => s.id !== UI.sessionId);
    UI.sessionId = null; saveNow(); closeAllSheets(); render({ top: true }); toast('Training gelöscht');
  }
};

/* ---------- Eingaben ---------- */
function activeSet() {
  const c = topSheet().ctx;
  const it = getSession(UI.sessionId).items.find(x => x.id === c.itemId);
  return it.sets[c.active];
}
const I = {
  stReps(el) { const s = activeSet(); s.reps = parseIntOrNull(el.value); s.sugg = false; save(); },
  stWeight(el) { const s = activeSet(); s.weight = parseNum(el.value); s.sugg = false; save(); },
  stRir(el) { const s = activeSet(); s.rir = parseIntOrNull(el.value); save(); },
  bwDate(el) { topSheet().ctx.date = el.value; },
  bwVal(el) { topSheet().ctx.val = el.value; },
  tplName(el) { const t = tplById(topSheet().ctx.id); t.name = el.value; const h = $$('#sheets .sheet h3').pop(); if (h) h.textContent = el.value; save(); },
  tiMin(el) { const t = tplById(topSheet().ctx.id); const it = t.items.find(x => x.id === el.closest('[data-ti]').dataset.ti); const v = parseIntOrNull(el.value); if (v) { it.repMin = v; save(); } },
  tiMax(el) { const t = tplById(topSheet().ctx.id); const it = t.items.find(x => x.id === el.closest('[data-ti]').dataset.ti); const v = parseIntOrNull(el.value); if (v) { it.repMax = v; save(); } },
  imMin(el) { const s = getSession(UI.sessionId); const it = s.items.find(x => x.id === topSheet().ctx.itemId); const v = parseIntOrNull(el.value); if (v) { it.repMin = v; if (it.repMax < v) it.repMax = v; save(); } },
  imMax(el) { const s = getSession(UI.sessionId); const it = s.items.find(x => x.id === topSheet().ctx.itemId); const v = parseIntOrNull(el.value); if (v && v >= it.repMin) { it.repMax = v; save(); } },
  pickQ(el) { UI.pick.q = el.value; refreshPick(); },
  exQ(el) { UI.ex.q = el.value; refreshCatalog(); },
  exdName(el) { topSheet().ctx.draft.name = el.value; },
  exdWeights(el) { topSheet().ctx.draft.weightsText = el.value; },
  wText(el) { topSheet().ctx.draft.text = el.value; },
  wFrom(el) { topSheet().ctx.draft.from = el.value; },
  wTo(el) { topSheet().ctx.draft.to = el.value; },
  wStep(el) { topSheet().ctx.draft.step = el.value; }
};
const C = {
  stDone() { renderSheets(); },
  bwToday(el) {
    const v = parseNum(String(el.value).replace(/kg/i, ''));
    const t = todayISO();
    if (v == null) { delete S.bodyweights[t]; }
    else if (v < 20 || v > 400) { toast('Bitte ein gültiges Gewicht eingeben'); }
    else S.bodyweights[t] = Math.round(v * 10) / 10;
    save(); render();
  },
  wpDay(el) { topSheet().ctx.days[Number(el.dataset.i)] = el.value; },
  wpFrom(el) { topSheet().ctx.from = el.value || todayISO(); },
  moveDate(el) {
    if (!el.value) return;
    const o = topSheet().ctx.o;
    moveOcc(o, el.value);
    if (UI.preview) UI.preview.date = el.value;
    save(); closeSheet(); toast(`Verschoben auf ${fmtDay(el.value)}`);
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
  exM(el) { UI.ex.muscle = el.value; refreshCatalog(); },
  exE(el) { UI.ex.equip = el.value; refreshCatalog(); },
  exdMuscle(el) { topSheet().ctx.draft.muscle = el.value; },
  exdEquip(el) { topSheet().ctx.draft.equipment = el.value; renderSheets(); },
  strategy(el) { S.settings.strategy = el.value; save(); renderSheets(); },
  bwStepSel(el) { S.settings.bwStep = Number(el.value); save(); },
  sessDate(el) {
    if (!el.value) return;
    const s = getSession(UI.sessionId);
    s.date = el.value; save(); render(); toast(`Datum geändert auf ${fmtDay(el.value)}`);
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
        UI.sessionId = null; UI.preview = null; closeAllSheets(); render({ top: true }); toast('Backup importiert');
      } catch (e) { toast('Die Datei ist kein gültiges Trainingslog-Backup'); }
      el.value = '';
    };
    r.readAsText(f);
  }
};

async function exportData() {
  const json = JSON.stringify(S, null, 1);
  const name = `trainingslog-backup-${todayISO()}.json`;
  const file = new File([json], name, { type: 'application/json' });
  const mark = () => { S.lastExport = new Date().toISOString(); save(); render(); if (sheetStack.length) renderSheets(); };
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Trainingslog Backup' });
      mark(); return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
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
  e.stopPropagation();
  try { fn(el, e); } catch (err) { console.error(err); toast('Fehler: ' + err.message); }
});
document.addEventListener('input', e => { const el = e.target; if (el.dataset && el.dataset.in && I[el.dataset.in]) I[el.dataset.in](el, e); });
document.addEventListener('change', e => { const el = e.target; if (el.dataset && el.dataset.ch && C[el.dataset.ch]) C[el.dataset.ch](el, e); });
document.addEventListener('focusin', e => {
  const el = e.target;
  if (el.matches && el.matches('.stp input, .weigh input')) setTimeout(() => { try { el.select(); } catch (_) { /* iOS */ } }, 0);
});
// Wischen in der Wochenleiste
let touch = null;
document.addEventListener('touchstart', e => {
  if (!e.target.closest('#calbox')) { touch = null; return; }
  touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!touch) return;
  const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
  touch = null;
  if (Math.abs(dx) > 50 && Math.abs(dy) < 40) A.calShift({ dataset: { d: dx < 0 ? '1' : '-1' } });
}, { passive: true });
// Laufzeit im Training aktualisieren
setInterval(() => {
  const el = $('#elapsed');
  if (!el || !UI.sessionId) return;
  const s = getSession(UI.sessionId);
  if (s && !s.finishedAt) el.innerHTML = IC.clock + fmtElapsed(s);
}, 20000);

/* ---------- Start ---------- */
async function init() {
  let loaded = null;
  try { loaded = await DB.load(); } catch (e) { loaded = null; }
  S = loaded ? migrate(loaded) : defaultState();
  await saveNow();
  UI.selDay = todayISO();
  render({ top: true });
  DB.isPersisted().then(p => {
    UI.persisted = p;
    if (!p) return DB.requestPersist().then(r => { UI.persisted = r; });
  });
}
init();
