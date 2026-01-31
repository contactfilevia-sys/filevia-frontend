import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config/index.js'

/**
 * Ensure directory exists, create if not
 */
export async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

/**
 * Sanitize filename to prevent directory traversal and special characters
 */
export function sanitizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\./g, '')
    .substring(0, 255)
}

/**
 * Generate unique file path with extension
 */
export function generateFilePath(dir, originalName) {
  const ext = path.extname(originalName)
  const baseName = path.basename(originalName, ext)
  const sanitized = sanitizeFileName(baseName)
  const uniqueId = uuidv4()
  return path.join(dir, `${sanitized}_${uniqueId}${ext}`)
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName) {
  return path.extname(fileName).toLowerCase()
}

/**
 * Validate file extension against allowed list
 */
export function validateFileExtension(fileName, allowedExtensions) {
  const ext = getFileExtension(fileName)
  return allowedExtensions.includes(ext)
}

/**
 * Delete file safely
 */
export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    // File might not exist, ignore error
    console.warn(`Failed to delete file ${filePath}:`, error.message)
  }
}

/**
 * Get file size in bytes
 */
export async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath)
    return stats.size
  } catch {
    return 0
  }
}

/**
 * Initialize temp directories
 */
export async function initializeDirectories() {
  await ensureDir(config.tmpUploadDir)
  await ensureDir(config.tmpOutputDir)
}
