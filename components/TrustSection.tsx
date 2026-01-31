'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Zap } from 'lucide-react'

export default function TrustSection() {
  return (
    <section className="py-16 bg-white/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Why Trust Us?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 text-center"
          >
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">100% Secure</h3>
            <p className="text-slate-600">
              All files are encrypted and automatically deleted after 1 hour. We never store your documents.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 text-center"
          >
            <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">Lightning Fast</h3>
            <p className="text-slate-600">
              Most conversions complete in under 30 seconds. No waiting, no delays.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 text-center"
          >
            <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">Auto Deletion</h3>
            <p className="text-slate-600">
              Files are automatically removed from our servers after 1 hour. Your privacy is our priority.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
