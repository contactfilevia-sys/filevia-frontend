import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pdfPoppler = require('pdf-poppler')

/**
 * Convert image (JPG/PNG) to PDF using pdf-lib
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output PDF path
 */
export async function imageToPdf(inputPath, outputPath) {
  try {
    // Read image file
    const imageBuffer = await fs.readFile(inputPath)
    
    // Get image metadata using Sharp
    const image = sharp(imageBuffer)
    const metadata = await image.metadata()
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    
    // Embed the image in the PDF
    let pdfImage
    const ext = path.extname(inputPath).toLowerCase()
    
    if (ext === '.png') {
      pdfImage = await pdfDoc.embedPng(imageBuffer)
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      pdfImage = await pdfDoc.embedJpg(imageBuffer)
    } else {
      // For other formats, try to convert to PNG first
      const pngBuffer = await image.png().toBuffer()
      pdfImage = await pdfDoc.embedPng(pngBuffer)
    }
    
    // Get image dimensions
    const imageDims = pdfImage.scale(1)
    const width = imageDims.width
    const height = imageDims.height
    
    // Create a page with the image dimensions
    // Use US Letter size (612x792 points) as default, or fit to image
    const pageWidth = 612 // US Letter width
    const pageHeight = 792 // US Letter height
    
    // Calculate scaling to fit image on page while maintaining aspect ratio
    const scaleX = pageWidth / width
    const scaleY = pageHeight / height
    const scale = Math.min(scaleX, scaleY, 1) // Don't enlarge
    
    const scaledWidth = width * scale
    const scaledHeight = height * scale
    
    // Center the image on the page
    const x = (pageWidth - scaledWidth) / 2
    const y = (pageHeight - scaledHeight) / 2
    
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    page.drawImage(pdfImage, {
      x: x,
      y: y,
      width: scaledWidth,
      height: scaledHeight,
    })
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save()
    await fs.writeFile(outputPath, pdfBytes)

    return outputPath
  } catch (error) {
    throw new Error(`Image to PDF conversion failed: ${error.message}`)
  }
}

/**
 * Convert PDF to images using pdf-poppler
 * @param {string} inputPath - Input PDF path
 * @param {string} outputDir - Output directory for images
 * @param {string} format - Output format (png or jpg)
 */
export async function pdfToImage(inputPath, outputDir, format = 'png') {
  try {
    // Normalize paths to use forward slashes (works on Windows too)
    const normalizedInputPath = path.resolve(inputPath).replace(/\\/g, '/')
    const normalizedOutputDir = path.resolve(outputDir).replace(/\\/g, '/')

    // Validate input file exists and is readable
    try {
      await fs.access(normalizedInputPath)
    } catch (accessError) {
      throw new Error(`Input PDF file not found or not accessible: ${normalizedInputPath}`)
    }

    // Check if file is actually a PDF by reading first bytes
    const fileBuffer = await fs.readFile(normalizedInputPath)
    const pdfHeader = fileBuffer.slice(0, 4).toString('ascii')
    
    if (pdfHeader !== '%PDF') {
      throw new Error(`Invalid PDF file: File does not start with PDF header. Found: ${pdfHeader}`)
    }

    // Ensure output directory exists
    await fs.mkdir(normalizedOutputDir, { recursive: true })

    const options = {
      format: format,
      out_dir: normalizedOutputDir,
      out_prefix: 'page',
      page: null, // Convert all pages
    }

    console.log(`[PDF to Image] Converting PDF: ${normalizedInputPath} to ${format} in ${normalizedOutputDir}`)
    console.log(`[PDF to Image] File size: ${fileBuffer.length} bytes`)
    
    await pdfPoppler.convert(normalizedInputPath, options)

    // Wait a bit for file system to sync (longer wait for Windows)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Find generated image files
    const files = await fs.readdir(normalizedOutputDir)
    console.log(`[PDF to Image] Files in output directory: ${files.join(', ')}`)
    
    const candidateFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        const isImage = ext === '.png' || ext === '.jpg' || ext === '.jpeg'
        const startsWithPage = file.startsWith('page') || file.match(/^page-\d+/)
        
        // Also verify it's actually an image by checking file content
        if (isImage && startsWithPage) {
          return true
        }
        return false
      })
      .map(file => {
        const fullPath = path.join(normalizedOutputDir, file)
        // Normalize the path
        return path.resolve(fullPath).replace(/\\/g, '/')
      })
      .sort()
    
    // Verify each file is actually an image (not a PDF)
    const verifiedImageFiles = []
    for (const candidateFile of candidateFiles) {
      try {
        const fileBuffer = await fs.readFile(candidateFile)
        const isPng = fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50 && fileBuffer[2] === 0x4E && fileBuffer[3] === 0x47
        const isJpg = fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8 && fileBuffer[2] === 0xFF
        const isPdf = fileBuffer.slice(0, 4).toString('ascii') === '%PDF'
        
        if (isPdf) {
          console.warn(`[PDF to Image] Skipping file ${candidateFile} - it's a PDF, not an image`)
          continue
        }
        
        if (isPng || isJpg) {
          verifiedImageFiles.push(candidateFile)
          console.log(`[PDF to Image] Verified image file: ${candidateFile} (${isPng ? 'PNG' : 'JPG'})`)
        } else {
          console.warn(`[PDF to Image] Skipping file ${candidateFile} - not a valid image format`)
        }
      } catch (err) {
        console.warn(`[PDF to Image] Could not verify file ${candidateFile}: ${err.message}`)
      }
    }
    
    if (verifiedImageFiles.length === 0) {
      // List all files for debugging
      console.error(`[PDF to Image] No valid image files found. All files: ${files.join(', ')}`)
      throw new Error(
        'No valid images generated from PDF. The PDF file may be corrupted or invalid. ' +
        'Please ensure the PDF is not password-protected and is a valid PDF file. ' +
        'Also ensure poppler-utils is installed correctly.'
      )
    }
    
    const imageFiles = verifiedImageFiles

    console.log(`[PDF to Image] Found ${imageFiles.length} verified image(s), using first: ${imageFiles[0]}`)
    
    // Final verification - read the file and confirm it's an image
    const finalImageBuffer = await fs.readFile(imageFiles[0])
    const finalIsPng = finalImageBuffer[0] === 0x89 && finalImageBuffer[1] === 0x50 && finalImageBuffer[2] === 0x4E && finalImageBuffer[3] === 0x47
    const finalIsJpg = finalImageBuffer[0] === 0xFF && finalImageBuffer[1] === 0xD8 && finalImageBuffer[2] === 0xFF
    const finalIsPdf = finalImageBuffer.slice(0, 4).toString('ascii') === '%PDF'
    
    if (finalIsPdf) {
      throw new Error('CRITICAL: pdf-poppler returned a PDF file instead of an image. The conversion tool may be misconfigured.')
    }
    
    if (!finalIsPng && !finalIsJpg) {
      throw new Error(`CRITICAL: Generated file is not a valid image. First bytes: ${finalImageBuffer.slice(0, 10).toString('hex')}`)
    }
    
    console.log(`[PDF to Image] Successfully verified image file: ${imageFiles[0]} (${finalIsPng ? 'PNG' : 'JPG'})`)
    
    // Return first page path (for single page PDFs or first page of multi-page)
    return imageFiles[0]
  } catch (error) {
    console.error('[PDF to Image] Conversion error:', error)
    
    // Provide more helpful error messages
    if (error.message.includes('Syntax Error') || error.message.includes('trailer dictionary')) {
      throw new Error(
        'PDF to image conversion failed: The PDF file appears to be corrupted or invalid. ' +
        'Please ensure you are uploading a valid PDF file. ' +
        `Original error: ${error.message}`
      )
    }
    
    if (error.message.includes('Couldn\'t read xref table')) {
      throw new Error(
        'PDF to image conversion failed: The PDF file structure is invalid or corrupted. ' +
        'Please try with a different PDF file or ensure the file was not corrupted during upload.'
      )
    }
    
    throw new Error(`PDF to image conversion failed: ${error.message}`)
  }
}
