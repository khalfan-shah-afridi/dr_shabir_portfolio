# Documents Vault Update

Implemented a protected admin-only Documents Vault.

## Document types

1. 10th / Matric
2. 12th / Intermediate
3. B.Ed.
4. BS
5. Master
6. MPhil
7. PhD
8. Postdoc
9. CNIC
10. Passport
11. Other

## Security

- All document routes require the existing JWT authentication middleware.
- PDFs are stored under `server/uploads/documents` and are not exposed with Express static hosting.
- Downloads are served through an authenticated route.
- Documents are not included in the public `/api/portfolio` response.
- `fileUrl` is intentionally not stored.

## Admin route

`/admin/documents`

Supports add/edit/delete/hide/show/download, search, filtering by document type, and PDF replacement.

## MongoDB

The Mongoose `Document` model uses the `documents` collection. Existing sample documents do not need to be converted. New B.Ed. and Postdoc documents can be created from the admin panel.
