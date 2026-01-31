import Link from 'next/link'
import { FileText } from 'lucide-react'
import { servicesConfig } from '@/lib/services.config'
import { siteConfig } from '@/lib/site.config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    tools: servicesConfig.slice(0, 4).map(service => ({
      href: `/tools/${service.slug}`,
      label: service.name,
    })),
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
    ],
  }

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-slate-400">
              {siteConfig.shortDescription}
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Conversion Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Badge */}
          <div>
            <h3 className="text-white font-semibold mb-4">Security & Privacy</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>✓ SSL Encrypted</li>
              <li>✓ Auto File Deletion</li>
              <li>✓ No Storage</li>
              <li>✓ GDPR Compliant</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              © {currentYear} {siteConfig.copyright}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
