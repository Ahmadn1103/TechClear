@AGENTS.md

# TechClear — Project Reference

## Overview
TechClear is a Next.js 16 (App Router) landing site and enrollment platform for an 8-week IT workforce training program called the **PM + AI Flagship Program**. It combines SAFe Scrum Master 6.0 certification with AI tooling for IT professionals.

**Live domain target:** `https://techclear.io`  
**Internal contact email:** `contact@techclear.org`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript 5 · Tailwind CSS 4 · Framer Motion · Stripe · HubSpot · Resend

---

## Page Sections (app/page.tsx)

| Section ID   | Label             | Description                                              |
|--------------|-------------------|----------------------------------------------------------|
| `#hero`      | Hero              | Full-screen opener, animated diagonal grid + orbs, 3 CTAs |
| `#about`     | About Us          | 3-column About / Mission / Vision cards                  |
| `#services`  | The Problem       | 3 numbered pain points + 4 service feature cards         |
| `#bootcamp`  | Flagship Program  | 8-week PM + AI program detail + bootcamp image           |
| `#enroll`    | Enroll            | Pricing card — $3,000 one-time payment                   |
| `#waitlist`  | Contact           | Waitlist/intake form → HubSpot + Resend                  |

**Footer** mirrors the header nav exactly: About Us · The Problem · Flagship Program · Enroll · Contact.

---

## Routes

| Route                          | Purpose                                                  |
|-------------------------------|----------------------------------------------------------|
| `/`                           | Main landing page                                        |
| `/register`                   | Enrollment form (name, email, phone, cohort selection)   |
| `/register/success`           | Post-Stripe payment confirmation page                    |
| `/api/waitlist`               | POST — contact intake → HubSpot + Resend                 |
| `/api/enroll`                 | POST — enrollment → Stripe checkout session              |
| `/api/contact`                | POST — contact form → HubSpot + Resend notification      |
| `/api/webhooks/stripe`        | POST — Stripe webhook; upgrades HubSpot lifecycle on pay |

---

## Integrations

### HubSpot CRM — FULLY CONNECTED ✅
Every intake form submission (waitlist/contact) creates or updates a contact in HubSpot automatically.
- `lib/hubspot.ts` — `createOrUpdateContact()`, `createContactNote()`, `addContactToList()`
- Waitlist signups land as **lifecycle: lead / status: NEW**
- After Stripe payment completes, lifecycle upgrades to **customer** via webhook
- Duplicate emails handled via 409 conflict → search → update flow
- Env var: `HUBSPOT_ACCESS_TOKEN`

### Resend Email — CODE COMPLETE, DOMAIN PENDING ⚠️
All email sending logic is implemented. Transactional emails fire on every form submission and Stripe event.

**Blocker:** Resend custom domain verification for `techclear.org` is taking a long time to propagate. Until verified, emails fall back to `onboarding@resend.dev` (set via `RESEND_FROM_EMAIL`). Monitor at [resend.com/domains](https://resend.com/domains) and update `RESEND_FROM_EMAIL` once the domain clears.

- `lib/resend.ts` — `sendWaitlistConfirmation()`, `sendWaitlistNotification()`, `sendEnrollmentReceipt()`, `sendContactNotification()`
- Env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

### Stripe Payments — CODE COMPLETE, KEYS PENDING ⚠️
**Blocker:** Waiting on **Abdullah** to complete TechClear's Stripe account setup and provide the live API keys. The integration code is fully implemented and tested with the Stripe SDK.

- Payment: **$3,000 one-time** (no installments)
- `lib/stripe.ts` — `createCheckoutSession()`
- `app/api/webhooks/stripe/route.ts` — verifies signature, upgrades HubSpot contact, sends receipt email
- Env vars needed from Abdullah: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`

---

## Environment Variables (.env.local)

```
# Stripe (PENDING — Abdullah to provide)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=https://techclear.io

# HubSpot (CONNECTED)
HUBSPOT_ACCESS_TOKEN=

# Resend (CONNECTED — domain verification pending)
RESEND_API_KEY=
RESEND_FROM_EMAIL=contact@techclear.org
```

---

## Pricing

| Plan        | Amount  | Status            |
|-------------|---------|-------------------|
| One-time    | $3,000  | Active            |
| Installment | —       | Removed — not offered |

---

## Cohort Options (register/page.tsx)

- Cohort 1 — Q3 2026 (Virtual)
- Cohort 2 — Q4 2026 (In-Person)
- Cohort 3 — Q1 2027 (Virtual)
- 1-on-1 Coaching (Flexible)

---

## Assets

```
public/
  assets/
    branding/
      1.png   — Full logo (used in nav + footer)
      5.png   — Icon/mark (favicon, iOS icon)
    images/
      bootcamp.png   — Flagship Program section image
      problem.png    — The Problem section image
```

OG image placeholder: `/assets/branding/og-image.png` — **needs to be created** (1200×630px) for social sharing previews.

---

## Design System

- **Font — Display:** Playfair Display (headings, italic accents)
- **Font — Body:** Inter
- **Color:** Black background (`#000`), near-black sections (`#050505`), white text
- **Cursor:** Custom animated diamond cursor (desktop only, hidden on touch devices)
- **Animations:** Framer Motion — animated diagonal crosshatch grid + drifting radial gradient orbs used consistently across hero and enroll sections
- **Buttons:** 3 levels — solid white (primary), outlined white (secondary), dimmed outline (tertiary)
- **Border radius:** None (`rounded-none`) everywhere — intentional sharp aesthetic

---

## Blockers Summary

| Blocker | Owner | Status |
|---------|-------|--------|
| Stripe account setup + live API keys | Abdullah | Pending |
| Resend domain verification (`techclear.org`) | DNS propagation | Pending — monitor resend.com/domains |

## Working

| Integration | Status |
|------------|--------|
| HubSpot CRM | Fully connected — all form submissions create/update contacts |
| Email sending (fallback domain) | Working via `onboarding@resend.dev` until domain clears |
| Enrollment flow | End-to-end ready pending Stripe keys |
