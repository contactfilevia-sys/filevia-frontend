'use client'

import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

interface AboutValueCardProps {
  icon: string
  title: string
  description: string
  index: number
}

export default function AboutValueCard({ icon, title, description, index }: AboutValueCardProps) {
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Info

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-start space-x-4">
        <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
          <IconComponent className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
