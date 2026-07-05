# Ticketing website for Red Dragon Social Club.
This is a ticket-selling platform built for the Red Dragon Social Club. It includes a nicely designed website with products for the user to view and includes an admin dashboard for the owner to create products, upload media and manage inventory.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS & CSS Modules
- Database: Neon Serverless Postgres
- ORM: Drizzle ORM
- Authentication: Clerk (Role-based access control)
- Payments: Stripe (Checkout Sessions & Webhooks)
- Image Hosting: UploadThing
- Transactional Emails: Resend

## Features
- Fully aesthetically designed website using the Red Dragon Social Club's theme.
- Admin dashboard protected by clerk middleware.
- Admins can create/edit/delete products with different ticket tiers, each with its own capacity.
- Database system to store each event/product with its ticket tiers.
- Payment system through Stripe.
- Automated webhooks to update inventory space in the database based off of Stripe receipts.
- Automated confirmation emails to the buyer after a successfull purchase with Resend.

## Local Development Setup
To run this project locally, you will need to set up accounts with the services listed in the Tech Stack and gather your API keys.

Clone and install dependencies:
```
git clone <your-repo-url>
cd mahjong-nights
npm install
```

To set up your environment variables, create a .env.local file in the root directory and add the following keys:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```

Run the Stripe CLI (for testing webhooks locally). In a separate terminal window, forward Stripe events to your local server:
```
stripe listen --forward-to localhost:3000/api/webhook
```
