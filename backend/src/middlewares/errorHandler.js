import multer from 'multer'

/**
 * Global error handler middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: `File size exceeds maximum allowed size of ${req.app.get('maxFileSize') / 1024 / 1024}MB`,
      })
    }
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message: err.message,
    })
  }

  // Validation errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: err.message,
    })
  }

  // Conversion errors
  if (err.message && (err.message.includes('conversion failed') || err.message.includes('timeout'))) {
    return res.status(500).json({
      success: false,
      error: 'Conversion failed',
      message: err.message,
    })
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred while processing your request',
  })
}
