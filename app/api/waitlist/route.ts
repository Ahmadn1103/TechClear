import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, createContactNote } from '@/lib/hubspot'
import { sendWaitlistConfirmation } from '@/lib/resend'
import { sendInternalNotification } from '@/lib/mailer'

const INTEREST_LABELS: Record<string, string> = {
  bootcamp: 'PM + AI Flagship Program',
  general: 'General Updates',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, email, phone, interest } = body

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName and email are required.' },
        { status: 400 }
      )
    }

    const { id: contactId } = await createOrUpdateContact({
      email,
      firstName,
      ...(phone ? { phone } : {}),
      lifecyclestage: 'lead',
      leadStatus: 'NEW',
    })
    console.log('[HubSpot] Contact created/updated:', contactId)

    if (interest) {
      const label = INTEREST_LABELS[interest] ?? interest
      await createContactNote(contactId, `Area of Interest: ${label}`)
      console.log('[HubSpot] Note added for contact:', contactId)
    }

    // Email failures are non-fatal — HubSpot contact creation is the critical step
    await Promise.allSettled([
      sendWaitlistConfirmation(email, firstName, interest),
      sendInternalNotification({ firstName, email, phone, interest }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API /waitlist] error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
