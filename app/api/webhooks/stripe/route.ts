import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrUpdateContact } from '@/lib/hubspot'
import { sendEnrollmentReceipt } from '@/lib/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata || {}

    const email = session.customer_email || session.customer_details?.email || ''
    const firstName = session.customer_details?.name?.split(' ')[0] || ''

    try {
      await createOrUpdateContact({
        email,
        firstName,
        lifecyclestage: 'customer',
        leadStatus: 'CONNECTED',
      })

      await sendEnrollmentReceipt(email, firstName, '', '')
    } catch (error) {
      console.error('[Stripe Webhook] Post-payment processing error:', error)
      // Still return 200 to Stripe to prevent re-delivery; log the error for manual follow-up
    }
  }

  return NextResponse.json({ received: true })
}
