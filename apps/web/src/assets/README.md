# Static assets (Firebase Storage)

Large files (PDFs, portraits, cover art) are served from Firebase Storage:

`gs://annual-report-hpl.firebasestorage.app/assets/`

Upload or refresh:

```bash
npm run storage:upload
firebase deploy --only storage
```

URLs are defined in `apps/web/src/config/storageAssets.ts`.
