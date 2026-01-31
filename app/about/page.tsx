import { Metadata } from 'next'
import AboutHeader from '@/components/AboutHeader'
import AboutValueCard from '@/components/AboutValueCard'
import { siteConfig, seoConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.name} - ${siteConfig.shortDescription}`,
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: 'Shield',
      title: 'Security First',
      description: 'Your privacy and data security are our top priorities. We use industry-standard encryption and automatically delete all files.',
    },
    {
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'We understand that time is valuable. Our optimized conversion engine processes files in seconds, not minutes.',
    },
    {
      icon: 'Users',
      title: 'User-Focused',
      description: 'We built this platform with users in mind. Simple, effective document conversion without unnecessary complexity.',
    },
    {
      icon: 'Target',
      title: 'Quality Results',
      description: 'We maintain the highest standards for conversion quality, ensuring your documents look perfect after conversion.',
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <AboutHeader siteName={siteConfig.name} />

        <div className="prose prose-slate max-w-none mb-16">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h2>
            <p className="text-slate-600 mb-4">
              {siteConfig.name} was founded with a simple goal: to provide the best document conversion experience 
              possible. We recognized that existing solutions were either too slow, too expensive, or didn't 
              prioritize user privacy. So we built something better.
            </p>
            <p className="text-slate-600 mb-4">
              Today, we serve thousands of users worldwide, helping them convert documents quickly and securely. 
              Our commitment to privacy, speed, and quality has made us a trusted choice for individuals and 
              businesses alike.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <AboutValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  index={index}
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li><strong>Secure Processing:</strong> Enterprise-grade security for all conversions</li>
              <li><strong>No Registration Required:</strong> Start converting immediately without creating an account</li>
              <li><strong>Privacy-Focused:</strong> Files are automatically deleted within 1 hour</li>
              <li><strong>Fast Processing:</strong> Most conversions complete in under 30 seconds</li>
              <li><strong>High Quality:</strong> Maintain formatting and structure during conversion</li>
              <li><strong>Multiple Formats:</strong> Support for Word, PDF, Excel, PPT, and Images</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Commitment</h2>
            <p className="text-slate-600 mb-4">
              We are committed to continuously improving our service and adding new features based on user feedback. 
              Your trust is important to us, and we work hard to maintain the highest standards of security, 
              privacy, and service quality.
            </p>
            <p className="text-slate-600">
              If you have any questions, suggestions, or feedback, please don't hesitate to{' '}
              <a href="/contact" className="text-primary-600 hover:underline">contact us</a>. 
              We'd love to hear from you!
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
