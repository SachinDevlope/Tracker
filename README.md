# attendance.log

A personal work attendance tracker for one person. Tap check in when you start work and check out when you finish. The app saves the exact time of each tap, marks each workday's status (office, half day, leave, absent or holiday), and works out your hours and an attendance percentage. It also tracks your daily expenses, your tiffin meals, and the money you owe people.

Built with Next.js 16 (App Router), Tailwind CSS v4 and MongoDB (Mongoose). The dark UI looks like a code editor, and the layout works on phones.

## Features

- **Today** (`/`)
  - One tap to `$ check_in` or `$ check_out`. The exact time comes from the server clock, is saved as a timestamp, and is shown in `APP_TIMEZONE`. Times can't be typed in or edited by hand.
  - You can check in and check out once per day each. Check out only works after you've checked in. Tapping again does nothing, so the first time is kept.
  - While you're checked in, the card shows the hours worked so far.
  - Checking in marks the day `office` automatically.
  - The day editor changes only the status and the note. `rm` deletes the whole day, timestamps included.
  - **Backdated days:** use ‹ › or the calendar icon to open a past day. Past days add `check_in`/`check_out` time fields, which are saved as timestamps in `APP_TIMEZONE`. If check-out is earlier than check-in, it counts as the next day, for a night shift. Today only uses the punch buttons, and future days take a status and note only.
  - Shows a summary for the month so far.
- **Calendar** (`/calendar`): a month grid coloured by status, with a red dot on late days. Tap any day to edit it. The monthly summary sits below.
  - `+ backfill()` fills a past date range in one go: pick a status and check-in/out times (prefilled with the 09:30–19:00 shift), and choose whether to skip Sundays. Days you have already logged are never overwritten, and it can fill at most 93 days at a time.
- **Expenses** (`/expenses`)
  - Add an expense with an amount in ₹, a category, a date (defaults to today) and an optional note. After you save, the category and date stay selected so you can enter several in a row.
  - Categories: `food`, `groceries`, `transport`, `bills`, `rent`, `shopping`, `health`, `fun`, `other`.
  - For each month: the total, the daily average (days so far in the current month), a breakdown by category with bars, and a list grouped by day. `rm` deletes an entry. You can export the month as a CSV.
  - Amounts are stored as whole paise, so totals never have rounding errors.
  - **Import from a bank statement:** `+ import_statement()` takes your bank account statement PDF, plus its password if it's locked. The server pulls the text out with PDF.js, keeping the table columns aligned. A free Groq AI model (GPT-OSS 120B) then lists every debit with a suggested category; credits such as salary and refunds are skipped. You review the list and can untick rows or change categories. Rows that match an expense you've already saved (same date and amount) start unticked. Then `import` saves the rest. The PDF is processed in memory and never stored, but the statement text is sent to Groq. Long statements are split into parts, and the app waits automatically if it hits Groq's free-tier rate limit. Scanned (image-only) PDFs have no text, so they can't be read.
- **Debts** (`/debts`)
  - Log money you owe: who you owe, the amount, the date you borrowed it, an optional due date and a note.
  - Record repayments in parts with `pay`. The `full` button fills in whatever is left. A payment can't be more than the amount still owed or dated before the borrow date. `log(n)` shows the payment history, and `×` undoes a payment.
  - Each debt shows how much is left, a progress bar of how much is repaid, and a due badge: red when overdue, amber when due within 7 days.
  - At the top: the total you still owe, the total repaid, how many debts are overdue, and a breakdown by person. Open debts are sorted by due date. Paid-off debts move to a collapsed **settled** section.
- **Tiffin** (`/tiffin`): track lunch and dinner from a tiffin service.
  - Tap `lunch` or `dinner` to mark today's meal. Every day of the month up to today is listed below with its own toggles, so you can fix missed days. Future days can't be marked.
  - For each month: **days ordered** (days with at least one meal) and the lunch and dinner counts.
  - **Prices are optional.** With no prices set, the page only tracks which meals you had. To add billing, open `add prices (optional)` at the bottom and set a lunch price, a dinner price, or both, plus the vendor's name if you like.
  - Once prices are set, each meal saves the price at the time you mark it, so changing prices later never changes past bills. Meals marked before you set prices stay unpriced.
  - With billing on, each month also shows the bill and what you paid. The balance due is all-time (every priced meal minus every payment), so unpaid months carry over. If you've paid ahead, it shows as an advance.
  - Record payments to the vendor once billing is on. `also add to expenses` (on by default) also saves the payment as a `food` expense, so your spending totals include tiffin. Deleting a payment doesn't remove that expense; delete it on the Expenses page.
- **Dashboard** (`/dashboard`): everything for one date range on a single page.
  - Range: quick presets (`this_month`, `last_month`, `90_days`, `this_year`) or any custom from/to dates. Defaults to this month so far.
  - **Attendance:** the attendance %, total and average hours, status counts, late count, and a chart of hours worked.
  - **Spending:** total, daily average, category breakdown, and a chart of money spent.
  - **Tiffin:** days ordered and lunch and dinner counts for the range, plus the bill and all-time balance due when prices are set.
  - **Debts:** what you owe as of today, the amount repaid, the overdue count, and the next three due dates. This section ignores the range.
  - Charts show one bar per day for ranges up to 31 days, per week (starting Monday) up to 120 days, and per month beyond that.
  - A collapsible `attendance_log` lists every day in the range. You can export the range as `attendance.csv` or `expenses.csv`.
  - The old `/reports` link redirects here.
- **Login**: a single password. The session is a signed, httpOnly cookie that lasts 30 days.
- **Phone friendly**: bottom tab bar (file-style tabs in the header on wide screens), large tap targets, and it can be installed to your home screen.

### How the numbers work

| Status | Counts as |
| --- | --- |
| office | 1 day attended |
| half_day | ½ day attended |
| absent | 0, counts against you |
| leave, holiday | not counted either way |

`attendance % = (office + ½ × half_day) ÷ (marked days − leave − holiday)`

**Shift:** Monday to Saturday, 09:30–19:00. Wherever you type times, a `shift` button fills in 09:30 → 19:00.

**Late:** a check-in after **09:45** local time (15 minutes of grace) marks the day late automatically. This applies to the punch button, typed backdated times and backfill. Late days still count as attended, but show a `late` badge, a red dot on the calendar, a late count in the summaries and a Late column in the CSV.

Hours worked = check-out timestamp − check-in timestamp. The CSV export has local times plus the raw ISO timestamps.

Sunday is the day off. It is only shaded on the calendar and never counts as absent. To change the shift times, late cut-off or days off, edit `SHIFT`, `LATE_AFTER` and `WEEKEND_DAYS` in `src/features/attendance/status.ts`.

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
   | `GROQ_API_KEY` | Free API key from https://console.groq.com/keys, used to import bank statements |
   | `GROQ_MODEL` | Optional Groq model override (default `openai/gpt-oss-120b`) |
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
    (app)/expenses/page.tsx     Expenses
    (app)/debts/page.tsx        Debts
    (app)/tiffin/page.tsx       Tiffin
    (app)/dashboard/page.tsx    Dashboard
    login/page.tsx
    api/export/route.ts         attendance CSV
    api/expenses/export/        expenses CSV (by month or date range)
    api/expenses/statement/     statement PDF upload → extracted debits
  features/
    auth/                       token.ts (signing) · session.ts (cookie + requireAuth) · actions · components
    attendance/                 model → service → actions, plus validation, time, summary, status and UI components
    calendar/components/        MonthGrid
    debts/                      model (payments embedded in each debt) → service → actions, plus validation, summary (due state) and UI components
    tiffin/                     meals (price saved per meal), settings, vendor payments, summary (days ordered, bill) and UI components
    statements/                 PDF → text lines (pdf.ts), Groq client, AI extraction + duplicate check, import action, review UI
    expenses/                   model → service → actions, plus validation, categories, summary and UI components
    dashboard/                  range presets, chart bucketing (trend.ts), attendance CSV, range filters and entry list
  components/
    ui/                         reusable primitives: Button, Input, Card/Window, StatTile, BarChart, Collapsible, ChipPicker, MoneyInput, PaymentFields, MonthNavigator, Skeleton
    layout/                     AppShell, Nav
  lib/                          env, db connection, shared schema fields (schema.ts), form parsing helpers (form.ts), date helpers, money (₹, stored as paise), CSV helper, cn
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
