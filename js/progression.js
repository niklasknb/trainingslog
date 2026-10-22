'use strict';
/* Progressionslogik als austauschbares Modul.
   Jede Strategie bekommt den Kontext (letzte Leistung, Zielbereich, verfügbare Gewichte)
   und liefert pro Satz einen Vorschlag {weight, reps}. Neue Strategien (z. B. Double
   Progression oder RIR-basiert) werden einfach in STRATEGIES ergänzt. */
const Progression = (() => {

  function snap(weight, list) {
    if (weight == null || !list || !list.length) return weight;
    let best = list[0];
    for (const w of list) if (Math.abs(w - weight) < Math.abs(best - weight)) best = w;
    return best;
  }

  function nextWeight(current, list, dir) {
    if (!list || !list.length) {
      const base = current == null ? 0 : current;
      return Math.max(0, Math.round((base + dir * 2.5) * 100) / 100);
    }
    const sorted = [...list].sort((a, b) => a - b);
    if (current == null) return dir > 0 ? sorted[0] : sorted[0];
    if (dir > 0) {
      const n = sorted.find(w => w > current + 1e-9);
      return n == null ? sorted[sorted.length - 1] : n;
    }
    for (let i = sorted.length - 1; i >= 0; i--) if (sorted[i] < current - 1e-9) return sorted[i];
    return sorted[0];
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  /* Letzte abgeschlossene Einheit mit mindestens einem erledigten Satz dieser Übung. */
  function lastPerformance(state, exerciseId, excludeSessionId, beforeDate) {
    let best = null;
    for (const s of state.sessions) {
      if (s.id === excludeSessionId || !s.finishedAt) continue;
      if (beforeDate && s.date > beforeDate) continue;
      for (const it of s.items) {
        if (it.exerciseId !== exerciseId) continue;
        const sets = it.sets.filter(x => x.done && x.reps != null);
        if (!sets.length) continue;
        const sortKey = s.date + '|' + s.finishedAt;
        if (!best || sortKey > best.sortKey) best = { sortKey, date: s.date, sessionId: s.id, sets };
      }
    }
    return best;
  }

  const STRATEGIES = {
    same: {
      label: 'Gleiches Gewicht wie letztes Mal',
      description: 'Schlägt pro Satz das Gewicht und die Wiederholungen der letzten Einheit vor. Die Wiederholungen werden dabei in deinen Zielbereich gelegt. Ohne Historie gibst du das Startgewicht selbst ein, Ziel ist die untere Grenze.',
      suggest(ctx) {
        const out = [];
        for (let i = 0; i < ctx.setCount; i++) {
          if (!ctx.last) { out.push({ weight: null, reps: ctx.repMin }); continue; }
          const ref = ctx.last.sets[i] || ctx.last.sets[ctx.last.sets.length - 1];
          out.push({
            weight: snap(ref.weight, ctx.weights),
            reps: clamp(ref.reps, ctx.repMin, ctx.repMax)
          });
        }
        return out;
      }
    }
  };

  function suggest(state, opts) {
    const strategy = STRATEGIES[state.settings.strategy] || STRATEGIES.same;
    const last = lastPerformance(state, opts.exerciseId, opts.excludeSessionId, opts.beforeDate);
    const sets = strategy.suggest({
      last,
      setCount: opts.setCount,
      repMin: opts.repMin,
      repMax: opts.repMax,
      weights: opts.weights
    });
    return { last, sets };
  }

  function e1rm(weight, reps, rir) {
    if (!weight || !reps) return 0;
    return weight * (1 + (reps + (rir || 0)) / 30);
  }

  return { STRATEGIES, suggest, lastPerformance, snap, nextWeight, e1rm };
})();
