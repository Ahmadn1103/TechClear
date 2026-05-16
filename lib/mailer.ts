import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

const INTEREST_LABELS: Record<string, string> = {
  bootcamp: 'PM + AI Flagship Program',
  general: 'General Updates',
}

export async function sendInternalNotification(data: {
  firstName: string
  email: string
  phone?: string
  interest?: string
}) {
  const interestLabel = data.interest ? (INTEREST_LABELS[data.interest] ?? data.interest) : 'Not specified'

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: ['abdullah.r52@gmail.com', 'contact@techclear.org'],
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
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Area of Interest</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${interestLabel}</td>
            </tr>
          </table>
          <p><a href="https://app.hubspot.com" style="color: #1a1a2e; font-weight: bold;">View in HubSpot →</a></p>
        </body>
      </html>
    `,
  })

  console.log('[Resend] Internal notification sent')
}
