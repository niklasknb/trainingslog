# Trainingslog

Progressive Web App zum Planen und Tracken von Gym-Training (Push/Pull), komplett offline, Daten lokal auf dem Gerät.

## Struktur

- `index.html` – App-Rahmen
- `styles.css` – Design (schwarzes Kartendesign)
- `js/catalog.js` – Übungskatalog (200 Übungen) und Standard-Gewichtsstufen
- `js/db.js` – Speicherung (IndexedDB + localStorage-Kopie)
- `js/progression.js` – Vorschlagslogik, austauschbar über `STRATEGIES`
- `js/core.js` – Datenmodell, Kalender- und Trainingslogik
- `js/ui.js` – Oberfläche (Dashboard, Training, Statistiken)
- `fonts/` – Schrift Montserrat (SIL Open Font License)
- `sw.js`, `manifest.webmanifest`, `icons/` – Offline-Fähigkeit und Installation

## Veröffentlichen über GitHub Pages

1. Neues öffentliches Repository auf github.com anlegen, z. B. `trainingslog`
2. Alle Dateien dieses Ordners hochladen („Add file“ → „Upload files“)
3. Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`
4. Nach ca. 1 Minute ist die App unter `https://<benutzername>.github.io/trainingslog/` erreichbar
5. Auf dem iPhone in Safari öffnen → Teilen → „Zum Home-Bildschirm“

## Updates

Bei jeder Änderung in `sw.js` die Versionsnummer in `CACHE` erhöhen, damit das iPhone die neue Version lädt (App einmal schließen und neu öffnen).
