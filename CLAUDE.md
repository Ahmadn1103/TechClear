@AGENTS.md

# TechClear — Project Reference

## Overview
TechClear is a Next.js 16 (App Router) landing site and enrollment platform for an 8-week IT workforce training program called the **PM + AI Flagship Program**. It combines SAFe Scrum Master 6.0 certification with AI tooling for IT professionals.

**Live domain target:** `https://techclear.io`  
**Internal contact email:** `contact@techclear.org`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript 5 · Tailwind CSS 4 · Framer Motion · Stripe · HubSpot · Resend · qrcode.react

---

## Page Sections (app/page.tsx)

| Section ID   | Label             | Description                                                        |
|--------------|-------------------|--------------------------------------------------------------------|
| `#hero`      | Hero              | Full-screen opener, animated diagonal grid + orbs, 3 CTAs          |
| `#about`     | About Us          | 3-column About / Mission / Vision cards (no CTA buttons)           |
| `#services`  | Our Solution      | 3 numbered pain points + 4 service feature cards                   |
| `#bootcamp`  | Flagship Program  | 8-week PM + AI program detail + bootcamp image                     |
| `#enroll`    | Enroll            | Pricing card — $3,000 one-time payment                             |
| —            | Early Access QR   | QR code section between Enroll and Contact (links to #waitlist)    |
| `#waitlist`  | Contact           | Waitlist/intake form → HubSpot + Resend; QR code in left column   |

**Footer** mirrors the header nav exactly: About Us · Our Solution · Flagship Program · Enroll · Contact.

---

## Routes

| Route                          | Purpose                                                            |
|-------------------------------|--------------------------------------------------------------------|
| `/`                           | Main landing page                                                  |
| `/register`                   | Enrollment page — redirects directly to Stripe Payment Link        |
| `/register/success`           | Post-Stripe payment confirmation page                              |
| `/api/waitlist`               | POST — contact intake → HubSpot + Resend                          |
| `/api/webhooks/stripe`        | POST — Stripe webhook; upgrades HubSpot lifecycle on pay           |

> `/api/enroll` was removed — enrollment now uses a Stripe Payment Link directly.

---

## Integrations

### HubSpot CRM — FULLY CONNECTED ✅
Every intake form submission creates or updates a contact in HubSpot automatically.
- `lib/hubspot.ts` — `createOrUpdateContact()`, `createContactNote()`, `addContactToList()`
- Waitlist signups: **lifecycle: lead / status: NEW**; stores `firstName`, `lastName`, `phone`
- After Stripe payment: lifecycle upgrades to **customer** via webhook + note added with payment details
- Env var: `HUBSPOT_ACCESS_TOKEN`

### Resend Email — FULLY CONNECTED ✅
All email sending logic is implemented, tested, and live. Custom domain `techclear.org` is verified and sending from `contact@techclear.org`.

> Previously blocked by a Gmail/Google Workspace DNS conflict — resolved by correcting the DNS records on the Gmail side.

- `lib/resend.ts` — `sendWaitlistConfirmation()`, `sendEnrollmentReceipt(email, firstName, amountPaid)`, `sendEnrollmentNotification(data)`, `sendWaitlistNotification()`, `sendContactNotification()`
- `lib/mailer.ts` — `sendInternalNotification({ firstName, lastName, fullName, email, phone, interest })` — internal team email showing full name
- All internal notifications go to: `abdullah.r52@gmail.com` + `contact@techclear.org`
- Env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

### Stripe Payments — READY, LAUNCHING LATER ⏳
- Payment: **$3,000 one-time** (no installments)
- Uses a **Stripe Payment Link** (not API-created sessions): `https://buy.stripe.com/6oU14mgs2bIogALaim7wA01`
- Promotion codes: enabled in Stripe Dashboard on the Payment Link settings
- `/register/page.tsx` redirects directly to the Payment Link — no API call needed
- `app/api/webhooks/stripe/route.ts` — verifies signature, retrieves full session with `expand: ['line_items']`, extracts email/phone/name/product/amount, upgrades HubSpot contact, sends receipt + internal notification
- Env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

---

## Environment Variables (.env.local)

```
# Stripe (CONNECTED)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# HubSpot (CONNECTED)
HUBSPOT_ACCESS_TOKEN=

# Resend (CONNECTED)
RESEND_API_KEY=
RESEND_FROM_EMAIL=contact@techclear.org
```

> `NEXT_PUBLIC_BASE_URL` is no longer needed — the register page redirects to the Stripe Payment Link directly.

---

## Pricing

| Plan        | Amount  | Status                    |
|-------------|---------|---------------------------|
| One-time    | $3,000  | Active — via Payment Link |
| Installment | —       | Removed — not offered     |

---

## Assets

```
public/
  assets/
    branding/
      1.png   — Full logo (nav + footer) — displayed as cropped square (scale-[1.15], object-cover)
      5.png   — Icon/mark (favicon, iOS icon)
    images/
      bootcamp.png   — Flagship Program section image
      problem.png    — The Problem section image
```

OG image placeholder: `/assets/branding/og-image.png` — **needs to be created** (1200x630px) for social sharing previews.

---

## Design System

- **Font — Display:** Playfair Display (headings, italic accents)
- **Font — Body:** Inter
- **Color:** Black background (`#000`), near-black sections (`#050505`, `#020202`), white text
- **Cursor:** Custom animated ring + dot cursor (desktop only, hidden on touch devices)
  - Disabled on `/register` page via `usePathname()` — that page uses the native browser cursor
  - `.no-custom-cursor` class in `globals.css` overrides the `cursor: none !important` rule for opt-out pages
  - Ambient glow (600px radial gradient, `mix-blend-screen`) follows the cursor on all other pages
- **Nav hover:** White box highlight on desktop nav links (`hover:bg-white hover:text-black`)
- **Animations:** Framer Motion — animated diagonal crosshatch grid + drifting radial gradient orbs (hero + enroll sections); radar rings (waitlist section)
  - **Hydration Guard:** Implemented `mounted` state to prevent double-firing animations on mobile by delaying triggers until after initial hydration and layout settlement.
  - **Viewport Thresholds:** All `whileInView` triggers use `amount: 0.2` to ensure stability on mobile scroll/elastic bounce.
- **Buttons:** 3 levels — solid white (primary), outlined white (secondary), dimmed outline (tertiary)
- **Border radius:** None (`rounded-none`) everywhere — intentional sharp aesthetic
- **QR Code:** `qrcode.react` (`QRCodeSVG`) — links to `https://www.techclear.org/#waitlist`

---

## Form Fields (Waitlist / Contact)

The intake form collects: `firstName`, `lastName`, `email`, `phone`, `interest`
All fields are sent to HubSpot and included in internal notification emails (full name shown).

---

## Blockers Summary

_No active blockers._

| Integration | Status |
|------------|--------|
| HubSpot CRM | Fully connected — all form submissions create/update contacts with first + last name |
| Stripe Payment Link | Live — `buy.stripe.com/6oU14mgs2bIogALaim7wA01` with promo codes enabled |
| Stripe Webhook | Captures email, phone, name, product, amount — updates HubSpot + sends emails |
| Resend Email | Live — sending from `contact@techclear.org` (domain verified) |

---

## Resolved Issues

| Issue | Resolution |
|-------|------------|
| Double Animation Firing | Fixed by implementing a `mounted` state guard and increasing `viewport.amount` to `0.2` for all scroll-triggered elements. This prevents hydration and layout shifts from re-triggering entrance animations on mobile. |
| Strict Mode Remounting | Disabled `reactStrictMode` in `next.config.ts` to prevent double-rendering in development. |
| Resend Domain Verification | Root cause was a Gmail/Google Workspace DNS conflict on `techclear.org`. Resolved by correcting the DNS records on the Gmail side; domain is now verified and sending from `contact@techclear.org`. |


