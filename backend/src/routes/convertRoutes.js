import express from 'express'
import { upload, setAllowedExtensions } from '../middlewares/upload.js'
import { handleConversion } from '../controllers/convertController.js'

const router = express.Router()

/**
 * Word to PDF
 */
router.post(
  '/word-to-pdf',
  setAllowedExtensions(['.doc', '.docx']),
  upload.single('file'),
  handleConversion
)

/**
 * PDF to Word
 */
router.post(
  '/pdf-to-word',
  setAllowedExtensions(['.pdf']),
  upload.single('file'),
  handleConversion
)

/**
 * Excel to PDF
 */
router.post(
  '/excel-to-pdf',
  setAllowedExtensions(['.xls', '.xlsx']),
  upload.single('file'),
  handleConversion
)

/**
 * PDF to Excel
 */
router.post(
  '/pdf-to-excel',
  setAllowedExtensions(['.pdf']),
  upload.single('file'),
  handleConversion
)

/**
 * PPT to PDF
 */
router.post(
  '/ppt-to-pdf',
  setAllowedExtensions(['.ppt', '.pptx']),
  upload.single('file'),
  handleConversion
)

/**
 * PDF to PPT
 */
router.post(
  '/pdf-to-ppt',
  setAllowedExtensions(['.pdf']),
  upload.single('file'),
  handleConversion
)

/**
 * Image to PDF
 */
router.post(
  '/image-to-pdf',
  setAllowedExtensions(['.jpg', '.jpeg', '.png']),
  upload.single('file'),
  handleConversion
)

/**
 * PDF to Image
 */
router.post(
  '/pdf-to-image',
  setAllowedExtensions(['.pdf']),
  upload.single('file'),
  handleConversion
)

export default router
