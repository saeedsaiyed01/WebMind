# React/Vite to Next.js migration

## Plan and implementation

1. Preserve the existing URLs and UI, adopt the App Router, and keep the Express API separate.
2. Move page components into `src/views`; add explicit `src/app` routes with server-rendered metadata. Replace React Router navigation with Next.js navigation and links.
3. Restore Zustand only after hydration; initialize OAuth tokens and fetch user details centrally. Redirect unauthenticated users after session initialization and return login to the requested route.
4. Normalize the public backend URL once and use it for authentication, content, conversations, models, chat, credits, and checkout. Support both an origin and a URL ending in `/api/v1`.
5. Replace Vite scripts/configuration, update React, remove the SPA rewrite, preserve Tailwind styling and saved themes, and document deployment settings.
6. Validate the production build, TypeScript, ESLint, desktop/mobile browser behavior, and the existing backend OAuth tests.

## Verification

The browser suite uses intercepted API responses. It exercises public metadata and 404s, protected deep links, signin and signup, OAuth handoff, refresh/session persistence, expired credentials, streamed chat routing, content creation/editing/deletion, theme persistence, mobile layout, and checkout return routes. It fails on uncaught browser errors and React hydration errors.

The Express OAuth suite checks signed state, mobile handoffs, invalid/expired exchanges, Google denial, and the existing web callback.

Run `npm run lint`, `npm run typecheck`, and `npm run test:e2e` in `Frontend`; run `npm test` in `Backend` after installing its dependencies.

## Remaining live verification

Use a configured backend to verify real Google OAuth, MongoDB persistence, AI providers, document upload/processing, and Dodo checkout/webhooks. Mocked browser tests do not validate those external systems. The migration preserves the existing billing confirmation behavior; it does not redesign payment verification.

Frontend production dependencies pass `npm audit --omit=dev`. The full audit still reports moderate vulnerabilities in the development ESLint/minimatch dependency chain. No forced major-version dependency changes were applied.

The existing backend lockfile lacks some optional platform packages under the current npm version, so `npm ci` currently rejects it. Backend OAuth tests were run after installing dependencies with `npm install --ignore-scripts --package-lock=false --omit=optional`; the backend lockfile was left unchanged. For normal backend development, use the documented `npm install` so native dependencies can run their installation scripts.
