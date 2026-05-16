import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(data: {
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      line_items: [
        {
          price: 'price_1TXYWPA9IeySagbTgceBL7SL',
          quantity: 1,
        },
      ],
    })

    return session
  } catch (error) {
    console.error('[Stripe] createCheckoutSession error:', error)
    throw error
  }
}
