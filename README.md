# bliss-and-bless

## Docker

The stack runs behind nginx on port 80:

- Next.js frontend: `http://localhost`
- Django API: `http://localhost/api/`
- Django admin/docs: `http://localhost/admin/`, `http://localhost/docs/`
- Uploaded media: `http://localhost/media/`

### Start the stack:

For production:

```bash
docker compose up --build
```

For development with hot reload:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

The SQLite database is stored in `backend/data/db.sqlite3`. The database directory is
created automatically, including on a fresh checkout, so Docker will create the
SQLite file rather than replacing `backend/db.sqlite3` with a directory.

Django static assets are collected into `backend/staticfiles/` and served directly
by nginx at `/static/`.
