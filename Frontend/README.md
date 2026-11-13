# WebMind frontend

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 3, and Zustand. The Express API remains in `../Backend`.

## Local setup

Use Node.js 20.9+ (Node.js 24 LTS recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`, and `Copy-Item .env.example .env.local` to create the environment file.

The frontend runs at http://localhost:3000. Start Express separately on port 8000. Set the backend's `FRONTEND_URL=http://localhost:3000` so Google OAuth and checkout return to the frontend. Keep backend API keys in the backend environment; `NEXT_PUBLIC_*` variables are public.

Set `NEXT_PUBLIC_API_URL` to the backend origin or its `/api/v1` URL. `NEXT_PUBLIC_BACKEND_URL` is also accepted as a fallback. All API calls use the same normalized URL. Replace previous `VITE_API_URL` / `VITE_BACKEND_URL` deployment variables; Next.js reads public variables when building, so rebuild after changing them.

## Commands

```sh
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
npm run test:e2e
```

The browser suite runs against a production build and intercepts API requests with deterministic fixtures. Run `npx playwright install chromium` once before testing. It checks migration behavior without real credentials, AI usage, or payment transactions. Google OAuth, live AI responses, PDF processing, and billing still need a configured backend and provider credentials for live verification.

## Structure and behavior

- `src/app`: file-based routes, server metadata, root layout, error and not-found pages.
- `src/views`: existing interactive page UI. This avoids accidentally registering a second Pages Router.
- `src/app/providers.tsx`: client session initialization, OAuth token handoff, user loading, toast notifications, and analytics.
- `src/components/auth/RequireAuth.tsx`: waits for persisted state before redirecting signed-out users. Express continues to enforce API authorization.
- `src/config.ts`: shared API URL configuration.

Existing paths are preserved: `/`, `/pricing`, `/signin`, `/signup`, `/dashboard`, `/setting`, `/chat`, `/chat/[id]`, `/payment-success`, and `/payment-cancel`. Private pages are marked `noindex`. Landing, pricing, and authentication pages are prerendered with metadata. Saved sessions and theme preferences are restored after hydration.

## Deployment

On Vercel, set the project root to `Frontend`, select Next.js, and use the default build/output settings. Remove any dashboard-level Vite/dist overrides or SPA catch-all rewrites. The repository's old SPA rewrite file has been removed. Configure the public API URL before building and set the Express `FRONTEND_URL` to the deployed frontend origin. Allow that frontend origin in backend CORS if using a custom domain.
