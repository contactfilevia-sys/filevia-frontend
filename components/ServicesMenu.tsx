'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { servicesConfig, ServiceConfig } from '@/lib/services.config'
import * as LucideIcons from 'lucide-react'

interface ServicesMenuProps {
  onLinkClick?: () => void
}

export default function ServicesMenu({ onLinkClick }: ServicesMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect desktop vs mobile
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    return () => {
      window.removeEventListener('resize', checkDesktop)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Close menu when clicking outside (mobile only)
  useEffect(() => {
    if (!isDesktop && isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          handleLinkClick()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isDesktop])

  // Reset closing state
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsClosing(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) handleLinkClick()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const activeServices = servicesConfig.filter(s => s.status === 'active')
  const comingSoonServices = servicesConfig.filter(s => s.status === 'coming-soon')

  const getIcon = (iconName: string) => {
    return (LucideIcons as any)[iconName] || FileText
  }

  const handleMouseEnter = () => {
    if (!isDesktop) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsClosing(false)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isDesktop) return
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true)
      setIsOpen(false)
    } else {
      setIsClosing(false)
      setIsOpen(true)
    }
  }

  const handleLinkClick = (e?: React.MouseEvent) => {
    setIsClosing(true)
    setIsOpen(false)

    if (onLinkClick) onLinkClick()

    // Mobile: force immediate hide
    if (!isDesktop) {
      setTimeout(() => {
        const menu = document.querySelector('[data-menu-content]') as HTMLElement | null
        const backdrop = document.querySelector('[data-backdrop]') as HTMLElement | null

        if (menu) {
          menu.style.display = 'none'
          menu.style.opacity = '0'
          menu.style.visibility = 'hidden'
          menu.style.pointerEvents = 'none'
        }

        if (backdrop) {
          backdrop.style.display = 'none'
          backdrop.style.opacity = '0'
        }
      }, 0)
    }
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button */}
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Services menu"
        className="flex items-center justify-between md:justify-start space-x-1.5 px-3 py-2 w-full md:w-auto
                   rounded-lg font-medium text-slate-700 hover:text-primary-600
                   hover:bg-white/80 active:bg-white/90 transition-all duration-200 relative z-10"
      >
        <span className="text-sm md:text-base">Services</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            {!isDesktop && (
              <motion.div
                key="backdrop"
                data-backdrop
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => handleLinkClick()}
              />
            )}

            {/* Menu */}
            <motion.div
              key="menu"
              data-menu-content
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{
                opacity: isClosing ? 0 : 1,
                y: isClosing ? -10 : 0,
                scale: isClosing ? 0.95 : 1,
              }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: isDesktop ? 0.15 : 0.05,
                ease: 'easeOut',
              }}
              className={`absolute top-full mt-2 w-full md:w-64 bg-white border border-slate-200
                          rounded-xl shadow-2xl z-[100] overflow-hidden
                          ${isDesktop ? 'left-0' : 'right-0'}`}
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="p-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {activeServices.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                      Available
                    </h3>
                    <div className="space-y-0.5">
                      {activeServices.map(service => {
                        const Icon = getIcon(service.icon)
                        return (
                          <ServiceLink
                            key={service.slug}
                            service={service}
                            IconComponent={Icon}
                            onClick={handleLinkClick}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}

                {comingSoonServices.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                      Coming Soon
                    </h3>
                    <div className="space-y-0.5">
                      {comingSoonServices.map(service => {
                        const Icon = getIcon(service.icon)
                        return (
                          <ServiceLink
                            key={service.slug}
                            service={service}
                            IconComponent={Icon}
                            onClick={handleLinkClick}
                            disabled
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ServiceLinkProps {
  service: ServiceConfig
  IconComponent: React.ComponentType<{ className?: string }>
  onClick: (e?: React.MouseEvent) => void
  disabled?: boolean
}

function ServiceLink({
  service,
  IconComponent,
  onClick,
  disabled = false,
}: ServiceLinkProps) {
  const getIconColor = () => {
    const slug = service.slug
    if (slug.includes('word-to-pdf')) return 'text-blue-500'
    if (slug.includes('pdf-to-word')) return 'text-red-500'
    if (slug.includes('excel-to-pdf')) return 'text-green-500'
    if (slug.includes('pdf-to-excel')) return 'text-emerald-500'
    if (slug.includes('ppt-to-pdf')) return 'text-orange-500'
    if (slug.includes('pdf-to-ppt')) return 'text-amber-500'
    if (slug.includes('image-to-pdf')) return 'text-purple-500'
    if (slug.includes('pdf-to-image')) return 'text-pink-500'
    return 'text-primary-500'
  }

  const iconColorClass = getIconColor()

  const content = (
    <div
      className={`flex items-center space-x-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:bg-primary-50 hover:shadow-sm cursor-pointer active:bg-primary-100'
      }`}
    >
      <div
        className={`p-1.5 rounded-md bg-white flex-shrink-0 border transition-all ${
          disabled ? 'border-slate-200' : 'border-transparent group-hover:border-primary-200'
        }`}
      >
        <IconComponent
          className={`w-3.5 h-3.5 ${
            disabled ? 'text-slate-400' : iconColorClass
          }`}
        />
      </div>

      <div className="flex-1 min-w-0 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-800 truncate">
          {service.name}
        </p>
        {disabled && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full ml-2">
            Soon
          </span>
        )}
      </div>
    </div>
  )

  if (disabled) {
    return (
      <div
        className="group"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {content}
      </div>
    )
  }

  return (
    <Link
      href={`/tools/${service.slug}`}
      onClick={(e) => onClick(e)}
      className="group block"
    >
      {content}
    </Link>
  )
}
