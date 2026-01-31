import nodemailer from 'nodemailer'
import { config } from '../config/index.js'

/**
 * Create email transporter
 */
function createTransporter() {
  // Gmail SMTP configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPassword, // Use App Password for Gmail
    },
  })
}

/**
 * Send contact form email
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.subject - Email subject
 * @param {string} contactData.message - Email message
 */
export async function sendContactEmail({ name, email, subject, message }) {
  try {
    const transporter = createTransporter()

    // Email content
    const mailOptions = {
      from: `"${config.siteName}" <${config.emailUser}>`,
      replyTo: email,
      to: config.contactEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #667eea; }
              .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #667eea; }
              .message-box { padding: 15px; background: white; border-radius: 4px; border-left: 3px solid #764ba2; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
                <p>You have received a new message from ${config.siteName}</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">
                  This email was sent from the contact form on ${config.siteName}. 
                  You can reply directly to this email to respond to ${name} at ${email}.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the contact form on ${config.siteName}.
You can reply directly to this email to respond to ${name}.
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log(`[Email Service] Contact email sent successfully. Message ID: ${info.messageId}`)
    
    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('[Email Service] Failed to send contact email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('[Email Service] Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('[Email Service] Email configuration verification failed:', error)
    return false
  }
}
