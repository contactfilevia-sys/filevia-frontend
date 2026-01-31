'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ServicesMenu from './ServicesMenu'
import { siteConfig } from '@/lib/site.config'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-primary-200/70 backdrop-blur-xl relative">
      {/* Background container with overflow hidden for gradients */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient background - highly visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/70 to-purple-50/50" />
        
        {/* Prominent side gradients - more visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 via-transparent to-purple-100/40" />
        
        {/* Radial gradients for depth - highly visible */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_1000x250_at_0%_0%,rgba(99,102,241,0.25),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_1000x250_at_100%_0%,rgba(139,92,246,0.22),transparent_70%)]" />
        
        {/* Center highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_55%)]" />
        
        {/* Top highlight for shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent" />
        
        {/* Visible diagonal pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 12px,
              rgba(99, 102, 241, 0.25) 12px,
              rgba(99, 102, 241, 0.25) 24px
            )`,
          }}
        />
      </div>
      
      {/* Content container with proper z-index - overflow visible for dropdown */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16 lg:h-20 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:brightness-110 group-hover:drop-shadow-lg">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt={`${siteConfig.name} Logo`}
                  fill
                  className="object-contain transition-all duration-300 group-hover:brightness-110"
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg w-full h-full flex items-center justify-center transition-all duration-300 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:shadow-lg">
                  <FileText className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
              )}
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary-500 group-hover:to-primary-700">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-primary-600 font-medium transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/50 text-sm lg:text-base"
              >
                {link.label}
              </Link>
            ))}
            <ServicesMenu />
            <Link
              href="/tools/word-to-pdf"
              className="btn-primary text-sm px-4 py-2 lg:px-6 lg:py-3 whitespace-nowrap"
            >
              Convert Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Mobile backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden pb-4 relative z-50"
              >
                <div className="flex flex-col space-y-3 pt-4 border-t border-primary-100/50">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-slate-700 hover:text-primary-600 font-medium transition-all duration-200 py-2 px-2 rounded-lg hover:bg-white/50 active:bg-white/70"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="md:hidden pt-2 border-t border-primary-100/50">
                    <ServicesMenu onLinkClick={() => setIsMenuOpen(false)} />
                  </div>
                  <Link
                    href="/tools/word-to-pdf"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-sm text-center mt-2"
                  >
                    Convert Now
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
