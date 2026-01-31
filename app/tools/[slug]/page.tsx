import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { servicesConfig, getServiceBySlug } from '@/lib/services.config'
import ToolPageContent from '@/components/ToolPageContent'
import { siteConfig } from '@/lib/site.config'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return servicesConfig.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getServiceBySlug(slug)

  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  const title = `${tool.name} Converter | ${siteConfig.name}`
  const description = tool.status === 'active'
    ? `${tool.description}. Convert ${tool.fromFormat} files to ${tool.toFormat} format securely and efficiently with ${siteConfig.name}.`
    : `${tool.description}. Coming soon - This feature is under active development.`

  return {
    title,
    description,
    keywords: [
      tool.name.toLowerCase(),
      `${tool.fromFormat.toLowerCase()} to ${tool.toFormat.toLowerCase()}`,
      'document converter',
      'file conversion',
      siteConfig.name.toLowerCase(),
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = getServiceBySlug(slug)

  if (!tool) {
    notFound()
  }

  // Get related tools (exclude current tool)
  const relatedTools = servicesConfig
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 4)

  return <ToolPageContent tool={tool} relatedTools={relatedTools} />
}
