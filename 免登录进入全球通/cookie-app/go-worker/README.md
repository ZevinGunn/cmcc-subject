# Go Worker

This service runs batch tasks (refresh cookies / refresh tokens) with
concurrency and rate limits to reduce upstream risk.

## Run

```bash
cd cookie-app/go-worker
go run .
```

## Env

- `NODE_API_BASE` (default: `http://127.0.0.1:8002`)
- `ADMIN_KEY` (required if the Node API is protected)
- `WORKER_BIND` (default: `127.0.0.1:9011`)
- `WORKER_CONCURRENCY` (default: `4`)
- `WORKER_RATE_LIMIT_MS` (default: `0`, no delay)
- `WORKER_TIMEOUT_MS` (default: `15000`)
- `WORKER_KEY` (optional shared key; if set, client must send `X-Worker-Key`)

## Endpoints

- `POST /worker/refresh-cookies`
- `POST /worker/refresh-tokens`
- `POST /worker/refresh-cookies-then-tokens`

Request body (optional):

```json
{ "accountIds": ["id1", "id2"] }
```
