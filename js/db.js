'use strict';
/* Lokale Speicherung: IndexedDB als Hauptspeicher, localStorage als zweite Kopie. */
const DB = (() => {
  const NAME = 'trainingslog';
  const STORE = 'kv';
  const KEY = 'state';
  const LS_KEY = 'trainingslog-backup';
  let dbPromise = null;

  function open() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  async function idbGet() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const q = tx.objectStore(STORE).get(KEY);
      q.onsuccess = () => resolve(q.result || null);
      q.onerror = () => reject(q.error);
    });
  }

  async function idbPut(data) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(data, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  function lsGet() {
    try {
      const s = localStorage.getItem(LS_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  }

  async function load() {
    let a = null;
    try { a = await idbGet(); } catch (e) { a = null; }
    const b = lsGet();
    if (a && b) return (b.savedAt || 0) > (a.savedAt || 0) ? b : a;
    return a || b;
  }

  async function save(state) {
    state.savedAt = Date.now();
    const json = JSON.stringify(state);
    try { await idbPut(JSON.parse(json)); } catch (e) { console.warn('IndexedDB-Speichern fehlgeschlagen', e); }
    try { localStorage.setItem(LS_KEY, json); } catch (e) { /* Speicher voll oder gesperrt */ }
  }

  async function clear() {
    try {
      const db = await open();
      await new Promise((resolve) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(KEY);
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch (e) { /* ignorieren */ }
    try { localStorage.removeItem(LS_KEY); } catch (e) { /* ignorieren */ }
  }

  async function requestPersist() {
    try {
      if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist();
    } catch (e) { /* ignorieren */ }
    return false;
  }

  async function isPersisted() {
    try {
      if (navigator.storage && navigator.storage.persisted) return await navigator.storage.persisted();
    } catch (e) { /* ignorieren */ }
    return false;
  }

  return { load, save, clear, requestPersist, isPersisted };
})();
