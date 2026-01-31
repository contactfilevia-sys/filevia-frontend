'use client'

import { motion } from 'framer-motion'

interface AdPlaceholderProps {
  variant?: 'banner' | 'sidebar' | 'inline'
  className?: string
}

export default function AdPlaceholder({ variant = 'banner', className = '' }: AdPlaceholderProps) {
  const dimensions = {
    banner: 'w-full h-24 md:h-32',
    sidebar: 'w-full h-[600px]',
    inline: 'w-full h-32 md:h-40',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${dimensions[variant]} ${className}`}
    >
      <div className="glass-card w-full h-full flex items-center justify-center border-2 border-dashed border-primary-200">
        <div className="text-center p-4">
          <p className="text-xs text-slate-500 font-medium">Advertisement</p>
          <p className="text-xs text-slate-400 mt-1">
            {variant === 'banner' && '728 x 90'}
            {variant === 'sidebar' && '300 x 600'}
            {variant === 'inline' && '728 x 90'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
