import path from 'path'
import { convertWithLibreOffice } from './libreoffice.js'
import { imageToPdf, pdfToImage } from './imageConverter.js'
import { generateFilePath, getFileExtension } from '../utils/fileUtils.js'
import { config } from '../config/index.js'

/**
 * Convert Word document to PDF
 */
export async function wordToPdf(inputPath, outputPath) {
  return convertWithLibreOffice(inputPath, outputPath, 'pdf')
}

/**
 * Convert PDF to Word document
 */
export async function pdfToWord(inputPath, outputPath) {
  return convertWithLibreOffice(inputPath, outputPath, 'docx')
}

/**
 * Convert Excel to PDF
 */
export async function excelToPdf(inputPath, outputPath) {
  return convertWithLibreOffice(inputPath, outputPath, 'pdf')
}

/**
 * Convert PDF to Excel
 */
export async function pdfToExcel(inputPath, outputPath) {
  return convertWithLibreOffice(inputPath, outputPath, 'xlsx')
}

/**
 * Convert PowerPoint to PDF
 */
export async function pptToPdf(inputPath, outputPath) {
  return convertWithLibreOffice(inputPath, outputPath, 'pdf')
}

/**
 * Convert PDF to PowerPoint
 */
export async function pdfToPpt(inputPath, outputPath) {
  return convertWithLibreOffice(inputPath, outputPath, 'pptx')
}

/**
 * Convert image to PDF
 */
export async function imageToPdfConverter(inputPath, outputPath) {
  return imageToPdf(inputPath, outputPath)
}

/**
 * Convert PDF to image
 */
export async function pdfToImageConverter(inputPath, outputPath) {
  const fs = await import('fs/promises')
  const ext = path.extname(outputPath).slice(1).toLowerCase() || 'png'
  const outputDir = path.dirname(outputPath)
  
  console.log(`[PDF to Image Converter] Input: ${inputPath}`)
  console.log(`[PDF to Image Converter] Expected Output: ${outputPath}`)
  console.log(`[PDF to Image Converter] Output Directory: ${outputDir}`)
  console.log(`[PDF to Image Converter] Format: ${ext}`)
  
  // Normalize paths for comparison
  const normalizedOutputPath = path.resolve(outputPath).replace(/\\/g, '/')
  
  // Call pdfToImage which will generate the image in the output directory
  const generatedImagePath = await pdfToImage(inputPath, outputDir, ext)
  
  // Normalize the generated path for comparison
  const normalizedGeneratedPath = path.resolve(generatedImagePath).replace(/\\/g, '/')
  
  console.log(`[PDF to Image Converter] Generated image at: ${generatedImagePath}`)
  console.log(`[PDF to Image Converter] Normalized paths - Generated: ${normalizedGeneratedPath}, Expected: ${normalizedOutputPath}`)
  
  // Verify the generated file exists and is actually an image (already done in pdfToImage, but double-check)
  try {
    await fs.access(generatedImagePath)
    const stats = await fs.stat(generatedImagePath)
    console.log(`[PDF to Image Converter] Generated file size: ${stats.size} bytes`)
    
    // Final verification - read the file and check it's an image
    const imageBuffer = await fs.readFile(generatedImagePath)
    const isPng = imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 && imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47
    const isJpg = imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8 && imageBuffer[2] === 0xFF
    const isPdf = imageBuffer.slice(0, 4).toString('ascii') === '%PDF'
    
    console.log(`[PDF to Image Converter] File type check - PNG: ${isPng}, JPG: ${isJpg}, PDF: ${isPdf}`)
    
    if (isPdf) {
      throw new Error('CRITICAL ERROR: Generated file is a PDF, not an image! The conversion failed.')
    }
    
    if (!isPng && !isJpg) {
      console.error(`[PDF to Image Converter] Generated file is not a valid image! First bytes: ${imageBuffer.slice(0, 10).toString('hex')}`)
      throw new Error(`Generated file is not a valid image file. First bytes: ${imageBuffer.slice(0, 10).toString('hex')}`)
    }
  } catch (accessError) {
    throw new Error(`Generated image file not accessible: ${accessError.message}`)
  }
  
  // If the generated file path is different from expected output path, copy/rename it
  if (normalizedGeneratedPath !== normalizedOutputPath) {
    try {
      console.log(`[PDF to Image Converter] Copying ${generatedImagePath} to ${outputPath}`)
      // Always copy (don't rename) to avoid issues
      const fileContent = await fs.readFile(generatedImagePath)
      await fs.writeFile(outputPath, fileContent)
      
      // Verify the copied file
      const copiedBuffer = await fs.readFile(outputPath)
      const copiedIsPng = copiedBuffer[0] === 0x89 && copiedBuffer[1] === 0x50 && copiedBuffer[2] === 0x4E && copiedBuffer[3] === 0x47
      const copiedIsJpg = copiedBuffer[0] === 0xFF && copiedBuffer[1] === 0xD8 && copiedBuffer[2] === 0xFF
      const copiedIsPdf = copiedBuffer.slice(0, 4).toString('ascii') === '%PDF'
      
      if (copiedIsPdf) {
        throw new Error('CRITICAL: After copying, the output file is still a PDF!')
      }
      
      if (!copiedIsPng && !copiedIsJpg) {
        throw new Error('CRITICAL: After copying, the output file is not a valid image!')
      }
      
      console.log(`[PDF to Image Converter] Successfully copied image file`)
      
      // Try to delete original generated file
      try {
        await fs.unlink(generatedImagePath)
        console.log(`[PDF to Image Converter] Deleted temporary generated file`)
      } catch (unlinkError) {
        console.warn(`[PDF to Image Converter] Could not delete temporary file: ${unlinkError.message}`)
      }
    } catch (copyError) {
      console.error(`[PDF to Image Converter] Failed to copy file: ${copyError.message}`)
      throw new Error(`Failed to copy generated image to output path: ${copyError.message}`)
    }
  } else {
    console.log(`[PDF to Image Converter] Generated file path matches expected output path`)
  }
  
  // Final verification of output file
  try {
    await fs.access(outputPath)
    const finalStats = await fs.stat(outputPath)
    const finalBuffer = await fs.readFile(outputPath)
    const finalIsPng = finalBuffer[0] === 0x89 && finalBuffer[1] === 0x50 && finalBuffer[2] === 0x4E && finalBuffer[3] === 0x47
    const finalIsJpg = finalBuffer[0] === 0xFF && finalBuffer[1] === 0xD8 && finalBuffer[2] === 0xFF
    const finalIsPdf = finalBuffer.slice(0, 4).toString('ascii') === '%PDF'
    
    console.log(`[PDF to Image Converter] Final output verification - Size: ${finalStats.size} bytes, PNG: ${finalIsPng}, JPG: ${finalIsJpg}, PDF: ${finalIsPdf}`)
    
    if (finalIsPdf) {
      throw new Error('CRITICAL: Final output file is a PDF, not an image!')
    }
    
    if (!finalIsPng && !finalIsJpg) {
      throw new Error(`CRITICAL: Final output file is not a valid image format!`)
    }
    
    console.log(`[PDF to Image Converter] Final output file verified successfully`)
  } catch (verifyError) {
    throw new Error(`Output image file verification failed: ${verifyError.message}`)
  }
  
  return outputPath
}

/**
 * Main conversion router
 */
export async function convertFile(inputPath, conversionType) {
  // Normalize extension
  const inputExt = getFileExtension(inputPath).toLowerCase()

  // Generate output path
  const outputPath = generateFilePath(
    config.tmpOutputDir,
    `converted_${Date.now()}.${getOutputExtension(conversionType)}`
  )

  switch (conversionType) {
    case 'word-to-pdf':
      if (!['.doc', '.docx'].includes(inputExt)) {
        throw new Error('Invalid file type. Expected .doc or .docx')
      }
      await wordToPdf(inputPath, outputPath)
      break

    case 'pdf-to-word':
      if (inputExt !== '.pdf') {
        throw new Error('Invalid file type. Expected .pdf')
      }
      await pdfToWord(inputPath, outputPath)
      break

    case 'excel-to-pdf':
      if (!['.xls', '.xlsx'].includes(inputExt)) {
        throw new Error('Invalid file type. Expected .xls or .xlsx')
      }
      await excelToPdf(inputPath, outputPath)
      break

    case 'pdf-to-excel':
      if (inputExt !== '.pdf') {
        throw new Error('Invalid file type. Expected .pdf')
      }
      await pdfToExcel(inputPath, outputPath)
      break

    case 'ppt-to-pdf':
      if (!['.ppt', '.pptx'].includes(inputExt)) {
        throw new Error('Invalid file type. Expected .ppt or .pptx')
      }
      await pptToPdf(inputPath, outputPath)
      break

    case 'pdf-to-ppt':
      if (inputExt !== '.pdf') {
        throw new Error('Invalid file type. Expected .pdf')
      }
      await pdfToPpt(inputPath, outputPath)
      break

    case 'image-to-pdf':
      if (!['.jpg', '.jpeg', '.png'].includes(inputExt)) {
        throw new Error('Invalid file type. Expected .jpg, .jpeg, or .png')
      }
      await imageToPdfConverter(inputPath, outputPath)
      break

    case 'pdf-to-image':
      if (inputExt !== '.pdf') {
        throw new Error('Invalid file type. Expected .pdf')
      }
      console.log(`[Converter] Starting PDF to Image conversion`)
      console.log(`[Converter] Input: ${inputPath}, Expected Output: ${outputPath}`)
      const resultPath = await pdfToImageConverter(inputPath, outputPath)
      console.log(`[Converter] PDF to Image conversion completed. Result: ${resultPath}`)
      
      // Verify the result is actually an image file
      const fs = await import('fs/promises')
      const resultBuffer = await fs.readFile(resultPath)
      const resultFirstBytes = resultBuffer.slice(0, 10)
      const isPng = resultFirstBytes[0] === 0x89 && resultFirstBytes[1] === 0x50 && resultFirstBytes[2] === 0x4E && resultFirstBytes[3] === 0x47
      const isJpg = resultFirstBytes[0] === 0xFF && resultFirstBytes[1] === 0xD8 && resultFirstBytes[2] === 0xFF
      const isPdf = resultFirstBytes.slice(0, 4).toString('ascii') === '%PDF'
      
      console.log(`[Converter] Result file verification - Is PNG: ${isPng}, Is JPG: ${isJpg}, Is PDF: ${isPdf}`)
      
      if (isPdf) {
        throw new Error('Conversion failed: The output file is still a PDF instead of an image. Please check the conversion process.')
      }
      
      if (!isPng && !isJpg) {
        throw new Error(`Conversion failed: The output file is not a valid image format. First bytes: ${resultFirstBytes.slice(0, 10).toString('hex')}`)
      }
      
      break

    default:
      throw new Error(`Unsupported conversion type: ${conversionType}`)
  }

  return outputPath
}

/**
 * Get output file extension based on conversion type
 */
function getOutputExtension(conversionType) {
  const extensionMap = {
    'word-to-pdf': 'pdf',
    'pdf-to-word': 'docx',
    'excel-to-pdf': 'pdf',
    'pdf-to-excel': 'xlsx',
    'ppt-to-pdf': 'pdf',
    'pdf-to-ppt': 'pptx',
    'image-to-pdf': 'pdf',
    'pdf-to-image': 'png', // fixed: always convert PDF to PNG by default
  }

  return extensionMap[conversionType] || 'pdf'
}
