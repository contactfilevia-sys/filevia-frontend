'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Bell } from 'lucide-react'
import { useState } from 'react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
}

export default function ComingSoonModal({ isOpen, onClose, serviceName }: ComingSoonModalProps) {
  const [notifyRequested, setNotifyRequested] = useState(false)

  const handleNotify = () => {
    setNotifyRequested(true)
    setTimeout(() => {
      setNotifyRequested(false)
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-8 max-w-md w-full pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onClose()
                  }
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="bg-gradient-to-br from-amber-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Clock className="w-10 h-10 text-amber-600" />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  Coming Soon
                </h2>

                <p className="text-slate-600 mb-2">
                  <span className="font-semibold">{serviceName}</span> is under active development.
                </p>

                <p className="text-sm text-slate-500 mb-6">
                  This feature will be released soon with higher accuracy and improved conversion quality.
                </p>

                {!notifyRequested ? (
                  <button
                    onClick={handleNotify}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notify Me</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-green-700 font-medium">
                      ✓ We'll notify you when this feature is available!
                    </p>
                  </motion.div>
                )}

                <button
                  onClick={onClose}
                  className="mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
