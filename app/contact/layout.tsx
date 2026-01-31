import { Metadata } from 'next'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${siteConfig.name}. We're here to help with any questions, feedback, or support requests.`,
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
