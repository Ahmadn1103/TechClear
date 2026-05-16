import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact } from '@/lib/hubspot'
import { sendContactNotification } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message, inquiryType } = body

    if (!name || !email || !message || !inquiryType) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: name, email, message, and inquiryType are all required.',
        },
        { status: 400 }
      )
    }

    // Split name into first/last for HubSpot
    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined

    await createOrUpdateContact({
      email,
      firstName,
      ...(lastName ? { lastName } : {}),
    })

    await sendContactNotification({ name, email, message, inquiryType })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API /contact] error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
