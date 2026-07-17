# github-search

Angular SSR + Express backend runtime for the GitHub Gateway application.

## Dev and Build

- `npm run dev` - Angular dev server with integrated Express API.
- `npm run build` - Production build for browser and server bundles.
- `npm run start:prod` - Start production server from `dist/github-search/server/server.mjs`.

## Test Commands

- `npm run test:frontend` - Frontend tests using `ng test --watch=false`.
- `npm run test:backend` - Backend Vitest suite in `src/server/tests`.

## App Architecture

- `src/app/components` - SPA components used directly by Angular routes.
- `src/app/models` - Client-side model types.

## Server Architecture

- `src/server/env.ts` - Runtime environment loading and contract validation.
- `src/server/models` - Shared server-side data shapes.
- `src/server/routes` - API route composition and handlers.
- `src/server/tests` - Backend unit tests.

## Environment Variables

Copy `.env.example` to `.env` and set values:

- `PORT`
- `CORS_ORIGIN`
- `GITHUB_API_BASE_URL`
- `GITHUB_TOKEN`
- `MONGODB_URI`
