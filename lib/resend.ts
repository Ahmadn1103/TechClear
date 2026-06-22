import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const INTERNAL_NOTIFICATION_EMAIL = 'abdullah.r52@gmail.com'

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

export async function sendWaitlistConfirmation(to: string, firstName: string, interest?: string) {
  const interestLabel = interest ? (INTEREST_LABELS[interest] ?? interest) : 'your message'
  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to, 'contact@techclear.org'],
      subject: "We've received your message — TechClear",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">Hi ${firstName},</h2>
            <p>Thanks for reaching out to <strong>TechClear</strong>. We've received your message regarding <strong>${interestLabel}</strong>, and our team will get back to you shortly.</p>
            <p>If your inquiry is time-sensitive, you can reply directly to this email and we'll prioritize it.</p>
            <br />
            <p>Talk soon,</p>
            <p><strong>The TechClear Team</strong></p>
          </body>
        </html>
      `,
    })
    return response
  } catch (error) {
    console.error('[Resend] sendWaitlistConfirmation error:', error)
    throw error
  }
}

export async function sendEnrollmentReceipt(
  to: string,
  firstName: string,
  amountPaid: string
) {
  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: 'Welcome to TechClear — Enrollment Confirmed',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">Welcome aboard, ${firstName}!</h2>
            <p>Your enrollment in the <strong>TechClear PM + AI Flagship Program</strong> is confirmed.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Program</td>
                <td style="padding: 10px; border: 1px solid #ddd;">PM + AI Flagship Program</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Duration</td>
                <td style="padding: 10px; border: 1px solid #ddd;">8 Weeks</td>
              </tr>
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Includes</td>
                <td style="padding: 10px; border: 1px solid #ddd;">SAFe Scrum Master 6.0 Certification</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Amount Paid</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${amountPaid}</td>
              </tr>
            </table>
            <p>You'll receive onboarding instructions and next steps within the next 24–48 hours.</p>
            <p>If you have any questions, just reply to this email.</p>
            <br />
            <p>Welcome to TechClear,</p>
            <p><strong>The TechClear Team</strong></p>
          </body>
        </html>
      `,
    })
    return response
  } catch (error) {
    console.error('[Resend] sendEnrollmentReceipt error:', error)
    throw error
  }
}

export async function sendEnrollmentNotification(data: {
  fullName: string
  email: string
  phone: string
  productName: string
  amountPaid: string
}) {
  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: ['abdullah.r52@gmail.com', 'contact@techclear.org'],
      subject: `New Enrollment — ${data.fullName || data.email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">New Enrollment</h2>
            <p>A payment was just completed via Stripe.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.fullName || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Product</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.productName}</td>
              </tr>
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Amount Paid</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>${data.amountPaid}</strong></td>
              </tr>
            </table>
            <p><a href="https://app.hubspot.com" style="color: #1a1a2e; font-weight: bold;">View in HubSpot →</a></p>
          </body>
        </html>
      `,
    })
    return response
  } catch (error) {
    console.error('[Resend] sendEnrollmentNotification error:', error)
    throw error
  }
}

export async function sendWaitlistNotification(data: {
  firstName: string
  email: string
  phone?: string
  interest?: string
}) {
  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: INTERNAL_NOTIFICATION_EMAIL,
      subject: `New Contact Submission — ${data.firstName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">New Contact Submission</h2>
            <p>Someone just submitted the TechClear contact form.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.firstName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              ${data.phone ? `
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.phone}</td>
              </tr>` : ''}
              ${data.interest ? `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Area of Interest</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${INTEREST_LABELS[data.interest] ?? data.interest}</td>
              </tr>` : ''}
            </table>
            <p><a href="https://app.hubspot.com" style="color: #1a1a2e; font-weight: bold;">View in HubSpot →</a></p>
          </body>
        </html>
      `,
    })
    return response
  } catch (error) {
    console.error('[Resend] sendWaitlistNotification error:', error)
    throw error
  }
}

export async function sendContactNotification(data: {
  name: string
  email: string
  message: string
  inquiryType: string
}) {
  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: INTERNAL_NOTIFICATION_EMAIL,
      subject: 'New TechClear Contact Form Submission',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">New Contact Form Submission</h2>
            <p>Someone submitted the TechClear contact form. Details below:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Inquiry Type</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.inquiryType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
    return response
  } catch (error) {
    console.error('[Resend] sendContactNotification error:', error)
    throw error
  }
}
