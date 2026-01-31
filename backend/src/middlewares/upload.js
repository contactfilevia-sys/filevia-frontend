import multer from 'multer'
import path from 'path'
import { config } from '../config/index.js'
import { ensureDir, generateFilePath, validateFileExtension } from '../utils/fileUtils.js'

// Ensure upload directory exists (called on app startup)
ensureDir(config.tmpUploadDir).catch((err) => {
  console.error('Failed to create upload directory:', err)
})

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.tmpUploadDir)
  },
  filename: (req, file, cb) => {
    try {
      const filePath = generateFilePath(config.tmpUploadDir, file.originalname)
      cb(null, path.basename(filePath))
    } catch (err) {
      cb(err, file.originalname)
    }
  },
})

/**
 * File filter for multer
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = req.allowedExtensions || [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.jpg',
    '.jpeg',
    '.png',
  ]

  if (validateFileExtension(file.originalname, allowedExtensions)) {
    cb(null, true)
  } else {
    cb(
      new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`),
      false
    )
  }
}

/**
 * Multer upload middleware
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
})

/**
 * Middleware to set allowed file extensions based on conversion type
 */
export function setAllowedExtensions(allowedExtensions = []) {
  return (req, res, next) => {
    req.allowedExtensions = allowedExtensions
    next()
  }
}

/**
 * Error handling wrapper for multer
 */
export function handleMulterErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: 'Multer error',
      message: err.message,
    })
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      message: err.message,
    })
  }
  next()
}
