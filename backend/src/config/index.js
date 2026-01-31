import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024, // 20MB default
  cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL) || 10 * 60 * 1000, // 10 minutes
  fileRetentionTime: parseInt(process.env.FILE_RETENTION_TIME) || 15 * 60 * 1000, // 15 minutes
  tmpUploadDir: process.env.TMP_UPLOAD_DIR || './tmp/uploads',
  tmpOutputDir: process.env.TMP_OUTPUT_DIR || './tmp/outputs',
  // Email configuration
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '', // Gmail App Password
  contactEmail: process.env.CONTACT_EMAIL || 'contact.filevia@gmail.com',
  siteName: process.env.SITE_NAME || 'Filevia',
}
