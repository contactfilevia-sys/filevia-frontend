import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import { initializeDirectories } from './utils/fileUtils.js'
import { startCleanupScheduler } from './utils/cleanup.js'
import { errorHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'
import { verifyEmailConfig } from './services/emailService.js'

const app = express()

// Initialize directories
await initializeDirectories()

// Middlewares
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Store max file size in app for error handler
app.set('maxFileSize', config.maxFileSize)

// Routes
app.use('/api', routes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Document Converter API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      conversions: [
        '/api/convert/word-to-pdf',
        '/api/convert/pdf-to-word',
        '/api/convert/excel-to-pdf',
        '/api/convert/pdf-to-excel',
        '/api/convert/ppt-to-pdf',
        '/api/convert/pdf-to-ppt',
        '/api/convert/image-to-pdf',
        '/api/convert/pdf-to-image',
      ],
    },
  })
})

// Error handler (must be last)
app.use(errorHandler)

// Start cleanup scheduler
startCleanupScheduler()

// Verify email configuration on startup
if (config.emailUser && config.emailPassword) {
  verifyEmailConfig().then((isValid) => {
    if (isValid) {
      console.log(`✅ Email service configured. Contact emails will be sent to: ${config.contactEmail}`)
    } else {
      console.warn(`⚠️  Email service configuration invalid. Contact form emails may not work.`)
    }
  })
} else {
  console.warn(`⚠️  Email credentials not configured. Contact form emails will not work.`)
  console.warn(`   Please set EMAIL_USER and EMAIL_PASSWORD environment variables.`)
}

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Document Converter API running on port ${config.port}`)
  console.log(`📁 Upload directory: ${config.tmpUploadDir}`)
  console.log(`📁 Output directory: ${config.tmpOutputDir}`)
  console.log(`🧹 Cleanup interval: ${config.cleanupInterval / 1000}s`)
  console.log(`⏱️  File retention: ${config.fileRetentionTime / 1000}s`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

export default app
