import { Tool } from '@/types'

export type ServiceStatus = 'active' | 'coming-soon'

export interface ServiceConfig extends Tool {
  status: ServiceStatus
  apiEndpoint: string
  supportedFormats: {
    input: string[]
    output: string[]
  }
}

export const servicesConfig: ServiceConfig[] = [
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Microsoft Word documents to PDF format',
    fromFormat: 'DOC, DOCX',
    toFormat: 'PDF',
    icon: 'FileText',
    color: 'from-blue-500 to-blue-600',
    status: 'active',
    apiEndpoint: '/api/convert/word-to-pdf',
    supportedFormats: {
      input: ['.doc', '.docx'],
      output: ['.pdf'],
    },
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    fromFormat: 'PDF',
    toFormat: 'DOC, DOCX',
    icon: 'FileText',
    color: 'from-red-500 to-red-600',
    status: 'coming-soon',
    apiEndpoint: '/api/convert/pdf-to-word',
    supportedFormats: {
      input: ['.pdf'],
      output: ['.docx'],
    },
  },
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF format',
    fromFormat: 'XLS, XLSX',
    toFormat: 'PDF',
    icon: 'Table',
    color: 'from-green-500 to-green-600',
    status: 'active',
    apiEndpoint: '/api/convert/excel-to-pdf',
    supportedFormats: {
      input: ['.xls', '.xlsx'],
      output: ['.pdf'],
    },
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Convert PDF tables to Excel spreadsheets',
    fromFormat: 'PDF',
    toFormat: 'XLS, XLSX',
    icon: 'Table',
    color: 'from-emerald-500 to-emerald-600',
    status: 'coming-soon',
    apiEndpoint: '/api/convert/pdf-to-excel',
    supportedFormats: {
      input: ['.pdf'],
      output: ['.xlsx'],
    },
  },
  {
    slug: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    fromFormat: 'PPT, PPTX',
    toFormat: 'PDF',
    icon: 'Presentation',
    color: 'from-orange-500 to-orange-600',
    status: 'active',
    apiEndpoint: '/api/convert/ppt-to-pdf',
    supportedFormats: {
      input: ['.ppt', '.pptx'],
      output: ['.pdf'],
    },
  },
  {
    slug: 'pdf-to-ppt',
    name: 'PDF to PPT',
    description: 'Convert PDF files to PowerPoint presentations',
    fromFormat: 'PDF',
    toFormat: 'PPT, PPTX',
    icon: 'Presentation',
    color: 'from-amber-500 to-amber-600',
    status: 'coming-soon',
    apiEndpoint: '/api/convert/pdf-to-ppt',
    supportedFormats: {
      input: ['.pdf'],
      output: ['.pptx'],
    },
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG images to PDF documents',
    fromFormat: 'JPG, PNG',
    toFormat: 'PDF',
    icon: 'Image',
    color: 'from-purple-500 to-purple-600',
    status: 'active',
    apiEndpoint: '/api/convert/image-to-pdf',
    supportedFormats: {
      input: ['.jpg', '.jpeg', '.png'],
      output: ['.pdf'],
    },
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF pages to JPG or PNG images',
    fromFormat: 'PDF',
    toFormat: 'JPG, PNG',
    icon: 'Image',
    color: 'from-pink-500 to-pink-600',
    status: 'active',
    apiEndpoint: '/api/convert/pdf-to-image',
    supportedFormats: {
      input: ['.pdf'],
      output: ['.png', '.jpg'],
    },
  },
]

// Helper functions
export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return servicesConfig.find((service) => service.slug === slug)
}

export function isServiceActive(slug: string): boolean {
  const service = getServiceBySlug(slug)
  return service?.status === 'active'
}

export function getActiveServices(): ServiceConfig[] {
  return servicesConfig.filter((service) => service.status === 'active')
}

export function getComingSoonServices(): ServiceConfig[] {
  return servicesConfig.filter((service) => service.status === 'coming-soon')
}
