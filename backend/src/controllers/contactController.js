import { sendContactEmail } from '../services/emailService.js'

/**
 * Handle contact form submission
 */
export async function handleContactSubmission(req, res) {
  try {
    const { name, email, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please fill in all required fields (name, email, subject, message).',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address.',
      })
    }

    // Sanitize inputs (basic sanitization)
    const sanitizedName = name.trim().substring(0, 100)
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255)
    const sanitizedSubject = subject.trim().substring(0, 200)
    const sanitizedMessage = message.trim().substring(0, 5000)

    // Send email
    const result = await sendContactEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
    })

    console.log(`[Contact Controller] Contact form submitted by ${sanitizedName} (${sanitizedEmail})`)

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('[Contact Controller] Error processing contact submission:', error)

    return res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: 'An error occurred while sending your message. Please try again later or contact us directly via email.',
    })
  }
}
