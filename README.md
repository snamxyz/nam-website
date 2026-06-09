# NAM Website

This repo is an npm-workspaces monorepo with two independently deployable
Next.js apps:

- `apps/web`: public marketing site, referral tracking routes, and conversion APIs.
- `apps/admin`: password-protected admin dashboard served from the admin domain root.
- `packages/core`: shared database, tracking, stats, auth, and utility code.
- `packages/db`: Prisma schema, migrations, seed script, and generated client output.

## Getting Started

Install dependencies from the repo root:

```bash
npm install
```

Run the public app:

```bash
npm run dev:web
```

Run the admin app:

```bash
npm run dev:admin
```

Build each app independently:

```bash
npm run build:web
npm run build:admin
```

## Database

Prisma lives in `packages/db`. The root scripts delegate to that workspace:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

Run migrations from one controlled place only, such as a CI job or a manual
release step. Do not configure both Vercel projects to run migrations
automatically.

## Vercel Projects

Create two Vercel projects from this same repository:

| Project | Root directory | Build command |
| --- | --- | --- |
| Public web | `apps/web` | `npm run build` |
| Admin | `apps/admin` | `npm run build` |

Both app build scripts generate the shared Prisma client before running
`next build`.

## Environment Variables

Set these on the public web project:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `WEBHOOK_SECRET`
- `IP_HASH_SALT`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_S3_PUBLIC_URL`

Set these on the admin project:

- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_S3_PUBLIC_URL`

For the admin project, `NEXT_PUBLIC_SITE_URL` must point to the public site
domain so generated referral links use the public `/ref/[slug]` route.

### AWS S3 (blog images)

Blog cover images and inline editor images are uploaded to S3 from the admin
app. Set the AWS variables on both the admin and public web projects if you want
uploads and rendering to work in each environment.

- `AWS_S3_BUCKET` — bucket name
- `AWS_S3_PUBLIC_URL` — base URL for public reads (for example a CloudFront
  domain or `https://<bucket>.s3.<region>.amazonaws.com`)
- Configure the bucket so objects under `blog/` are publicly readable, or serve
  them through a CDN with public access.
