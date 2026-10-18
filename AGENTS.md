# Architecture rules

- Keep certificate rendering, file import/export, and email requests browser-side; the studio is intentionally account-free and database-free.
- Validate saved project files through the shared project schema before mutating studio state; malformed files must not replace working projects.
- Track delivery counts on the originating batch and derive dashboard totals from batch records, never by adding the current delivery list again.
- Keep npm's lockfile synchronized with the package manifest and verify clean installs in isolated staging so the live preview dependencies remain intact.