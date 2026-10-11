# attendance.log

A personal work attendance tracker for one person. Tap check in when you start work and check out when you finish. The app saves the exact time of each tap, marks each workday's status (office, half day, leave, absent or holiday), and works out your hours and an attendance percentage.

Built with Next.js 16 (App Router), Tailwind CSS v4 and MongoDB (Mongoose). The dark UI looks like a code editor, and the layout works on phones.

## Features

- **Today** (`/`)
  - One tap to `$ check_in` or `$ check_out`. The exact time comes from the server clock, is saved as a timestamp, and is shown in `APP_TIMEZONE`. Times can't be typed in or edited by hand.
  - You can check in and check out once per day each. Check out only works after you've checked in. Tapping again does nothing, so the first time is kept.
  - While you're checked in, the card shows the hours worked so far.
  - Checking in marks the day `office` automatically.
  - The day editor changes only the status and the note. `rm` deletes the whole day, timestamps included.
  - Use ‹ › or the calendar icon to look at a past day and change its status or note. Past days show their timestamps read-only.
  - Shows a summary for the month so far.
- **Calendar** (`/calendar`): a month grid coloured by status. Tap any day to edit it. The monthly summary sits below.
- **Reports** (`/reports`): pick any date range to see totals, the attendance %, total and average hours, and every entry. You can export the range as a CSV.
- **Login**: a single password. The session is a signed, httpOnly cookie that lasts 30 days.
- **Phone friendly**: bottom tab bar, large tap targets, and it can be installed to your home screen.

### How the numbers work

| Status | Counts as |
| --- | --- |
| office | 1 day attended |
| half_day | ½ day attended |
| absent | 0, counts against you |
| leave, holiday | not counted either way |

`attendance % = (office + ½ × half_day) ÷ (marked days − leave − holiday)`

Hours worked = check-out timestamp − check-in timestamp. The CSV export has local times plus the raw ISO timestamps.

Weekends (Saturday and Sunday) are only shaded on the calendar. They never count as absent. To change which days are weekends, edit `WEEKEND_DAYS` in `src/features/attendance/status.ts`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill it in. `.env.local` is git-ignored, so your secrets stay local.

   | Key | Purpose |
   | --- | --- |
   | `MONGODB_URI` | MongoDB connection string (local or Atlas) |
   | `MONGODB_DB` | Database name (default `attendance`) |
   | `ADMIN_PASSWORD` | Your login password |
   | `AUTH_SECRET` | Random string of at least 32 characters, used to sign the session cookie |
   | `APP_TIMEZONE` | IANA timezone (IANA = the standard timezone database) that decides what "today" is and how timestamps are displayed, e.g. `Asia/Kolkata` |

   Generate a secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Run it:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

**Using it on your phone:** run `npm run dev -- -H 0.0.0.0`, then open `http://<your-pc-ip>:3000` on the same Wi-Fi. For use away from your network, deploy it (see below).

### Troubleshooting: `querySrv ECONNREFUSED`

On some Windows networks, Node cannot resolve `mongodb+srv://` addresses. When that happens, use Atlas's standard connection string instead. In Atlas, go to **Connect → Drivers** and choose an older driver version (one that shows `mongodb://host1,host2,host3/...`). That string does not need the special DNS lookup that fails here.

Also check that your IP is allowed under **Atlas → Network Access**.

## Deploying

The app runs on Vercel or any Node host. Add the same environment variables in the host's settings. If you use Atlas, allow the host's IPs in Network Access (for Vercel, `0.0.0.0/0`).

## Project structure

The code is organised by feature. Within each feature, every layer has one job.

```
src/
  app/                          routing only: thin pages that compose features
    (app)/page.tsx              Today
    (app)/calendar/page.tsx     Calendar
    (app)/reports/page.tsx      Reports
    login/page.tsx
    api/export/route.ts         CSV download
  features/
    auth/                       token.ts (signing) · session.ts (cookie + requireAuth) · actions · components
    attendance/                 model → service → actions, plus validation, time, summary, status and UI components
    calendar/components/        MonthGrid, MonthNavigator
    reports/                    range parsing, CSV export, filters and entry list
  components/
    ui/                         reusable primitives: Button, Input, Card/Window, StatTile, Skeleton
    layout/                     AppShell, Nav
  lib/                          env, db connection, date helpers, cn
  proxy.ts                      sends you to /login when you are not signed in
```

**Layers inside a feature:**

| File | Job |
| --- | --- |
| `model.ts` | Mongoose schema |
| `service.ts` | Database access only. No auth, no caching. |
| `actions.ts` | Server actions. Each one checks auth, validates input, calls the service and refreshes the cache. |
| `components/` | UI |

Every page, action and API route calls `requireAuth()` or `isLoggedIn()`. `proxy.ts` is only a quick first redirect; those calls are the real check.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
