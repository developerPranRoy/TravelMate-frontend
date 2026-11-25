# TravelMate-frontend

Next.js 15 App Router frontend for the TravelMate travel and tour booking platform.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Axios API client
- React Hook Form + Zod validation
- react-hot-toast notifications
- lucide-react icons

## Setup

```bash
npm install
# create .env.local with the API URL
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with featured destinations and packages |
| `/destinations` | Destination listing |
| `/destinations/[id]` | Destination detail |
| `/packages` | Package listing with filters |
| `/packages/[id]` | Package detail and booking |
| `/login`, `/register` | Authentication |
| `/dashboard` | Customer dashboard |
| `/dashboard/bookings` | Customer bookings |
| `/dashboard/agency/packages` | Agency package management |
| `/dashboard/agency/bookings` | Agency reservations |
| `/dashboard/admin/*` | Admin users, agencies, destinations, bookings |

## Demo accounts (with the seeded backend)

| Role | Email | Password |
|---|---|---|
| Admin | admin@travelmate.com | admin123 |
| Agency | agency@travelmate.com | agency123 |
| Customer | customer@travelmate.com | customer123 |
