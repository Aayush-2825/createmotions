## Create Motion

Next.js (app router) app with Better Auth, Prisma, and a resources dashboard (coins, referrals, purchases).

### Quickstart
- Install: `npm install`
- Generate Prisma client: `npx prisma generate`
- Run dev server: `npm run dev`

### Environment
Create `.env.local` with at least:

```
DATABASE_URL="postgres://user:password@host:5432/db"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
```

### Database
- Update `prisma/schema.prisma` as needed.
- Apply migrations: `npx prisma migrate dev --name init`.
- Inspect data: `npx prisma studio`.

### Auth
- Better Auth server config lives in `src/lib/auth.ts`.
- Client hooks/actions come from `src/lib/auth-client.ts`.

### Scripts
- `npm run dev` — generate Prisma client then start Next.js.
- `npm run build` — generate Prisma client then build for production.
- `npm run lint` — run ESLint.

### Notes
- Admin-only resource creation lives in `src/actions/resource-actions.ts` and is guarded by role checks.
- Keep slugs unique when importing/creating resources to avoid DB constraint errors.
