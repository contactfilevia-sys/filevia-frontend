'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react'
import { siteConfig } from '@/lib/site.config'
import { submitContactForm } from '@/lib/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await submitContactForm(formData)
      
      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      }
    } catch (err: any) {
      console.error('Contact form error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 mb-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Email Us</h3>
                  <p className="text-slate-600 text-sm">
                    {siteConfig.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Response Time</h3>
                  <p className="text-slate-600 text-sm">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {isSubmitted ? (
                <div className="glass-card p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-600">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800">Error</p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="What is this regarding?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                        placeholder="Your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
