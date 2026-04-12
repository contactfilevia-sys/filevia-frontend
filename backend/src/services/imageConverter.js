import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

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
    const pageWidth = 612
    const pageHeight = 792
    
    const scaleX = pageWidth / width
    const scaleY = pageHeight / height
    const scale = Math.min(scaleX, scaleY, 1)
    
    const scaledWidth = width * scale
    const scaledHeight = height * scale
    
    const x = (pageWidth - scaledWidth) / 2
    const y = (pageHeight - scaledHeight) / 2
    
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    page.drawImage(pdfImage, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    })
    
    const pdfBytes = await pdfDoc.save()
    await fs.writeFile(outputPath, pdfBytes)

    return outputPath
  } catch (error) {
    throw new Error(`Image to PDF conversion failed: ${error.message}`)
  }
}

/**
 * Convert PDF to images using poppler (pdftoppm)
 * @param {string} inputPath - Input PDF path
 * @param {string} outputDir - Output directory for images
 * @param {string} format - Output format (png or jpg)
 */
export async function pdfToImage(inputPath, outputDir, format = 'png') {
  try {
    // Normalize paths
    const normalizedInputPath = path.resolve(inputPath).replace(/\\/g, '/')
    const normalizedOutputDir = path.resolve(outputDir).replace(/\\/g, '/')

    // Validate input file
    await fs.access(normalizedInputPath)

    const fileBuffer = await fs.readFile(normalizedInputPath)
    const pdfHeader = fileBuffer.slice(0, 4).toString('ascii')

    if (pdfHeader !== '%PDF') {
      throw new Error(`Invalid PDF file: ${pdfHeader}`)
    }

    // Ensure output directory exists
    await fs.mkdir(normalizedOutputDir, { recursive: true })

    console.log(`[PDF to Image] Converting: ${normalizedInputPath}`)

    // ✅ FIX: Use native pdftoppm instead of pdf-poppler
    const command = `pdftoppm -${format} "${normalizedInputPath}" "${path.join(normalizedOutputDir, 'page')}"`
    await execAsync(command)

    // Wait for file system sync
    await new Promise(resolve => setTimeout(resolve, 1500))

    const files = await fs.readdir(normalizedOutputDir)

    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ext === '.png' || ext === '.jpg' || ext === '.jpeg'
      })
      .map(file => path.join(normalizedOutputDir, file))
      .sort()

    if (imageFiles.length === 0) {
      throw new Error('No images generated from PDF')
    }

    return imageFiles[0]

  } catch (error) {
    throw new Error(`PDF to image conversion failed: ${error.message}`)
  }
}