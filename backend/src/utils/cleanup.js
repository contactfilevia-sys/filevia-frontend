import fs from 'fs/promises'
import path from 'path'
import { config } from '../config/index.js'
import { deleteFile } from './fileUtils.js'

/**
 * Clean up old files from directory
 */
async function cleanupDirectory(dirPath, maxAge) {
  try {
    const files = await fs.readdir(dirPath)
    const now = Date.now()
    let deletedCount = 0

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      try {
        const stats = await fs.stat(filePath)
        const age = now - stats.mtimeMs

        if (age > maxAge) {
          await deleteFile(filePath)
          deletedCount++
        }
      } catch (error) {
        // File might have been deleted, continue
        console.warn(`Error processing file ${filePath}:`, error.message)
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old files from ${dirPath}`)
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error cleaning up directory ${dirPath}:`, error.message)
    }
  }
}

/**
 * Run cleanup for both upload and output directories
 */
export async function runCleanup() {
  await cleanupDirectory(config.tmpUploadDir, config.fileRetentionTime)
  await cleanupDirectory(config.tmpOutputDir, config.fileRetentionTime)
}

/**
 * Start periodic cleanup
 */
export function startCleanupScheduler() {
  // Run cleanup immediately
  runCleanup()

  // Then run at intervals
  setInterval(() => {
    runCleanup()
  }, config.cleanupInterval)

  console.log(`Cleanup scheduler started (interval: ${config.cleanupInterval / 1000}s)`)
}
