# MENA Compliance Frontend

Web app for the MENA compliance and third-party risk platform. Built with TanStack Start (Vite + React), TanStack Router, and TanStack Query. Users can browse companies, request compliance reports, manage requests and invoices, unlock premium fields, and message support.

## Tech Stack

- **Framework:** React 19, TanStack Start (Vite)
- **Routing:** TanStack Router (file-based)
- **Data:** TanStack Query
- **Styling:** Tailwind CSS 4, Base UI / shadcn-style components
- **Forms:** React Hook Form, Zod
- **HTTP:** Axios (with interceptors for auth and refresh)

## Prerequisites

- Node.js 18+
- Backend API running (see `backend/README.md`)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env` in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

Point `VITE_API_URL` to your backend API base URL (including `/api` if that’s your base path).

### 3. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000` by default.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run check` | Format + lint fix |

## Project Structure

```
src/
├── apis/            # API clients and React Query hooks
│   ├── auth/        # Login, refresh, register, etc.
│   ├── request/    # Axios instance, interceptors
│   ├── requests/   # Requests, request reports, invoices, messages
│   ├── company/    # Companies
│   ├── reports/    # Reports
│   ├── messages/   # Request messages
│   └── ...
├── components/      # Shared UI (layouts, headers, cards, etc.)
├── lib/             # Auth helpers, utils
├── routes/         # File-based routes (TanStack Router)
│   ├── __root.tsx
│   ├── index.tsx           # Home
│   ├── auth/               # Login, signup, verify, etc.
│   ├── _protected/         # Authenticated routes
│   │   ├── route.tsx        # Layout + auth check
│   │   ├── dashboard/
│   │   ├── requests/        # List, detail, new request
│   │   ├── companies/       # Company list, detail
│   │   └── unlocks/
│   ├── about-us.tsx
│   └── solutions.tsx
├── types/           # Shared TypeScript types
└── stores/          # Zustand (e.g. auth)
```

## Main Features

- **Auth:** Login (server action + cookies), refresh token, protected routes.
- **Dashboard:** Overview, recent requests.
- **Requests:** List, filter, create (company/individual reports), detail with timeline, reports, messages, invoice download, payment (Stripe).
- **Request reports:** Per-line status and final price; admin can update via PATCH.
- **Companies:** List, detail with locked/unlocked fields and unlock payment.
- **Unlocks:** History of unlocked fields.
- **Messages:** Per-request thread (list, send, mark read).

## Auth Flow

- Login is done via a **server action** that calls the backend and sets `accessToken` and `refreshToken` in httpOnly cookies.
- The axios instance sends cookies with `credentials: true` and uses an interceptor to refresh the access token when it expires (using the refresh token from cookies via a server action).

## Routing

- File-based routing under `src/routes`.
- `_protected` layout wraps authenticated routes and redirects to login when not authenticated.
- Route loaders use TanStack Query for data fetching where applicable.

## Styling

- Tailwind CSS 4 with `@tailwindcss/vite`.
- Utility-first; shared components in `src/components` and `src/components/ui`.

## Testing

```bash
npm run test
```

Uses Vitest and Testing Library. Add tests under `src/**/*.test.tsx` as needed.

## Linting & Formatting

- **ESLint** with TanStack config.
- **Prettier** for formatting.

```bash
npm run lint
npm run format
npm run check   # format + lint --fix
```

## Building for Production

```bash
npm run build
npm run preview   # optional: local preview of build
```

Set `VITE_API_URL` to your production API URL before building.
