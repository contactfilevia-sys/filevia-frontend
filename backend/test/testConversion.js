// backend/test/testConversion.js
import path from 'path'
import fs from 'fs/promises'
import { convertWithLibreOffice } from '../src/services/libreoffice.js'
import { imageToPdf, pdfToImage } from '../src/services/imageconverter.js'

async function runTests() {
  try {
    const testDir = path.resolve('./test_files')
    const outputDir = path.join(testDir, 'output')

    // Ensure output directories exist
    await fs.mkdir(outputDir, { recursive: true })
    await fs.mkdir(path.join(outputDir, 'images'), { recursive: true })

    // -----------------------------
    // 1. LibreOffice: DOCX -> PDF
    // -----------------------------
    const inputDocx = path.join(testDir, 'sample.docx')
    const outputPdf = path.join(outputDir, 'sample.pdf')

    console.log('\n=== Testing LibreOffice DOCX -> PDF ===')
    const pdfPath = await convertWithLibreOffice(inputDocx, outputPdf, 'pdf')
    console.log('LibreOffice conversion successful! Output:', pdfPath)

    // -----------------------------
    // 2. Image -> PDF
    // -----------------------------
    const inputImage = path.join(testDir, 'sample.jpg')
    const outputImagePdf = path.join(outputDir, 'sample_image.pdf')

    console.log('\n=== Testing Image -> PDF ===')
    const imagePdfPath = await imageToPdf(inputImage, outputImagePdf)
    console.log('Image to PDF conversion successful! Output:', imagePdfPath)

    // -----------------------------
    // 3. PDF -> Image
    // -----------------------------
    const inputPdf = pdfPath
    const outputImageDir = path.join(outputDir, 'images')

    console.log('\n=== Testing PDF -> Image ===')
    const firstImage = await pdfToImage(inputPdf, outputImageDir, 'png')
    console.log('PDF to image conversion successful! First image output:', firstImage)

    console.log('\n=== ALL TESTS PASSED ===')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

runTests()