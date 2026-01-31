import { Tool } from '@/types'

export const tools: Tool[] = [
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Microsoft Word documents to PDF format',
    fromFormat: 'DOC, DOCX',
    toFormat: 'PDF',
    icon: 'FileText',
    color: 'from-blue-500 to-blue-600',
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    fromFormat: 'PDF',
    toFormat: 'DOC, DOCX',
    icon: 'FileText',
    color: 'from-red-500 to-red-600',
  },
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF format',
    fromFormat: 'XLS, XLSX',
    toFormat: 'PDF',
    icon: 'Table',
    color: 'from-green-500 to-green-600',
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Convert PDF tables to Excel spreadsheets',
    fromFormat: 'PDF',
    toFormat: 'XLS, XLSX',
    icon: 'Table',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    slug: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    fromFormat: 'PPT, PPTX',
    toFormat: 'PDF',
    icon: 'Presentation',
    color: 'from-orange-500 to-orange-600',
  },
  {
    slug: 'pdf-to-ppt',
    name: 'PDF to PPT',
    description: 'Convert PDF files to PowerPoint presentations',
    fromFormat: 'PDF',
    toFormat: 'PPT, PPTX',
    icon: 'Presentation',
    color: 'from-amber-500 to-amber-600',
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG images to PDF documents',
    fromFormat: 'JPG, PNG',
    toFormat: 'PDF',
    icon: 'Image',
    color: 'from-purple-500 to-purple-600',
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF pages to JPG or PNG images',
    fromFormat: 'PDF',
    toFormat: 'JPG, PNG',
    icon: 'Image',
    color: 'from-pink-500 to-pink-600',
  },
]

export const conversionSteps = [
  {
    step: 1,
    title: 'Upload Your File',
    description: 'Drag and drop your document or click to browse. We support all major file formats.',
    icon: 'Upload',
  },
  {
    step: 2,
    title: 'Convert Instantly',
    description: 'Our advanced engine processes your file securely in seconds with high quality output.',
    icon: 'Zap',
  },
  {
    step: 3,
    title: 'Download Result',
    description: 'Get your converted file immediately. Files are automatically deleted after 1 hour.',
    icon: 'Download',
  },
]

export const faqs = [
  {
    question: 'Is my data secure?',
    answer: 'Yes, absolutely. All files are processed securely and automatically deleted after 1 hour. We never store or share your documents.',
  },
  {
    question: 'What file sizes are supported?',
    answer: 'We support files up to 100MB in size. For larger files, please contact us for assistance.',
  },
  {
    question: 'How long does conversion take?',
    answer: 'Most conversions complete in under 30 seconds. Complex files may take up to 2 minutes.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account required. You can convert files instantly without any registration.',
  },
  {
    question: 'What formats are supported?',
    answer: 'We support Word (DOC, DOCX), PDF, Excel (XLS, XLSX), PowerPoint (PPT, PPTX), and images (JPG, PNG).',
  },
  {
    question: 'Are there any usage limits?',
    answer: 'Standard users can convert multiple files per day. Contact us for enterprise plans with higher limits.',
  },
]
