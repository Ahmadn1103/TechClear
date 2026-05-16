import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const INTERNAL_NOTIFICATION_EMAIL = 'abdullah.r52@gmail.com'

const INTEREST_LABELS: Record<string, string> = {
  bootcamp: 'PM + AI Flagship Program',
  general: 'General Updates',
}

export async function sendWaitlistConfirmation(to: string, firstName: string, interest?: string) {
  const interestLabel = interest ? (INTEREST_LABELS[interest] ?? interest) : 'TechClear programs'
  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to, 'contact@techclear.org'],
      subject: "You're on the TechClear waitlist!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">Hey ${firstName},</h2>
            <p>You're officially on the <strong>TechClear — ${interestLabel}</strong> waitlist!</p>
            <p>We're thrilled to have you. When a spot opens up, you'll be among the first to hear about enrollment dates, cohort details, and early-bird pricing.</p>
            <p>In the meantime, keep an eye on your inbox — we'll be sending you updates, resources, and more as we get closer to launch.</p>
            <p>Have questions? Just reply to this email and we'll get back to you.</p>
            <br />
            <p>Talk soon,</p>
            <p><strong>The TechClear Team</strong></p>
            <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />
            <p style="font-size:11px; color:#999;">
              <a href="https://app.hubspot.com/contacts" style="color:#999;">View contact in HubSpot →</a>
            </p>
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
  cohort: string,
  plan: string
) {
  try {
    const planLabel = 'Full Payment ($3,000)'

    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: 'Welcome to TechClear PM + AI Flagship Program',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">Welcome aboard, ${firstName}!</h2>
            <p>Your enrollment in the <strong>TechClear PM + AI Flagship Program</strong> is confirmed. Here are your enrollment details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f4f4f4;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Cohort</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${cohort}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Payment Plan</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${planLabel}</td>
              </tr>
            </table>
            <p>We're so excited to have you in the program. You'll receive onboarding instructions and next steps within the next 24–48 hours.</p>
            <p>If you have any questions or need to reach us, just reply to this email.</p>
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
      subject: `New Waitlist Signup — ${data.firstName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a2e;">New Waitlist Signup</h2>
            <p>Someone just joined the TechClear waitlist.</p>
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
                <td style="padding: 10px; border: 1px solid #ddd;">${data.interest === 'bootcamp' ? 'PM + AI Flagship Program' : 'General Updates'}</td>
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
