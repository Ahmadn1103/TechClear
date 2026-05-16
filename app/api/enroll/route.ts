import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, cohort, plan } = body

    if (!firstName || !lastName || !email || !phone || !cohort || !plan) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: firstName, lastName, email, phone, cohort, and plan are all required.',
        },
        { status: 400 }
      )
    }

    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/register/success`
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/register`

    const session = await createCheckoutSession({
      customerEmail: email,
      customerName: `${firstName} ${lastName}`,
      cohort,
      plan,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[API /enroll] error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
