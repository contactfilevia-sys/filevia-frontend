'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getActiveServices } from '@/lib/services.config'
import { siteConfig } from '@/lib/site.config'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Convert Your Documents?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start converting your files securely and efficiently with {siteConfig.name}.
          </p>
            <Link 
              href={`/tools/${getActiveServices()[0]?.slug || 'word-to-pdf'}`} 
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
        </motion.div>
      </div>
    </section>
  )
}
