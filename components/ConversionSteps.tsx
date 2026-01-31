'use client'

import { motion } from 'framer-motion'
import { ConversionStep } from '@/types'
import * as LucideIcons from 'lucide-react'

interface ConversionStepsProps {
  steps: ConversionStep[]
}

export default function ConversionSteps({ steps }: ConversionStepsProps) {
  const IconComponent = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Check
    return Icon
  }

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
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Convert your documents in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = IconComponent(step.icon)
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="glass-card p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
