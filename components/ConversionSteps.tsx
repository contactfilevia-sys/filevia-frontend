'use client'

import { motion } from 'framer-motion'
import { ConversionStep } from '@/types'
import * as LucideIcons from 'lucide-react'
import { useEffect, useState } from 'react'

interface ConversionStepsProps {
  steps: ConversionStep[]
}

export default function ConversionSteps({ steps }: ConversionStepsProps) {
  const [particles, setParticles] = useState<
    { left: string; top: string }[]
  >([])

  useEffect(() => {
    const generated = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
    setParticles(generated)
  }, [])

  const IconComponent = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Check
    return Icon
  }

  return (
    <section className="relative py-20 bg-white/50 overflow-hidden">
      
      {/* ✅ Safe Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-primary-300/40 rounded-full"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-20, -80, -20],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.4
            }}
            style={{
              left: p.left,
              top: p.top
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Convert your documents in three simple steps
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">

          <div className="hidden md:block absolute top-20 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {steps.map((step, index) => {
            const Icon = IconComponent(step.icon)

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex justify-center h-full"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative max-w-xs w-full h-full"
                >
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/40 via-primary-200/30 to-transparent blur-[3px]" />

                  <div className="relative h-full flex flex-col justify-between p-7 rounded-2xl backdrop-blur-lg bg-white/70 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300">

                    <div>
                      <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md">
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <div className="bg-primary-100 text-primary-700 w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold text-sm">
                        {step.step}
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 mb-3">
                        {step.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
