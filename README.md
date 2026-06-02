# Museum Grades — Luxury Handbag Commerce

A Next.js (App Router) + TypeScript storefront for pre-owned luxury handbags.
The product catalogue lives in **Postgres** (self-hosted on your VPS) and is
accessed through **Drizzle ORM**.

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript, Tailwind CSS v4, shadcn/ui
- Postgres + Drizzle ORM (`postgres-js` driver)

## Prerequisites

- Node.js ≥ 20
- A running Postgres instance (VPS, Docker, or any hosted Postgres)

## VPS: set up Postgres

If Postgres isn't installed on your VPS yet:

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y postgresql
sudo -u postgres psql -c "CREATE USER myuser WITH PASSWORD 'mypassword';"
sudo -u postgres psql -c "CREATE DATABASE museum_grades OWNER myuser;"
```

Make sure port 5432 is either open to your deployment machine, or you run
migrations directly on the VPS.

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the database connection**

   ```bash
   cp .env.example .env.local
   # Edit .env.local and set DATABASE_URL
   ```

   Example: `postgresql://myuser:mypassword@your-vps-ip:5432/museum_grades`

3. **Run migrations**

   ```bash
   npm run db:generate   # (already committed — skip if drizzle/ folder exists)
   npm run db:migrate    # creates tables on your database
   ```

4. **Seed the catalogue**

   ```bash
   npm run db:seed       # loads 50 products into Postgres
   ```

   The seed is idempotent — safe to re-run at any time.

5. **Start the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Database scripts

| Command | Description |
| --- | --- |
| `npm run db:generate` | Generate migration SQL from `src/db/schema.ts` |
| `npm run db:migrate`  | Apply pending migrations to the database |
| `npm run db:seed`     | Populate / refresh the catalogue |

## Deployment (VPS)

For production, set `DATABASE_URL` as an environment variable on your server
(via `.env`, systemd unit, or your process manager). Then:

```bash
npm run build
npm start
```

Or use a process manager like **PM2**:

```bash
npm install -g pm2
pm2 start npm --name museum-grades -- start
pm2 save
```

## Project layout

- `src/db/schema.ts` — Drizzle schema (source of truth: brands, categories, products, product_images)
- `src/db/index.ts` — server-only Drizzle client
- `src/db/seed.ts` — idempotent seed script
- `src/lib/products.ts` — async, DB-backed data access layer
- `src/lib/seed-data.ts` — static catalogue used only by the seed script

## Roadmap

- **Phase 1 (done):** Data layer — Postgres + Drizzle
- **Phase 2:** Accounts (Better Auth) — sign up / in / out, `/account`
- **Phase 3:** Cart — DB-backed for users, cookie for guests
- **Phase 4:** Checkout — shipping, review, mock payment, orders
- **Phase 5:** Real payment provider (PayMongo / Xendit), webhook confirmation
