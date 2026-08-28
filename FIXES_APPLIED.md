# Fixes applied

- Mounted `referenceRoutes` at `/api/references` in `server/server.js`.
- Mounted `researchPaperSubmissionRoutes` at `/api/research-paper-submissions` in `server/server.js`.
- Kept the existing Submit / Unsubmit Papers module unchanged.
- Kept the existing frontend components, CSS, forms, and visual design unchanged.
- Kept the existing conference and research-publication API routes unchanged.
- Excluded `node_modules` and `.history` from this clean source archive; run `npm install` in each app folder as needed.

## Server verification

From `server`:

```powershell
npm install
npm run dev
```

Then test:

```powershell
Invoke-WebRequest "http://localhost:5000/api/conferences/public" -UseBasicParsing
Invoke-WebRequest "http://localhost:5000/api/references/public" -UseBasicParsing
Invoke-WebRequest "http://localhost:5000/api/research-paper-submissions/test" -UseBasicParsing
Invoke-WebRequest "http://localhost:5000/api/research-publications" -UseBasicParsing
```

A successful route with an empty database may return an empty `data` array; that is not a route error.
