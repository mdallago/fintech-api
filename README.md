# Fintech API

A minimal fintech api to create, approve and reject transactions

---

## Quick start

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

## Swagger

http://localhost:3000/api-docs/

## Tests

```bash
# Start DB
docker compose up postgres

# Run tests
npm run test
```

### Test Cases (Some are pending)
 - Create a transaction with a non existing origin user
 - Create a transaction with a non existing target user
 - Create a transaction with an amount greater than the balance
 - Create two concurrent transactions for the same user
 - Auto approve
 - Manual approval
 - Reject transaction
 - Request with missing mandatory fields
 - Reject a non pending transaction
 - Approve a non pending transaction
 - Get transactions will not include other users transactions

## Pending

 - Add pagination in GET Transaction endpoint
 - Move business logic to a service layer
 - Move magic number to a config file or environment variable
 - Specify columns explicitly in SELECT queries
 - Return updated transaction in approveTransaction function
 - Add more test cases

## License

MIT
