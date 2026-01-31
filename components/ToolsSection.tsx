'use client'

import { motion } from 'framer-motion'
import ToolCard from './ToolCard'
import { servicesConfig } from '@/lib/services.config'

export default function ToolsSection() {
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
            All Conversion Tools
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our wide range of document conversion tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicesConfig.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
