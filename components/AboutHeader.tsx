'use client'

import { motion } from 'framer-motion'

interface AboutHeaderProps {
  siteName: string
}

export default function AboutHeader({ siteName }: AboutHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
        About {siteName}
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        We're on a mission to make document conversion simple, fast, and secure for everyone.
      </p>
    </motion.div>
  )
}
