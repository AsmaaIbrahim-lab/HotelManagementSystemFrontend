# Hotel Management System — Angular Frontend

Angular 17 standalone SPA for the Hotel Management Web API (JWT auth, CQRS, SignalR).

## Prerequisites

- Node.js 18+
- npm
- ASP.NET Core API running (default: `https://localhost:5188`)

## Quick Start

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Pointing at Your API

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5188/api',
  signalRHubUrl: 'http://localhost:5188/hubs/hotel'
};
```

- **apiUrl** — REST base path (all services call `/auth`, `/rooms`, `/reservations`, etc. under this URL).
- **signalRHubUrl** — SignalR hub URL; JWT is sent via `accessTokenFactory` on connect.

For production builds, update `src/environments/environment.prod.ts` (used when running `ng build`).

If the API uses a different port or HTTP instead of HTTPS, change both values accordingly. Ensure the API allows CORS from `http://localhost:4200`.

## Features

| Module | Routes |
|--------|--------|
| Auth | `/login`, `/register` |
| Dashboard | `/dashboard` — occupancy summary, recent reservations, live SignalR toasts |
| Rooms | `/rooms`, `/rooms/new`, `/rooms/:id/edit`, `/rooms/search` |
| Reservations | `/reservations`, `/reservations/new`, `/reservations/:id` |
| Audit Logs | `/audit-logs` |
| Reports | `/reports` — top rooms, revenue, occupancy |

## Verify SignalR Live Updates (Two Browser Windows)

1. Start the API and frontend (`npm start`).
2. Open **Window A** — log in as User A, go to **Dashboard** or **Reservations**.
3. Open **Window B** (incognito or another browser) — log in as User B (or same user).
4. In Window B, create or cancel a reservation, or edit a room.
5. In Window A you should see:
   - A toast notification (e.g. “New reservation for …”)
   - Dashboard/reservation/room lists refresh without a full page reload

SignalR connects automatically after login and disconnects on logout. The hub listens for `reservationCreated`, `reservationCancelled`, and `roomUpdated`.

## Project Structure

```
src/app/
  core/           guards, interceptors, services, models
  features/       auth, dashboard, rooms, reservations, audit-logs, reports
  shared/         confirm dialog, toast, loading spinner, validators
  layout/         authenticated shell (nav + router-outlet)
```

## Tech Stack

- Angular 17 (standalone components)
- Bootstrap 5 + Bootstrap Icons
- Reactive Forms, RxJS, functional route guards & HTTP interceptor
- `@microsoft/signalr` for real-time updates

## Build

```bash
npm run build
```

Output: `dist/frontend/`
