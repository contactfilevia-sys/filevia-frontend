'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ServiceConfig } from '@/lib/services.config'
import * as LucideIcons from 'lucide-react'
import { useState } from 'react'
import ComingSoonModal from './ComingSoonModal'

interface ToolCardProps {
  tool: ServiceConfig
  index?: number
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const [showModal, setShowModal] = useState(false)
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.FileText
  const isActive = tool.status === 'active'

  // Get icon color and border color based on service type
  const getIconStyles = () => {
    const slug = tool.slug
    if (slug.includes('word-to-pdf')) return { icon: 'text-blue-600', border: 'border-blue-200 group-hover:border-blue-300' }
    if (slug.includes('pdf-to-word')) return { icon: 'text-red-600', border: 'border-red-200 group-hover:border-red-300' }
    if (slug.includes('excel-to-pdf')) return { icon: 'text-green-600', border: 'border-green-200 group-hover:border-green-300' }
    if (slug.includes('pdf-to-excel')) return { icon: 'text-emerald-600', border: 'border-emerald-200 group-hover:border-emerald-300' }
    if (slug.includes('ppt-to-pdf')) return { icon: 'text-orange-600', border: 'border-orange-200 group-hover:border-orange-300' }
    if (slug.includes('pdf-to-ppt')) return { icon: 'text-amber-600', border: 'border-amber-200 group-hover:border-amber-300' }
    if (slug.includes('image-to-pdf')) return { icon: 'text-purple-600', border: 'border-purple-200 group-hover:border-purple-300' }
    if (slug.includes('pdf-to-image')) return { icon: 'text-pink-600', border: 'border-pink-200 group-hover:border-pink-300' }
    return { icon: 'text-primary-600', border: 'border-primary-200 group-hover:border-primary-300' }
  }

  const iconStyles = getIconStyles()

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) {
      e.preventDefault()
      setShowModal(true)
    }
  }

  const cardContent = (
    <div
      className={`
        glass-card p-4 transition-all duration-300 group h-full flex flex-col min-h-[200px]
        ${isActive 
          ? 'hover:shadow-xl cursor-pointer hover:-translate-y-0.5' 
          : 'opacity-75 blur-[0.5px] cursor-not-allowed hover:shadow-md'
        }
      `}
      onClick={handleClick}
    >
      <div className="flex flex-col h-full">
        {/* Prominent Icon Section */}
        <div className="flex items-center justify-center mb-3">
          <div className={`
            relative bg-white p-2.5 rounded-xl transition-all duration-300 border-2 shadow-sm
            ${isActive 
              ? `group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-md ${iconStyles.border}` 
              : 'opacity-60 border-slate-200'
            }
          `}>
            {/* Glow effect on hover */}
            {isActive && (
              <div className={`
                absolute inset-0 bg-gradient-to-br ${tool.color} rounded-xl opacity-0
                group-hover:opacity-15 blur-lg transition-opacity duration-300 -z-10
              `} />
            )}
            {/* Colorful icon based on service type */}
            <IconComponent className={`w-6 h-6 transition-all duration-300 ${
              isActive ? 'group-hover:scale-110' : ''
            } ${iconStyles.icon}`} />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 justify-center flex-wrap">
              <h3 className={`
                text-base font-bold transition-colors duration-200 text-center
                ${isActive 
                  ? 'text-slate-800 group-hover:text-primary-600' 
                  : 'text-slate-600'
                }
              `}>
                {tool.name}
              </h3>
              {!isActive && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                  Soon
                </span>
              )}
            </div>
            <p className={`text-xs mt-1 text-center overflow-hidden ${isActive ? 'text-slate-600' : 'text-slate-500'}`} style={{
              maxHeight: '2.5rem',
              lineHeight: '1.25rem',
            }}>
              {tool.description}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-1.5 mt-3">
            <span className={`
              text-xs font-medium px-2 py-1 rounded-md
              ${isActive 
                ? 'text-slate-600 bg-slate-100 border border-slate-200' 
                : 'text-slate-400 bg-slate-50'
              }
            `}>
              {tool.fromFormat}
            </span>
            <span className={`text-sm font-bold ${isActive ? 'text-primary-500' : 'text-slate-300'}`}>→</span>
            <span className={`
              text-xs font-medium px-2 py-1 rounded-md
              ${isActive 
                ? 'text-primary-700 bg-primary-50 border border-primary-200' 
                : 'text-slate-400 bg-slate-50'
              }
            `}>
              {tool.toFormat}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        title={!isActive ? 'Coming soon' : undefined}
        role={!isActive ? 'button' : undefined}
        tabIndex={!isActive ? 0 : undefined}
        onKeyDown={(e) => {
          if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setShowModal(true)
          }
        }}
        aria-label={!isActive ? `${tool.name} - Coming soon` : undefined}
      >
        {isActive ? (
          <Link href={`/tools/${tool.slug}`} className="block">
            {cardContent}
          </Link>
        ) : (
          cardContent
        )}
      </motion.div>

      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceName={tool.name}
      />
    </>
  )
}
