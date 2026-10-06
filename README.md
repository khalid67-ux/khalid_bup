# Tender Package Builder — AI DevFest

Frontend-only implementation of the AI DevFest Tender Document Package Builder problem.

## Run

No backend and no build step are required.

1. Open `index.html` in the latest Google Chrome.
2. Load the provided `requirements.json`.
3. Upload the PDF documents.
4. Match each PDF to at most one requirement.
5. Enter expiry dates where required.
6. Resolve all blocking statuses.
7. Click **Generate package**.
8. The browser downloads `<tender_id>_Package.pdf`.

For GitHub Pages, upload the project to a public repository and enable Pages from the repository's deployment settings.

## Core requirements implemented

- Dynamic `requirements.json` loading.
- Tender metadata and ordered requirements.
- Multiple PDF upload with PDF-only validation.
- 30-file and 50 MB total limit.
- Browser-side PDF page counting.
- File removal.
- One-to-one requirement/file matching.
- Change/undo matching.
- Expiry-date entry.
- Missing / Expiry date needed / Expired / Not provided / OK statuses.
- Same-day expiry as submission deadline is valid.
- SHA-256 content duplicate detection.
- Duplicate file protection across requirements.
- Generate button blocked by any blocking status.
- Cover page with required tender details and included document list.
- Documents appended in requirement order with all source pages.
- Footer on every package page: `<tender_id> | Page X of Y`.
- Footer reserved area prevents it from covering imported page content.
- Correct download filename.
- English/Bangla UI and document titles using `title_en` / `title_bn`.
- CSV checklist export.
- Local metadata save/restore.
- Damaged/password-protected PDFs fail safely with a clear message.
- Auto-match is included as a future-ready architecture point; manual matching remains deterministic.

## Libraries

- PDF.js — page counting and PDF validation.
- pdf-lib — browser-side PDF creation, copying pages and footer generation.

No tender document is sent to a participant-controlled backend.

## Important contest workflow

Keep the Git history compliant with the official rules: at least 3 commits, at least one commit every 30 minutes, and commit messages should state the change plus the AI prompt used (or `Manual edit` when applicable).

## Sample local requirements

`sample-requirements.json` is included for UI testing. The official provided `requirements.json` should be used for the contest's final sample-pack output.
