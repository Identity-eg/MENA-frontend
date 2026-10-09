# Frontend Rules

## Tech Stack
- **Framework:** React 19 with Vite.
- **Routing:** TanStack Router (`@tanstack/react-router`).
- **Data Fetching & State:** TanStack Query (`@tanstack/react-query`). Use it for all server state and API interactions.
- **Styling:** Tailwind CSS v4.
- **UI Components:** Base UI (`@base-ui/react`) and shadcn/ui components.
- **Forms:** React Hook Form (`react-hook-form`) combined with Zod (`zod`) for validation.
- **Tables:** TanStack Table (`@tanstack/react-table`).
- **Icons:** Lucide React (`lucide-react`).
- **Notifications/Toasts:** Sonner (`sonner`).
- **Real-time:** Socket.IO Client (`socket.io-client`).
- **Analytics:** PostHog (`posthog-js`, `@posthog/react`).

## Architecture & Data Flow
- **API Consumption:** Use Axios (`axios`) for HTTP requests. Prefer established API utilities and patterns.
- **Business Logic:** Do not implement backend business rules in the frontend. The frontend is strictly for presentation and consuming Backend APIs.
- **State Management:** Use TanStack Query for server state. Avoid complex global client state unless necessary (prefer React Context or local state for UI state).

## Styling & UI Guidelines
- Use Tailwind CSS utility classes for styling.
- Utilize `clsx` and `tailwind-merge` for conditional class name merging.
- Use `class-variance-authority` (cva) for creating complex component variants.
- Support theming/dark mode using `next-themes`.

## Testing & Quality
- **Testing:** Focus on writing End-to-End (E2E) tests instead of isolated unit tests.
- **Linting & Formatting:** Ensure code conforms to the configured ESLint and Prettier rules. Run `npm run check` to validate.

## General Practices
- Reuse existing UI components and custom hooks before creating new abstractions.
- Keep components focused, modular, and adhering to existing project conventions.
- Avoid adding unnecessary external dependencies; prefer native solutions or existing packages from `package.json`.
