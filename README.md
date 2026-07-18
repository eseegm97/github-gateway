# github-gateway

GitHub Gateway is an Angular + Express SSR app that proxies GitHub APIs and stores favorites/history in MongoDB.

## Quick Start

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

The UI runs at `http://localhost:4200` and API routes are under `/api`.

## Environment

Set these in `.env`:

- `PORT` (default: `4000`)
- `CORS_ORIGIN` (default: `http://localhost:4200`)
- `GITHUB_API_BASE_URL` (default: `https://api.github.com`)
- `GITHUB_TOKEN` (optional)
- `SEARCH_DEFAULT_PER_PAGE` (default: `10`)
- `SEARCH_MAX_PER_PAGE` (default: `25`)
- `MONGODB_URI`

## Scripts

- `npm run dev` - run the app locally
- `npm run build` - create production build
- `npm run start:prod` - start production server
- `npm run test` - run backend and frontend tests

## API Summary

Base path: `/api`

- `GET /health`
- `GET /github/search`
- `GET /github/users/:username`
- `GET /favorites`
- `POST /favorites`
- `PUT /favorites/:id`
- `DELETE /favorites/:id`
- `GET /history`
- `POST /history`
- `DELETE /history`

## Verify

```bash
npm run test
npm run build
npm run start:prod
```
