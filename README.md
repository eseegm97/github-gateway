# github-gateway

GitHub Gateway is an Angular + Express SSR app that proxies GitHub APIs and stores favorites/history in MongoDB.

## Architecture

- `src/app/components/`: standalone Angular route components.
- `src/app/models/`: frontend model contracts.
- `src/app/services/`: API/state services.
- `src/server/models/`: Mongoose models.
- `src/server/routes/`: Express API route handlers.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
copy .env.example .env
```

3. Start development runtime:

```bash
npm run dev
```

App UI is served by Angular, and API routes are under `/api`.

## Environment Variables

Defined in `.env.example`:

- `PORT`: Express server port. Default `4000`.
- `CORS_ORIGIN`: allowed browser origin. Default `http://localhost:4200`.
- `GITHUB_API_BASE_URL`: GitHub REST base URL. Default `https://api.github.com`.
- `GITHUB_TOKEN`: optional token for higher GitHub rate limits.
- `SEARCH_DEFAULT_PER_PAGE`: default search page size. Default `10`.
- `SEARCH_MAX_PER_PAGE`: hard max page size. Default `25`.
- `MONGODB_URI`: MongoDB connection string.

Validation rules:

- `PORT` must be `1-65535`.
- `SEARCH_DEFAULT_PER_PAGE` and `SEARCH_MAX_PER_PAGE` must be positive integers.
- `SEARCH_DEFAULT_PER_PAGE` cannot exceed `SEARCH_MAX_PER_PAGE`.

## Scripts

- `npm run dev`: local dev runtime.
- `npm run build`: production build.
- `npm run start:prod`: run built server from `dist/github-search/server/server.mjs`.
- `npm run test`: backend + frontend tests.
- `npm run test:backend`: Vitest server tests.
- `npm run test:frontend`: Angular Vitest runner.

## API Contracts

Base path: `/api`

### Health

- `GET /health`
  - `200`: `{ data: { status: "ok" } }`

### GitHub

- `GET /github/search?username=<query>&page=<n>&perPage=<n>`
  - `username` required for actual search; blank returns empty results.
  - `page` defaults to `1`.
  - `perPage` defaults to `SEARCH_DEFAULT_PER_PAGE`, capped at `SEARCH_MAX_PER_PAGE`.
  - `200`:

```json
{
  "data": {
    "items": [
      {
        "githubId": 1,
        "username": "octocat",
        "avatarUrl": "...",
        "profileUrl": "..."
      }
    ],
    "page": 1,
    "perPage": 10,
    "totalCount": 123,
    "hasNextPage": true
  }
}
```

- `GET /github/users/:username`
  - `200`: full profile payload.
  - `404`: `NOT_FOUND` if user does not exist.
  - `429`: `RATE_LIMITED` when GitHub limit is exhausted.
  - `502`: `UPSTREAM_FAILURE` for other GitHub upstream errors.

### Favorites

- `GET /favorites`
- `POST /favorites`
  - Required fields: `githubId`, `login`, `avatarUrl`, `profileUrl`.
  - Optional: `note`.
- `PUT /favorites/:id`
  - Supports lookup by Mongo ObjectId or login.
  - Payload: `{ "note": "..." }`.
- `DELETE /favorites/:id`

Favorite note constraints:

- max note length: `500` characters.
- over-limit values return `400 BAD_REQUEST`.

Duplicate favorites return `409 CONFLICT`.

### History

- `GET /history`
- `POST /history`
- `DELETE /history`

## Error Envelope

All API errors use:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Readable message",
    "details": {}
  }
}
```

Common codes: `BAD_REQUEST`, `NOT_FOUND`, `RATE_LIMITED`, `UPSTREAM_FAILURE`, `DATABASE_FAILURE`, `CONFLICT`, `INTERNAL_ERROR`.

## Test + Build Verification

Use these commands:

```bash
npm run test
npm run build
npm run start:prod
```

## Future Enhancements

- Per-user auth and scoped favorites/history.
- Response caching for GitHub API calls.
- Background sync/retry strategy for transient upstream failures.
- Optional server-side analytics/telemetry on search trends.
