'use client'

import { motion } from 'framer-motion'
import { ServiceConfig } from '@/lib/services.config'
import * as LucideIcons from 'lucide-react'
import UploadBox from './UploadBox'
import AdPlaceholder from './AdPlaceholder'
import ToolCard from './ToolCard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { servicesConfig } from '@/lib/services.config'
import ComingSoonModal from './ComingSoonModal'
import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/site.config'

interface ToolPageContentProps {
  tool: ServiceConfig
  relatedTools: ServiceConfig[]
}

export default function ToolPageContent({ tool, relatedTools }: ToolPageContentProps) {
  const [showModal, setShowModal] = useState(false)
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.FileText
  const isActive = tool.status === 'active'

  // Don't auto-open modal - let user click to see it

  // Get accepted formats from service config
  const getAcceptedFormats = () => {
    return tool.supportedFormats.input
  }

  const instructions = [
    `Select your ${tool.fromFormat} file using the upload box above`,
    `Click "Convert Now" to start the conversion process`,
    `Wait a few seconds for the conversion to complete`,
    `Download your converted ${tool.toFormat} file`,
  ]

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`
                  bg-white p-4 rounded-xl border-2 shadow-md
                  ${
                    tool.slug.includes('word-to-pdf') ? 'border-blue-200' :
                    tool.slug.includes('pdf-to-word') ? 'border-red-200' :
                    tool.slug.includes('excel-to-pdf') ? 'border-green-200' :
                    tool.slug.includes('pdf-to-excel') ? 'border-emerald-200' :
                    tool.slug.includes('ppt-to-pdf') ? 'border-orange-200' :
                    tool.slug.includes('pdf-to-ppt') ? 'border-amber-200' :
                    tool.slug.includes('image-to-pdf') ? 'border-purple-200' :
                    tool.slug.includes('pdf-to-image') ? 'border-pink-200' :
                    'border-primary-200'
                  }
                `}>
                  <IconComponent className={`
                    w-8 h-8
                    ${
                      tool.slug.includes('word-to-pdf') ? 'text-blue-600' :
                      tool.slug.includes('pdf-to-word') ? 'text-red-600' :
                      tool.slug.includes('excel-to-pdf') ? 'text-green-600' :
                      tool.slug.includes('pdf-to-excel') ? 'text-emerald-600' :
                      tool.slug.includes('ppt-to-pdf') ? 'text-orange-600' :
                      tool.slug.includes('pdf-to-ppt') ? 'text-amber-600' :
                      tool.slug.includes('image-to-pdf') ? 'text-purple-600' :
                      tool.slug.includes('pdf-to-image') ? 'text-pink-600' :
                      'text-primary-600'
                    }
                  `} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                    {tool.name} Converter
                  </h1>
                  <p className="text-slate-600 mt-1">{tool.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Upload Box */}
            {isActive ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <UploadBox 
                  acceptedFormats={getAcceptedFormats()} 
                  conversionType={tool.slug}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <div className="glass-card p-12 text-center border-2 border-dashed border-slate-300 opacity-75">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Coming Soon</h3>
                  <p className="text-slate-500 mb-4">
                    This conversion service is under active development and will be released soon with higher accuracy.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setShowModal(true)
                      }
                    }}
                    className="btn-secondary"
                    aria-label="Learn more about this coming soon feature"
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            )}

            {/* Ad Banner */}
            <div className="mb-8">
              <AdPlaceholder variant="inline" />
            </div>

            {/* Conversion Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About {tool.name} Conversion</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Convert your {tool.fromFormat} files to {tool.toFormat} format quickly and securely with {siteConfig.name}. 
                  Our advanced conversion engine ensures high-quality output while maintaining the original 
                  formatting and structure of your documents.
                </p>
                {!isActive && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                      <span className="mr-2">🚧</span>
                      Coming Soon
                    </h3>
                    <p className="text-sm text-amber-700">
                      This feature is under active development and will be released soon with higher accuracy and improved conversion quality.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">Supported Formats</h3>
                    <p className="text-sm text-slate-600">
                      Input: {tool.fromFormat}<br />
                      Output: {tool.toFormat}
                    </p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">File Size Limit</h3>
                    <p className="text-sm text-slate-600">Maximum 100MB per file</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Convert</h2>
              <ol className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-slate-600 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Ad Banner */}
            <div className="mb-8">
              <AdPlaceholder variant="inline" />
            </div>

            {/* Related Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTools.map((relatedTool, index) => (
                  <ToolCard key={relatedTool.slug} tool={relatedTool} index={index} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Sidebar Ad */}
              <AdPlaceholder variant="sidebar" />

              {/* Quick Links */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-slate-800 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {servicesConfig.slice(0, 5).map((service) => (
                    <li key={service.slug}>
                      {service.status === 'active' ? (
                        <Link
                          href={`/tools/${service.slug}`}
                          className={`text-sm block py-2 px-3 rounded-lg transition-colors ${
                            service.slug === tool.slug
                              ? 'bg-primary-100 text-primary-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {service.name}
                        </Link>
                      ) : (
                        <span className="text-sm block py-2 px-3 rounded-lg text-slate-400 cursor-not-allowed">
                          {service.name}
                          <span className="ml-2 text-xs text-amber-600">(Soon)</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceName={tool.name}
      />
    </div>
  )
}
