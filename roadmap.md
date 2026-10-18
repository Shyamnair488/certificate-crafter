# Platepress roadmap

- [x] Engine: rendering, fonts, export (PDF/PNG/JPEG, ZIP, merged PDF), email
- [x] Studio UI: template, fields, recipients, export, email panels
- [x] Guide page + 404/error screens
- [x] Fix TypeScript build errors
- [x] Complete redesign: navy corporate palette, Libre Baskerville + IBM Plex Sans, sidebar layout
- [x] Final end-to-end test pass after redesign (sample load, all steps, ZIP download, guide, no console errors)

## New feature round

- [x] Certificate dashboard with batch history + generated/sent/failed/verified stats
- [x] Visual editor: drag-and-drop logos, signatures, QR codes alongside text fields
- [x] Signature library: save multiple signatures, auto-place on batches
- [x] Duplicate & error detection for imported CSV/Excel data
- [x] Long-name testing (short/medium/long) with overflow + overlap detection
- [x] Email delivery tracking with retry of failed recipients
- [x] Batch progress: completed / failed / remaining + cancel
- [x] Test all of the above end to end

## Review feedback (Oct 17)
- [x] Save/load project as JSON file
- [x] Email safeguards: validation, status table + retry, throttle delay, limit warning
- [x] Case-insensitive/trimmed column matching on import
- [x] Recipient stepper in preview
- [x] noscript message

## Completion and installation repair (Oct 18)
- [ ] Regenerate the out-of-sync npm lockfile and verify a clean dependency installation
- [ ] Fix remaining concrete workflow defects and inconsistent step headings
- [ ] Verify certificate exports, project save/open, validation, and narrow-screen controls
- [ ] Review final application errors and document deployment limitations
