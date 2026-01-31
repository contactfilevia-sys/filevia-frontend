import express from 'express'
import convertRoutes from './convertRoutes.js'
import contactRoutes from './contactRoutes.js'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Document Converter API is running',
    timestamp: new Date().toISOString(),
  })
})

// Conversion routes
router.use('/convert', convertRoutes)

// Contact routes
router.use('/contact', contactRoutes)

export default router
