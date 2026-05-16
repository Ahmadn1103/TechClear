import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrUpdateContact, createContactNote } from '@/lib/hubspot'
import { sendEnrollmentReceipt, sendEnrollmentNotification } from '@/lib/resend'

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

    // Retrieve full session with line items expanded
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    })

    const email = fullSession.customer_details?.email || ''
    const fullName = fullSession.customer_details?.name || ''
    const firstName = fullName.split(' ')[0] || 'there'
    const phone = fullSession.customer_details?.phone || ''
    const amountTotal = fullSession.amount_total ?? 0
    const amountPaid = `$${(amountTotal / 100).toFixed(2)}`
    const lineItem = fullSession.line_items?.data[0]
    const productName = lineItem?.description || 'PM + AI Flagship Program'

    console.log('[Stripe Webhook] Payment completed:', { email, fullName, phone, amountPaid, productName })

    try {
      const { id: contactId } = await createOrUpdateContact({
        email,
        firstName,
        ...(phone ? { phone } : {}),
        lifecyclestage: 'customer',
        leadStatus: 'CONNECTED',
      })

      await createContactNote(
        contactId,
        `Payment received — ${productName} · ${amountPaid} · Phone: ${phone || 'not provided'}`
      )

      await Promise.allSettled([
        sendEnrollmentReceipt(email, firstName, amountPaid),
        sendEnrollmentNotification({ fullName, email, phone, productName, amountPaid }),
      ])
    } catch (error) {
      console.error('[Stripe Webhook] Post-payment processing error:', error)
      // Still return 200 to Stripe — log manually if this fires
    }
  }

  return NextResponse.json({ received: true })
}
