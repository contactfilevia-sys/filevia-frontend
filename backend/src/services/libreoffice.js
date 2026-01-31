import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import { config } from '../config/index.js'

const execAsync = promisify(exec)

/**
 * Check if LibreOffice is installed
 */
export async function checkLibreOffice() {
  try {
    await execAsync('which libreoffice || which soffice')
    return true
  } catch {
    return false
  }
}

/**
 * Convert file using LibreOffice headless mode
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {string} outputFormat - Output format (pdf, docx, xlsx, pptx)
 */
export async function convertWithLibreOffice(inputPath, outputPath, outputFormat) {
  const formatMap = {
    pdf: 'pdf',
    docx: 'docx',
    xlsx: 'xlsx',
    pptx: 'pptx',
  }

  const format = formatMap[outputFormat] || outputFormat
  const outputDir = path.dirname(outputPath)

  // Normalize paths for Windows (handle backslashes and spaces)
  const normalizedInputPath = path.resolve(inputPath).replace(/\\/g, '/')
  const normalizedOutputDir = path.resolve(outputDir).replace(/\\/g, '/')

  // LibreOffice command for headless conversion
  // Try to detect LibreOffice path (works on Windows and Linux)
  let sofficeCmd = 'libreoffice'
  if (process.platform === 'win32') {
    // On Windows, try 'soffice' first (if in PATH), otherwise try common installation paths
    // Common paths for Windows
    const winPaths = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
    ]
    
    // Try to find soffice in common locations
    let found = false
    for (const winPath of winPaths) {
      try {
        await fs.access(winPath)
        // Store path without quotes - we'll quote it in the command
        sofficeCmd = winPath
        found = true
        break
      } catch {
        // Path doesn't exist, continue
      }
    }
    
    // If not found in common paths, use 'soffice' (assumes it's in PATH)
    if (!found) {
      sofficeCmd = 'soffice'
    }
  }

  // Quote paths properly for command line
  const inputPathQuoted = `"${normalizedInputPath}"`
  const outputDirQuoted = `"${normalizedOutputDir}"`

  // Build command - properly quote paths with spaces for Windows
  let command
  if (process.platform === 'win32' && sofficeCmd.includes(' ')) {
    // Windows path with spaces needs to be quoted
    const sofficeQuoted = `"${sofficeCmd}"`
    command = `${sofficeQuoted} --headless --convert-to ${format} --outdir ${outputDirQuoted} ${inputPathQuoted}`
  } else {
    command = `${sofficeCmd} --headless --convert-to ${format} --outdir ${outputDirQuoted} ${inputPathQuoted}`
  }

  try {
    console.log(`[LibreOffice] Converting: ${inputPath} -> ${outputPath}`)
    console.log(`[LibreOffice] Command: ${command}`)
    console.log(`[LibreOffice] Format: ${format}, OutputDir: ${normalizedOutputDir}`)
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2 minutes timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      shell: process.platform === 'win32' ? 'cmd.exe' : true, // Use cmd.exe explicitly on Windows
    })

    if (stderr && stderr.trim()) {
      console.log('[LibreOffice] stderr:', stderr)
      // Some stderr messages are warnings, not errors
      if (stderr.toLowerCase().includes('error') || stderr.toLowerCase().includes('failed')) {
        console.warn('[LibreOffice] Warning in stderr:', stderr)
      }
    }
    if (stdout && stdout.trim()) {
      console.log('[LibreOffice] stdout:', stdout)
    }

    // Wait longer for file system to sync, especially for PDF conversions
    const waitTime = outputFormat === 'docx' && path.extname(inputPath).toLowerCase() === '.pdf' ? 3000 : 1500
    await new Promise(resolve => setTimeout(resolve, waitTime))

    // LibreOffice creates output with original name, need to find it
    // Handle both normalized and original paths
    const originalName = path.basename(inputPath, path.extname(inputPath))
    // Try both normalized and original path formats
    const generatedOutput = path.join(outputDir, `${originalName}.${format}`)
    const generatedOutputNormalized = path.join(normalizedOutputDir, `${originalName}.${format}`)
    
    // Check if output was created at expected location
    let outputFile = null
    try {
      await fs.access(generatedOutput)
      outputFile = generatedOutput
      console.log(`[LibreOffice] Found output at expected location: ${outputFile}`)
    } catch {
      // Try normalized path
      try {
        await fs.access(generatedOutputNormalized)
        outputFile = generatedOutputNormalized
        console.log(`[LibreOffice] Found output at normalized location: ${outputFile}`)
      } catch {
        // File not at expected location, try to find it in output directory
        console.log(`[LibreOffice] Expected file not found at ${generatedOutput} or ${generatedOutputNormalized}, searching output directory...`)
        
        try {
          const files = await fs.readdir(outputDir)
          console.log('[LibreOffice] Files in output directory:', files)
        
          // Look for files with similar name or matching extension
          // For PDF to Word, LibreOffice might create .doc instead of .docx
          const matchingFiles = files.filter(file => {
            const filePath = path.join(outputDir, file)
            const ext = path.extname(file).toLowerCase()
            const baseName = path.basename(file, ext).toLowerCase()
            
            // Match by extension or by base name similarity
            if (format === 'docx') {
              // For docx, also accept .doc files
              return ext === '.docx' || ext === '.doc' || 
                     (ext === `.${format}` && baseName.includes(originalName.toLowerCase()))
            }
            
            return ext === `.${format}` || 
                   (baseName.includes(originalName.toLowerCase()) && ext !== path.extname(inputPath).toLowerCase())
          })
          
          if (matchingFiles.length > 0) {
            // Sort by modification time, get most recent
            const fileStats = await Promise.all(
              matchingFiles.map(async (file) => {
                const filePath = path.join(outputDir, file)
                const stats = await fs.stat(filePath)
                return { file, path: filePath, mtime: stats.mtime }
              })
            )
            
            fileStats.sort((a, b) => b.mtime - a.mtime)
            outputFile = fileStats[0].path
            console.log(`[LibreOffice] Found output file: ${outputFile}`)
            
            // If we found a .doc file but need .docx, we'll rename it
            // (LibreOffice might create .doc for PDF to Word conversions)
            if (format === 'docx' && path.extname(outputFile).toLowerCase() === '.doc') {
              const docxPath = outputFile.replace(/\.doc$/i, '.docx')
              try {
                await fs.copyFile(outputFile, docxPath)
                await fs.unlink(outputFile)
                outputFile = docxPath
                console.log(`[LibreOffice] Converted .doc to .docx: ${outputFile}`)
              } catch (copyError) {
                console.warn('[LibreOffice] Could not convert .doc to .docx, using .doc file:', copyError)
              }
            }
          }
        } catch (dirError) {
          console.error('[LibreOffice] Error reading output directory:', dirError)
        }
      }
    }

    if (!outputFile) {
      // List all files in output directory for debugging
      try {
        const allFiles = await fs.readdir(outputDir)
        console.error(`[LibreOffice] Output file not found. Files in directory: ${allFiles.join(', ')}`)
      } catch {}
      
      // Provide more helpful error message for PDF to Word conversions
      if (outputFormat === 'docx' && path.extname(inputPath).toLowerCase() === '.pdf') {
        throw new Error(
          'PDF to Word conversion failed. LibreOffice has limited support for PDF to Word conversion. ' +
          'This may fail if the PDF is image-based or contains complex formatting. ' +
          'Please try a different PDF file or use a specialized PDF to Word converter.'
        )
      }
      
      throw new Error(`LibreOffice conversion failed: output file not created. Format: ${format}, Input: ${path.basename(inputPath)}`)
    }

    // Rename to desired output path if different
    if (outputFile !== outputPath) {
      try {
        await fs.rename(outputFile, outputPath)
      } catch (renameError) {
        // If rename fails, copy instead
        const fileContent = await fs.readFile(outputFile)
        await fs.writeFile(outputPath, fileContent)
        // Try to delete original
        try {
          await fs.unlink(outputFile)
        } catch {}
      }
    }

    // Verify final output exists
    await fs.access(outputPath)
    return outputPath
  } catch (error) {
    console.error('LibreOffice conversion error:', error)
    if (error.code === 'ETIMEDOUT') {
      throw new Error('Conversion timeout: file too large or complex')
    }
    throw new Error(`LibreOffice conversion failed: ${error.message}`)
  }
}
