# Hydri — Your Caring Health Companion

A premium desktop hydration companion built with Electron, React 19, and SQLite. Hydri walks onto
your desktop with gentle reminders, celebrates every glass of water with you, and keeps a friendly
record of your streaks and achievements — fully offline.

## Status: MVP

This is the first build pass. Included: the reminder engine, the animated SVG companion, local
SQLite storage, a tray icon, a basic dashboard, and a settings screen. Deferred to later passes
(see `Explicitly deferred` in the project plan): the full achievement catalog, monthly detail
charts, a reminder history log view, live reminder-position/character-size effects, real
audio/voice playback, a connected GitHub release feed for auto-updates, and a polished installer
with custom welcome/license art.

## Getting started

```bash
npm install
npm run generate-icons   # builds build/icon.ico from build/icon-source.png
npm run dev              # launches Electron + Vite in dev mode
```

## Building an installer

```bash
npm run build
npm run dist
```

`npm run dist` uses `electron-builder` with the config in `package.json`. Before publishing
releases, replace the placeholder `owner`/`repo` in the `build.publish` section with your real
GitHub repository so `electron-updater` can find releases.

## Architecture

- `electron/` — main process: window management, tray, SQLite (`better-sqlite3`), settings
  (`electron-store`), the reminder scheduler, and IPC handlers.
- `src/` — React 19 renderer: Dashboard, Settings, and the transparent Companion overlay window,
  all sharing one `HashRouter`-based app bundle.
- Reminder history is tagged with a `reminder_type` column (`water` today) so future reminder
  types (eye breaks, stretches, medication, etc.) can be added without a schema rewrite.

## Data storage

- SQLite database: `%APPDATA%/Hydri/hydri.db` (water intake, reminder history, streaks,
  achievements).
- Preferences: managed by `electron-store` in the same user data directory.
