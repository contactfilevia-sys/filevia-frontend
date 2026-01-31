import fs from 'fs/promises'
import path from 'path'
import { convertFile } from '../services/converter.js'
import { deleteFile } from '../utils/fileUtils.js'

export async function handleConversion(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
      message: 'Please upload a file to convert',
    })
  }

  const inputPath = req.file.path
  
  // Extract conversion type from the request path
  // The path will be like '/api/convert/word-to-pdf'
  const pathParts = req.path.split('/')
  const conversionType = pathParts[pathParts.length - 1] // Get last part of path
  
  if (!conversionType) {
    return res.status(400).json({
      success: false,
      error: 'Conversion type not specified',
      message: 'Unable to determine conversion type from request path',
    })
  }

  // Validate PDF files before processing
  if (conversionType.includes('pdf-to-')) {
    try {
      const fileBuffer = await fs.readFile(inputPath)
      const pdfHeader = fileBuffer.slice(0, 4).toString('ascii')
      
      if (pdfHeader !== '%PDF') {
        return res.status(400).json({
          success: false,
          error: 'Invalid PDF file',
          message: 'The uploaded file does not appear to be a valid PDF. Please ensure you are uploading a valid PDF file.',
        })
      }
      
      // Check file size (should be at least 100 bytes for a valid PDF)
      if (fileBuffer.length < 100) {
        return res.status(400).json({
          success: false,
          error: 'Invalid PDF file',
          message: 'The uploaded file is too small to be a valid PDF.',
        })
      }
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: 'File validation failed',
        message: `Unable to read the uploaded file: ${validationError.message}`,
      })
    }
  }

  let outputPath = null

  try {
    // Perform conversion
    outputPath = await convertFile(inputPath, conversionType)

    // Ensure output file exists
    await fs.access(outputPath)

    // Prepare download info
    const stats = await fs.stat(outputPath)
    const originalName = path.basename(
      req.file.originalname,
      path.extname(req.file.originalname)
    )
    const outputExt = path.extname(outputPath).toLowerCase()
    const downloadFileName = `${originalName}_converted${outputExt}`

    // Read file to verify it's the correct type
    const fileBuffer = await fs.readFile(outputPath)
    
    // For PDF to image conversion, verify the file is actually an image
    if (conversionType === 'pdf-to-image') {
      const firstBytes = fileBuffer.slice(0, 10)
      const isPng = firstBytes[0] === 0x89 && firstBytes[1] === 0x50 && firstBytes[2] === 0x4E && firstBytes[3] === 0x47
      const isJpg = firstBytes[0] === 0xFF && firstBytes[1] === 0xD8 && firstBytes[2] === 0xFF
      const isPdf = firstBytes.slice(0, 4).toString('ascii') === '%PDF'
      
      console.log(`[Controller] File verification - First bytes: ${firstBytes.slice(0, 10).toString('hex')}`)
      console.log(`[Controller] Is PNG: ${isPng}, Is JPG: ${isJpg}, Is PDF: ${isPdf}`)
      
      if (isPdf) {
        console.error(`[Controller] ERROR: Output file is still a PDF! Expected image file.`)
        return res.status(500).json({
          success: false,
          error: 'Conversion failed: Output file is still a PDF instead of an image. The conversion may have failed silently.',
        })
      }
      
      if (!isPng && !isJpg) {
        console.error(`[Controller] ERROR: Output file is not a valid image!`)
        return res.status(500).json({
          success: false,
          error: 'Conversion failed: Output file is not a valid image format.',
        })
      }
    }

    // Determine correct Content-Type based on output extension and file content
    let contentType = 'application/octet-stream'
    if (outputExt === '.png') {
      contentType = 'image/png'
    } else if (outputExt === '.jpg' || outputExt === '.jpeg') {
      contentType = 'image/jpeg'
    } else if (outputExt === '.pdf') {
      contentType = 'application/pdf'
    } else if (outputExt === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    } else if (outputExt === '.xlsx') {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else if (outputExt === '.pptx') {
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }

    console.log(`[Controller] Sending file: ${downloadFileName}, Type: ${contentType}, Size: ${stats.size} bytes`)

    // Set headers for download
    res.setHeader('Content-Type', contentType)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${downloadFileName}"`
    )
    res.setHeader('Content-Length', stats.size)

    // Send file buffer
    res.send(fileBuffer)
  } catch (error) {
    console.error('🔥 CONVERSION ERROR:', error)

    return res.status(500).json({
      success: false,
      error: error?.message || String(error),
    })
  } finally {
    // Always attempt cleanup
    try { if (inputPath) await deleteFile(inputPath) } catch {}
    try { if (outputPath) await deleteFile(outputPath) } catch {}
  }
}
