import { Metadata } from 'next'
import { Shield, Trash2, Lock, Eye } from 'lucide-react'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Our privacy policy explains how ${siteConfig.name} handles your data, ensures security, and protects your privacy when using our document conversion services.`,
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: 'Data Security',
      content: 'All files uploaded to our service are encrypted using industry-standard SSL/TLS encryption. We use secure servers and follow best practices to protect your data during transmission and processing.',
    },
    {
      icon: Trash2,
      title: 'Automatic File Deletion',
      content: 'Your files are automatically deleted from our servers within 1 hour of upload. We do not store, archive, or retain any of your documents after the conversion process is complete. This ensures your privacy and data security.',
    },
    {
      icon: Lock,
      title: 'No Data Storage',
      content: 'We do not store your personal information or document content. Files are processed in memory and immediately deleted after conversion. We do not maintain any databases of user files or personal data.',
    },
    {
      icon: Eye,
      title: 'No Third-Party Access',
      content: 'We do not share, sell, or provide access to your files to any third parties. Your documents are processed solely for the purpose of conversion and are never used for any other purpose.',
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-600 mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Introduction</h2>
            <p className="text-slate-600 mb-4">
              At {siteConfig.name}, we are committed to protecting your privacy and ensuring the security of your data. 
              This Privacy Policy explains how we collect, use, and protect your information when you use our document 
              conversion services.
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
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Information We Collect</h2>
            <p className="text-slate-600 mb-4">
              We collect minimal information necessary to provide our service:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>Files you upload for conversion (temporarily, deleted within 1 hour)</li>
              <li>Basic usage statistics (anonymized, no personal data)</li>
              <li>Technical information (browser type, IP address for security purposes)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">
              We use the information we collect solely for:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>Processing your document conversions</li>
              <li>Improving our service quality and performance</li>
              <li>Ensuring security and preventing abuse</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Cookies and Tracking</h2>
            <p className="text-slate-600 mb-4">
              We use essential cookies to maintain session state and ensure proper functionality. 
              We may also use analytics cookies (with your consent) to understand how our service is used. 
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Services</h2>
            <p className="text-slate-600 mb-4">
              Our website may display advertisements served by third-party services. These services may use cookies 
              to serve ads based on your prior visits to our website or other websites. You can opt out of personalized 
              advertising through your browser settings or the service provider's settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Rights</h2>
            <p className="text-slate-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>Access information we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt out of non-essential cookies</li>
              <li>File a complaint with relevant data protection authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us through our{' '}
              <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
