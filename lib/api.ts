/**
 * API helper for document conversion
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ConversionResponse {
  success: boolean
  error?: string
  message?: string
}

/**
 * Convert file using the backend API
 * @param file - File to convert
 * @param conversionType - Type of conversion (e.g., 'word-to-pdf')
 * @returns Promise that resolves with the blob of converted file
 */
export async function convertFile(
  file: File,
  conversionType: string
): Promise<Blob> {
  console.log(`[API] Starting conversion: ${file.name} -> ${conversionType}`)
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/convert/${conversionType}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    // Try to get error message from backend
    let errorText = await response.text()
    console.error('Backend error:', errorText)
    
    // Try to parse as JSON for structured error
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.error || errorJson.message) {
        errorText = errorJson.error || errorJson.message
      }
    } catch {
      // Not JSON, use as is
    }
    
    if (!errorText) errorText = `HTTP ${response.status}: ${response.statusText}`
    throw new Error(errorText)
  }

  let blob = await response.blob()

  // Get Content-Type to determine file type
  const contentType = response.headers.get('Content-Type') || ''
  
  // Try to get filename from backend headers
  const contentDisposition = response.headers.get('Content-Disposition')
  let filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || null
  
  // If no filename in header, generate one based on Content-Type
  if (!filename) {
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    let extension = 'pdf' // default fallback
    
    // Determine extension from Content-Type
    if (contentType.includes('image/png')) {
      extension = 'png'
    } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
      extension = 'jpg'
    } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      extension = 'docx'
    } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      extension = 'xlsx'
    } else if (contentType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      extension = 'pptx'
    } else if (contentType.includes('application/pdf')) {
      extension = 'pdf'
    }
    
    filename = `${baseName}_converted.${extension}`
  }

  // Verify blob type matches Content-Type
  console.log('[API] Response Content-Type:', contentType)
  console.log('[API] Blob type:', blob.type)
  console.log('[API] Blob size:', blob.size, 'bytes')
  console.log('[API] Filename:', filename)
  
  // For PDF to image conversions, verify the blob is actually an image
  if (conversionType === 'pdf-to-image') {
    try {
      // Read first bytes to verify it's an image, not a PDF
      const arrayBuffer = await blob.slice(0, 10).arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
      const isJpg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
      const isPdf = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === '%PDF'
      
      console.log('[API] Blob content verification - PNG:', isPng, 'JPG:', isJpg, 'PDF:', isPdf)
      console.log('[API] First bytes (hex):', Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '))
      
      if (isPdf) {
        console.error('[API] CRITICAL: Received PDF blob instead of image!')
        throw new Error('The server returned a PDF file instead of an image. Please try again or contact support.')
      }
      
      if (!isPng && !isJpg) {
        console.error('[API] CRITICAL: Blob is not a valid image format!')
        throw new Error('The server returned an invalid file format. Expected an image file.')
      }
      
      // Create a new blob with correct MIME type if needed
      if (isPng && blob.type !== 'image/png') {
        console.log('[API] Correcting blob MIME type to image/png')
        const fullArrayBuffer = await blob.arrayBuffer()
        blob = new Blob([fullArrayBuffer], { type: 'image/png' })
      } else if (isJpg && !blob.type.includes('image/jpeg') && !blob.type.includes('image/jpg')) {
        console.log('[API] Correcting blob MIME type to image/jpeg')
        const fullArrayBuffer = await blob.arrayBuffer()
        blob = new Blob([fullArrayBuffer], { type: 'image/jpeg' })
      }
    } catch (verifyError) {
      console.error('[API] Error verifying blob content:', verifyError)
      throw verifyError
    }
  }
  
  // If blob type doesn't match, log a warning
  if (blob.type && contentType && blob.type !== contentType) {
    console.warn(`[API] Blob type mismatch! Expected: ${contentType}, Got: ${blob.type}`)
  }

  // Attach filename to blob (for later download)
  ;(blob as any).filename = filename

  return blob
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

/**
 * Get conversion type from slug
 */
export function getConversionType(slug: string): string {
  return slug
}

/**
 * Submit contact form
 */
export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || result.error || 'Failed to send message')
  }

  return result
}
