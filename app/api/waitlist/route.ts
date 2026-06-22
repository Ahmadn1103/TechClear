import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, createContactNote } from '@/lib/hubspot'
import { sendWaitlistConfirmation } from '@/lib/resend'
import { sendInternalNotification } from '@/lib/mailer'

const INTEREST_LABELS: Record<string, string> = {
  bootcamp: 'PM + AI Flagship Program',
  enrollment: 'Enrollment Question',
  pricing: 'Pricing & Payment',
  cohort: 'Cohort Schedule / In-person Kickoff',
  curriculum: 'Curriculum & Certification',
  partnership: 'Partnership / Corporate Inquiry',
  support: 'Technical Support',
  other: 'Other',
  general: 'General Updates',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, interest, message } = body

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName and email are required.' },
        { status: 400 }
      )
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName

    const { id: contactId } = await createOrUpdateContact({
      email,
      firstName,
      ...(lastName ? { lastName } : {}),
      ...(phone ? { phone } : {}),
      lifecyclestage: 'lead',
      leadStatus: 'NEW',
    })
    console.log('[HubSpot] Contact created/updated:', contactId)

    if (interest || message) {
      const label = interest ? (INTEREST_LABELS[interest] ?? interest) : 'Not specified'
      const noteBody = message
        ? `Area of Interest: ${label}\n\nMessage:\n${message}`
        : `Area of Interest: ${label}`
      await createContactNote(contactId, noteBody)
      console.log('[HubSpot] Note added for contact:', contactId)
    }

    // Email failures are non-fatal — HubSpot contact creation is the critical step
    await Promise.allSettled([
      sendWaitlistConfirmation(email, firstName, interest),
      sendInternalNotification({ firstName, lastName, fullName, email, phone, interest, message }),
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
