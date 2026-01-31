import express from 'express'
import { handleContactSubmission } from '../controllers/contactController.js'

const router = express.Router()

/**
 * POST /api/contact
 * Submit contact form
 */
router.post('/', handleContactSubmission)

export default router
