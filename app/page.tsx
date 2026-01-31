import { Metadata } from 'next'
import HeroSection from '@/components/HeroSection'
import ToolsSection from '@/components/ToolsSection'
import ConversionSteps from '@/components/ConversionSteps'
import TrustSection from '@/components/TrustSection'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'
import AdPlaceholder from '@/components/AdPlaceholder'
import { conversionSteps } from '@/lib/data'
import { getActiveServices } from '@/lib/services.config'
import { seoConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <AdPlaceholder variant="banner" />
      </section>

      <ToolsSection />

      <ConversionSteps steps={conversionSteps} />

      <TrustSection />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdPlaceholder variant="banner" />
      </section>

      <FAQSection />

      <CTASection />
    </>
  )
}
