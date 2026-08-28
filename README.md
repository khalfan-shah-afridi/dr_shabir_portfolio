# Dr. Muhammad Shabir Afridi — Academic Portfolio & Admin CMS

React (Vite) frontend + Node.js/Express backend + MongoDB/Mongoose.

## 1. Requirements

- Node.js 18+
- A running MongoDB instance (local or Atlas)
- A Gmail account with an "App Password" for sending OTP emails (or adapt `server/utils/sendEmail.js` to another provider)

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env with your real values (see below)
npm run dev
```

Backend runs at: `http://localhost:5000`

### Required backend environment variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign access tokens |
| `EMAIL_USER` | Gmail address used to send OTP emails |
| `EMAIL_APP_PASSWORD` | Gmail App Password (not your normal password) |

Never commit a real `.env` file. Only `.env.example` should be committed.

## 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs at: `http://localhost:5173` (default Vite port)

### Required frontend environment variables (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## 4. Creating the first admin account

There is no public registration page. Create the first admin using the
existing `POST /api/auth/register` endpoint once, for example with curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Muhammad Shabir Afridi","email":"your-admin-email@example.com","password":"choose-a-strong-password"}'
```

Then log in at `http://localhost:5173/login` with that email/password.
The password is hashed with bcrypt before it is stored — it is never
kept or transmitted in plain text.

## 5. Key routes

Public:
- `/portfolio` — public portfolio
- `/login` — admin login
- `/forgot-password` — OTP-based password reset

Admin (all protected, behind the sidebar layout at `/admin/*`):
- `/admin` — dashboard
- `/admin/personal-information`, `/admin/profile`
- `/admin/education`, `/admin/skills`, `/admin/projects`, `/admin/awards`,
  `/admin/certificates`, `/admin/mission`, `/admin/vision`
- `/admin/publications`, `/admin/submit-papers`, `/admin/conferences`, `/admin/references`
- `/admin/visibility` — module + per-record visibility control
- `/admin/settings` — change email / change password (OTP protected)

## 6. Visibility system

- **Module-level**: `/admin/visibility` toggles whole sections
  (Education, Skills, Projects, Awards, Certificates, Mission, Vision,
  Personal Information, Profile, Publications, Conferences, References)
  ON/OFF. This is stored in MongoDB (`settings` collection) and enforced
  by the `/api/portfolio` endpoint — a module switched OFF is removed
  from the public API response, not just hidden in the UI.
- **Record-level**: inside each module category on `/admin/visibility`
  (or inside each module's own manager page) you can hide/show individual
  records without deleting them.

## 7. Projects module

Each project now has:
- **Project ID** — auto-generated (`PRJ-001`, `PRJ-002`, ...) if left blank
- Project Title, Description / Short Description
- **Grants**
- Status, Visibility, Featured, Display Order
- (Image URL / Document URL / Live URL have been removed)

## 8. Account security (Settings page)

- **Change Password** — requires current password, hashed with bcrypt.
- **Change Email** — requires an OTP sent to the *new* email address
  plus the current password before the change is applied.
- **Forgot Password** (from the login page) — email → OTP → new password.

OTPs expire after 10 minutes and are deleted after a single successful
use. No OTP or password is ever returned in an API response.

## 9. Notes on this environment

This project was audited and edited in a sandboxed container without
internet access, so a full `npm run build` / `vite build` could not be
executed here (the bundled `node_modules` contain platform-specific
native bindings for a different OS). Instead, every JS/JSX file was
verified with a Babel-based syntax parser and the full backend module
graph was smoke-tested by requiring `server.js` end-to-end. Please run
`npm run build` once on your own machine after `npm install` to confirm
the production build, and open an issue/regenerate if anything surfaces.

## 10. Experience module (new)

`/admin/experience` — full CRUD, "Currently Working" toggle auto-clears
End Date, visibility/featured/order controls. Public portfolio shows an
Experience section between Education and Skills.

## 11. Auto CV Generator (new)

`/admin/cv-generator` — pulls live data from Personal Information,
Profile, Education, Experience, Projects, Skills, Publications,
Certificates, Awards, Conferences and References. Admin can:

- Toggle each CV section on/off
- Reorder sections
- Edit CV title / professional summary / contact-field visibility
- See a live preview
- Download a real, multi-page A4 PDF (generated with `pdfkit`)

No CV data is hard-coded — regenerating the PDF after editing any of the
above modules immediately reflects the change.

**Note:** `pdfkit` was added to `server/package.json`. Run `npm install`
in `server/` to fetch it before starting the backend.
