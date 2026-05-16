import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST() {
  try {
    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/register/success`
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/register`

    const session = await createCheckoutSession({ successUrl, cancelUrl })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[API /enroll] error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
