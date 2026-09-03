# Hotel Management System — Angular Frontend

Angular 17 standalone SPA for the Hotel Management Web API, featuring JWT authentication, CQRS-based backend integration, and real-time updates with SignalR.

## Prerequisites

* Node.js 18+
* npm
* ASP.NET Core Web API running
* Default API URL: `https://localhost:5188`

## Quick Start

Install the frontend dependencies and start the development server:

```bash
npm install
npm start
```

The application will be available at:

`http://localhost:4200`

## API Configuration

The frontend communicates with the ASP.NET Core API and SignalR hub through the environment configuration.

Edit:

```text
src/environments/environment.ts
```

Example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5188/api',
  signalRHubUrl: 'https://localhost:5188/hubs/hotel'
};
```

### Configuration Properties

* **`apiUrl`** — Base URL for the REST API. Services use this URL for endpoints such as `/auth`, `/rooms`, and `/reservations`.
* **`signalRHubUrl`** — URL of the SignalR hub used for real-time updates. The JWT access token is provided through SignalR's `accessTokenFactory`.

For production builds, update:

```text
src/environments/environment.prod.ts
```

The production environment is used when running:

```bash
npm run build
```

> If your API uses a different port or HTTP instead of HTTPS, update both `apiUrl` and `signalRHubUrl` accordingly.

Make sure the ASP.NET Core API allows CORS requests from:

```text
http://localhost:4200
```

## Features

| Module         | Routes                                                     |
| -------------- | ---------------------------------------------------------- |
| Authentication | `/login`, `/register`                                      |
| Dashboard      | `/dashboard`                                               |
| Rooms          | `/rooms`, `/rooms/new`, `/rooms/:id/edit`, `/rooms/search` |
| Reservations   | `/reservations`, `/reservations/new`, `/reservations/:id`  |
| Audit Logs     | `/audit-logs`                                              |
| Reports        | `/reports`                                                 |

### Dashboard

The dashboard provides:

* Occupancy summary
* Recent reservations
* Real-time SignalR notifications

### Reservations

The reservation module supports:

* Creating reservations
* Viewing reservations
* Searching reservations
* Cancelling reservations
* Real-time updates

### Rooms

The room module supports:

* Listing rooms
* Creating rooms
* Updating rooms
* Searching rooms
* Viewing available rooms

### Reports

The reports module provides:

* Top rooms
* Revenue information
* Occupancy statistics

## Real-Time Updates with SignalR

SignalR provides real-time updates without requiring a full page refresh.

### Verify SignalR Live Updates

You can test real-time updates using two browser windows.

1. Start the ASP.NET Core API.
2. Start the Angular frontend:

```bash
npm start
```

3. Open **Window A** and log in as User A.
4. Navigate to **Dashboard** or **Reservations**.
5. Open **Window B** using another browser or an incognito window.
6. Log in as User B, or use the same user.
7. From Window B, create or cancel a reservation, or update a room.
8. Check Window A.

Window A should receive a real-time notification and refresh the relevant data without a full page reload.

The SignalR hub listens for:

* `reservationCreated`
* `reservationCancelled`
* `roomUpdated`

SignalR connects automatically after login and disconnects when the user logs out.

## Project Structure

```text
src/app/
├── core/
│   ├── guards/
│   │   └── Route guards (auth, guest)
│   ├── interceptors/
│   │   └── HTTP interceptors (JWT token)
│   ├── models/
│   │   └── TypeScript interfaces and types
│   └── services/
│       └── API services
│
├── features/
│   ├── auth/
│   │   └── Login and Register
│   ├── dashboard/
│   │   └── Dashboard and occupancy summary
│   ├── rooms/
│   │   └── Room list, form, and search
│   ├── reservations/
│   │   └── Reservation list, form, and details
│   ├── audit-logs/
│   │   └── Audit log viewer
│   └── reports/
│       └── Reports and statistics
│
├── shared/
│   ├── components/
│   │   └── Confirm dialog, toast, loading spinner
│   ├── utils/
│   │   └── Shared utility functions
│   └── validators/
│       └── Custom form validators
│
└── layout/
    └── Authenticated application shell
```

## Tech Stack

* **Angular 17** — Standalone components
* **TypeScript**
* **Bootstrap 5**
* **Bootstrap Icons**
* **Reactive Forms**
* **RxJS**
* **Functional Route Guards**
* **HTTP Interceptors**
* **ASP.NET Core Web API**
* **JWT Authentication**
* **MediatR / CQRS**
* **SignalR** — Real-time updates

## Build

To create a production build:

```bash
npm run build
```

The compiled application will be generated in:

```text
dist/frontend/
```

## Development

Start the Angular development server:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

Make sure the ASP.NET Core API is running before using features that require backend communication.

## Troubleshooting

### API connection errors

If the frontend cannot connect to the API, check:

1. The ASP.NET Core API is running.
2. `apiUrl` matches the API's actual URL and port.
3. `signalRHubUrl` matches the SignalR hub URL.
4. CORS allows requests from `http://localhost:4200`.
5. If using HTTPS locally, make sure the ASP.NET Core development certificate is trusted.

### SignalR connection errors

Check:

* The API is running.
* The SignalR hub URL is correct.
* JWT authentication is working.
* The API allows the Angular application's origin through CORS.

