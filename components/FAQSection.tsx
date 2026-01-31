'use client'

import { motion } from 'framer-motion'
import FAQAccordion from './FAQAccordion'
import { faqs } from '@/lib/data'

export default function FAQSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about our document conversion service
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={faqs} />
        </div>
      </div>
    </section>
  )
}
