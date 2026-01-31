'use client'

import Link from 'next/link'
import { FileSearch, Home, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { servicesConfig, getActiveServices } from '@/lib/services.config'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-primary-500 to-purple-500 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <FileSearch className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-slate-800 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-slate-600 mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary inline-flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>

            <div className="mt-12 glass-card p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Popular Tools</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {getActiveServices().slice(0, 4).map((service, index, array) => (
                  <span key={service.slug}>
                    <Link 
                      href={`/tools/${service.slug}`} 
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {service.name}
                    </Link>
                    {index < array.length - 1 && <span className="text-slate-300 mx-2">•</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
