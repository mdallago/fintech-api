# Fintech API

A minimal fintech api to create, approve and reject transactions

---

## Quick start

### Option A — Docker Compose

```bash
# Clone and enter the repo
git clone <your-repo-url>
cd fintech-api

# Start PostgreSQL + API together
docker compose up --build
```

The API will be available at `http://localhost:3000`.


## Environment variables

| Variable      | Default       | Description                   |
|---------------|---------------|-------------------------------|
| `PORT`        | `3000`        | HTTP port the server listens on |
| `DB_HOST`     | `localhost`   | PostgreSQL host               |
| `DB_PORT`     | `5432`        | PostgreSQL port               |
| `DB_NAME`     | `appdb`       | Database name                 |
| `DB_USER`     | `appuser`     | Database user                 |
| `DB_PASSWORD` | `apppassword` | Database password             |

---

## Pending

### Swagger
### Tests

## License

MIT
