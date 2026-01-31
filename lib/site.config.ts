/**
 * Site configuration - Centralized branding and metadata
 */

export const siteConfig = {
  name: 'Filevia',
  tagline: 'Modern document conversion platform',
  description: 'Filevia is a modern platform for converting documents, images, and files securely and efficiently.',
  shortDescription: 'Convert documents, images, and files securely and efficiently.',
  url: 'https://filevia.com',
  email: 'contact.filevia@gmail.com',
  author: 'Filevia',
  copyright: 'Filevia',
} as const

export const seoConfig = {
  defaultTitle: 'Filevia | Secure Document Conversion Platform',
  titleTemplate: '%s | Filevia',
  defaultDescription: siteConfig.description,
  keywords: [
    'filevia',
    'document converter',
    'file conversion',
    'pdf converter',
    'secure file conversion',
    'document processing',
    'file converter',
  ],
} 
