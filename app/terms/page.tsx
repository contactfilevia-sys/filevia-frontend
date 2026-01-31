import { Metadata } from 'next'
import { FileText, AlertCircle, Shield, Ban } from 'lucide-react'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Read our terms and conditions for using ${siteConfig.name}. Understand your rights and responsibilities when using our platform.`,
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: `By accessing and using ${siteConfig.name}, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.`,
    },
    {
      icon: AlertCircle,
      title: 'Service Usage',
      content: 'You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that any content you upload does not violate any laws or infringe on any rights of third parties.',
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      content: `All content, features, and functionality of our service are owned by ${siteConfig.name} and are protected by international copyright, trademark, and other intellectual property laws.`,
    },
    {
      icon: Ban,
      title: 'Prohibited Uses',
      content: 'You may not use our service to upload, convert, or process any content that is illegal, harmful, threatening, abusive, or violates any applicable laws or regulations.',
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-lg text-slate-600 mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Introduction</h2>
            <p className="text-slate-600 mb-4">
              Welcome to {siteConfig.name}. These Terms and Conditions govern your use of our document conversion 
              service. By using our service, you agree to comply with and be bound by these terms.
            </p>
          </section>

          <div className="space-y-8 mb-12">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <div key={index} className="glass-card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{section.title}</h3>
                      <p className="text-slate-600">{section.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Service Availability</h2>
            <p className="text-slate-600 mb-4">
              We strive to provide a reliable service, but we do not guarantee that our service will be 
              available at all times. We reserve the right to modify, suspend, or discontinue any part of 
              our service at any time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">File Processing</h2>
            <p className="text-slate-600 mb-4">
              We process your files for conversion purposes only. Files are automatically deleted within 1 hour 
              of upload. We are not responsible for any loss of data or files. It is your responsibility to 
              download converted files promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 mb-4">
              {siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use or inability to use our service. Our total liability 
              shall not exceed the amount you paid for the service, if any.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">User Responsibilities</h2>
            <p className="text-slate-600 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>Ensuring you have the right to upload and convert the files you submit</li>
              <li>Complying with all applicable laws and regulations</li>
              <li>Maintaining the confidentiality of your account information (if applicable)</li>
              <li>Not using the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Modifications to Terms</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the service after changes are posted constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Governing Law</h2>
            <p className="text-slate-600 mb-4">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard 
              to conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about these Terms & Conditions, please contact us through our{' '}
              <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
