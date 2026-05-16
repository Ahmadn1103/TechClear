# TechClear Backend — Forms, Payments & CRM Design
Date: 2026-05-15

## Scope
Phase 2 & 3 backend: waitlist form, enrollment form, Stripe Checkout, HubSpot CRM sync, Resend transactional emails, and a "Pay for Your Course" section on the homepage.

## Architecture

**Stack additions:** `stripe`, `@hubspot/api-client`, `resend` npm packages.  
**No database** — HubSpot is the contact store for Phase 2/3.  
**Hosting:** Vercel (Next.js API routes run as serverless functions).

## Data Flows

### Waitlist (Homepage Form)
1. User submits name + email + interest area
2. POST `/api/waitlist` → create HubSpot contact (list: Waitlist) + send Resend confirmation email to user

### Enrollment + Payment
1. User fills `/register` page form (name, email, phone, cohort, payment plan)
2. POST `/api/enroll` → validate inputs → create Stripe Checkout session → return `{url}`
3. Browser redirects to Stripe-hosted checkout
4. On success: Stripe redirects to `/register/success?session_id=...`
5. Stripe webhook POST `/api/webhooks/stripe`:
   - `checkout.session.completed` → create HubSpot contact (status: enrolled) + send Resend receipt
   - `payment_intent.payment_failed` → log / notify TechClear
   - `charge.refunded` → update HubSpot contact status

### Contact Submissions (homepage form — general inquiries)
- Same pattern as waitlist: POST `/api/contact` → HubSpot contact + notify TechClear inbox via Resend

## Files

### New files
- `lib/hubspot.ts` — createOrUpdateContact(data), addToList(contactId, listId)
- `lib/resend.ts` — sendWaitlistConfirmation(email), sendEnrollmentReceipt(email, data), sendContactNotification(data)
- `lib/stripe.ts` — createCheckoutSession(enrollmentData)
- `app/api/waitlist/route.ts` — POST handler
- `app/api/enroll/route.ts` — POST handler, returns Stripe session URL
- `app/api/contact/route.ts` — POST handler
- `app/api/webhooks/stripe/route.ts` — POST handler, raw body required
- `app/register/page.tsx` — Enrollment form + payment plan selector
- `app/register/success/page.tsx` — Post-payment confirmation page
- `.env.local` — all API keys (placeholder values)

### Modified files
- `app/page.tsx` — wire waitlist form to `/api/waitlist`, add "Enroll & Pay" section
- `next.config.ts` — no changes needed (API routes work out of the box)

## Environment Variables
```
HUBSPOT_ACCESS_TOKEN=
RESEND_API_KEY=
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Parallel Build Streams

**Stream A — Backend (lib + API routes):**
Install packages, create all lib utilities, create all API routes.

**Stream B — Frontend (pages + homepage updates):**
Update homepage waitlist form, create /register page, create /register/success page, add "Enroll & Pay" section to homepage.

Streams are independent: A touches only `lib/` and `app/api/`; B touches only `app/page.tsx` and new page files.
