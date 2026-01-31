# Filevia - Document Conversion Platform

A production-ready, fully responsive document conversion platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🚀 Next.js 14+ with App Router
- 📱 Fully responsive design
- 🎨 Modern UI with glassmorphism effects
- ⚡ Framer Motion animations
- 🔍 SEO optimized
- 📄 Multiple conversion tools (Word, PDF, Excel, PPT, Images)
- 🛡️ Privacy-focused (auto file deletion)
- 📊 Google AdSense ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── about/
│   ├── contact/
│   ├── privacy/
│   ├── terms/
│   ├── tools/
│   │   └── [slug]/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── AdPlaceholder.tsx
│   ├── ConversionSteps.tsx
│   ├── FAQAccordion.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ToolCard.tsx
│   ├── ToolPageContent.tsx
│   └── UploadBox.tsx
├── lib/
│   └── data.ts
├── types/
│   └── index.ts
└── package.json
```

## Available Tools

- Word to PDF
- PDF to Word
- Excel to PDF
- PDF to Excel
- PPT to PDF
- PDF to PPT
- Image to PDF
- PDF to Image

## Deployment

The project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy

## License

MIT
