
# Event Ticket Booking System

A small Node.js/Express project that implements an event ticket booking flow with persistent bookings, a waitlist, and audit logging.

This repository contains a test-suite (Jest + supertest) that exercises the booking/cancel/waitlist behavior. The test-suite is configured to run with an in-memory SQLite database when `NODE_ENV=test`, so you can run tests locally without Docker.


Quick local developer guide

# Event Ticket Booking System

This is my implementation of a small event ticket booking service built with Node.js, Express and Sequelize. It was developed to meet the assessment requirements and the optional audit bonus.

I focused on correctness, clear APIs, and a short test-suite so a reviewer can quickly validate functionality locally.

What you'll find in this repository

- A minimal Express API implementing booking, waitlisting and cancellation.
- Sequelize models: `Event`, `Booking`, `WaitingList` (legacy), and `Order` (audit records).
- A test-suite (Jest + supertest) that runs against an in-memory SQLite DB for fast, deterministic tests.
- A Postman collection (`postman_collection.json`) with example requests and environment variables for a quick demo.

Implemented features (summary)

- Create / initialize an event (admin-protected) with a total ticket count.
- Book a ticket using `userEmail` or `userId`. If the event is sold out, the user joins the waitlist.
- Cancel a booking. When a seat opens the earliest waitlisted user is automatically assigned.
- Audit logging: the `Order` model records book/waitlist/cancel/assign actions.
- Concurrency-safety: booking uses an atomic DB update so concurrent requests cannot oversell.
- Rate limiting and request validation to match the test-suite expectations.

Quick start (local)

Prerequisites

- Node.js 18+ and npm

Install and run tests

```bash
npm install
npm test
```

Run the server (development)

1. Optionally add a `.env` file in the project root with your Postgres connection settings. If you leave it out the app will use the default development config.
2. Start the app:

```bash
npm start
```

By default the app listens on port 3000.

API (short reference)

All endpoints are mounted under `/api/events`.

- POST /api/events/initialize
	- Admin-protected (Basic auth). Default admin credentials: `admin:password123`. The admin password can be set via `ADMIN_TOKEN` env var.
	- Payload: { title, venue, date, totalTickets } (optional `id` for fixed id in demos/tests)
	- Response: event object (includes `available` alias for `availableTickets`).

- POST /api/events/book
	- Payload: { eventId, userEmail } or { eventId, userId }
	- Success: { status: 'booked', booking }
	- If sold out: { status: 'waitlisted', waiting }

- POST /api/events/cancel
	- Payload: { eventId, userEmail } or { eventId, userId }
	- If a waitlist user is assigned: { assignedTo, booking }
	- Otherwise: { freed: true }

- GET /api/events/status/:eventId
	- Returns a summary including `bookingsCount` and `waitingCount`.

Postman collection

Import `postman_collection.json` (included at the repo root). The collection contains helpful variables:

- `baseUrl` (default `http://localhost:3000`)
- `adminUser`, `adminPass`, and `authHeader`
- `exampleEventId` and `exampleUserEmail` placeholders you can set after creating an event

Suggested reviewer flow

1. Start the server locally: `npm start`.
2. Import the Postman collection.
3. Use the Create Event request (it uses Basic auth); copy the returned event `id` into `exampleEventId`.
4. Use Book and Cancel requests to exercise normal and waitlist flows.

Assessment checklist (what I implemented)

- Initialize / reset event endpoint (admin) — Done
- Ticket booking (accepts `userId` or `userEmail`) — Done
- Waitlist behavior and position preservation — Done
- Cancel assigns next waitlist member — Done
- Audit log (`Order` model records book/waitlist/cancel/assign) — Done
- Validation and proper error responses (400/404) — Done
- Rate limiting for public routes — Done
- Concurrency-safe booking (atomic update) — Done

Bonus implemented

- Audit logging for all user actions (`Order` rows) — Done
