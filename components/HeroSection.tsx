'use client'

import { motion } from 'framer-motion'
import UploadBox from './UploadBox'
import { siteConfig } from '@/lib/site.config'
import { Shield, Zap, Lock } from 'lucide-react'

export default function HeroSection() {
  const features = [
    { icon: Shield, text: 'Secure Processing' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Lock, text: 'Privacy First' },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50" />
      
      {/* Animated Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)] animate-blob-1" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)] animate-blob-2" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_60%)] animate-blob-3" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-200/20 blur-xl"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
              animation: `float-${i % 3 + 1} ${15 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100/50 rounded-full mb-6"
            >
              <Shield className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Trusted by thousands</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              Convert Files with{' '}
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                {siteConfig.name}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl lg:max-w-none"
            >
              {siteConfig.description}
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm"
                  >
                    <Icon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                  </div>
                )
              })}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-slate-500"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>No Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Auto Delete</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Upload Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10" />
            
            <div className="relative p-3 lg:p-4 shadow-xl rounded-xl backdrop-blur-xl max-w-sm mx-auto lg:max-w-none overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-primary-50/40 border border-orange-200/60"
            >
              {/* Subtle gradient overlay with contrast */}
              <div className="absolute inset-0 opacity-50 pointer-events-none bg-gradient-to-br from-orange-200/30 via-amber-200/20 to-primary-200/20 rounded-xl" />
              
              <div className="mb-3 relative z-10">
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-1 h-5 bg-gradient-to-b from-orange-500 via-amber-500 to-primary-600 rounded-full" />
                  <h3 className="text-lg font-bold bg-gradient-to-r from-orange-700 via-amber-700 to-primary-700 bg-clip-text text-transparent">
                    Get Started Now
                  </h3>
                </div>
                <p className="text-xs text-slate-600 ml-3">Upload your file and convert instantly</p>
              </div>
              
              <UploadBox
                acceptedFormats={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png']}
                conversionType="word-to-pdf"
              />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Supports: Word, PDF, Excel, PPT, Images
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
