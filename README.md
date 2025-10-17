# Ecom Lab Web App

React + TypeScript + Vite implementation for an international e-commerce experience. The project ships with Ant Design, RTK Query, MSW-powered mocks, React Router, and i18next out of the box.

## Getting Started

```
# Install dependencies (requires network access)
npm install

# Start the dev server (development env + MSW mocks)
npm run dev

# Build for production
npm run build

# Run Vitest (watch / CI)
npm run test:watch
npm run test
```

## Environment Configuration

Environment variables are managed through `.env` files in the project root. Copy `.env.example` and adjust values per environment.

| File | Purpose | Key Defaults |
| --- | --- | --- |
| `.env` | Shared defaults | `VITE_APP_NAME`, `VITE_ENABLE_MSW=true` |
| `.env.development` | Dev server (`npm run dev`) | `VITE_API_BASE_URL=/api`, enables MSW worker |
| `.env.production` | Production build/preview | `VITE_API_BASE_URL=https://api.ecom-lab.com/v1`, disables MSW |
| `.env.test` | Vitest runs | `VITE_API_BASE_URL=http://localhost:4001/api`, MSW handled by node server |

> Set `VITE_ENABLE_MSW=false` in any environment to bypass the mock service worker and connect to a live backend.

## Project Structure

- `src/services/api.ts` – RTK Query service definitions and generated hooks.
- `src/mocks/` – MSW handlers + fixtures for dev/test parity.
- `src/layouts/MainLayout.tsx` – Global layout with header, footer, sidebar.
- `src/pages/` – Route-level pages (home, products, cart, account subsections).
- `src/i18n/` – i18next setup and translation resources.
- `src/store/slices/authSlice.ts` – Auth state, JWT persistence, role management.
- `src/pages/LoginPage.tsx` & `src/pages/RegisterPage.tsx` – Sign-in/up flows with tier handling.

## Testing

Vitest is configured via `vite.config.ts` with a JSDOM environment and `src/setupTests.ts` bootstraps the MSW server. Use `npm run test` for CI runs or `npm run test:watch` while developing.

## Linting & Formatting

- `npm run lint` / `npm run lint:fix`
- `npm run format`
- Husky + lint-staged are enabled after `npm run prepare` to keep commits clean.

## Authentication & Roles

- JWT-based auth with auto-refresh (access 15 min, refresh token persisted).
- Tiers: **Basic**, **VIP**, **Super VIP** – guards enforce minimum tier for protected routes (e.g., After-Sale requires VIP).
- Demo credentials (via MSW mock):
  - `jane.basic@example.com` / `Password123!`
  - `owen.vip@example.com` / `Password123!`
  - `sara.super@example.com` / `Password123!`
- Invite codes (registration): `VIP2025` upgrades to VIP, `SUPER2025` upgrades to Super VIP.
