import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(data: {
  customerEmail: string
  customerName: string
  cohort: string
  plan: 'full' | 'installment'
  successUrl: string
  cancelUrl: string
}) {
  try {
    const unitAmount = 300000
    const productName = 'TechClear PM + AI Flagship Program — Full Payment'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: data.customerEmail,
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        firstName: data.customerName.split(' ')[0] || data.customerName,
        customerName: data.customerName,
        cohort: data.cohort,
        plan: data.plan,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              description: `Cohort: ${data.cohort}`,
            },
          },
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
