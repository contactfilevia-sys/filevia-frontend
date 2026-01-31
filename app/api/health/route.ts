/**
 * Health check endpoint to verify backend connectivity
 */

export async function GET() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}


  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (response.ok) {
      const data = await response.json()
      return Response.json({ success: true, backend: data })
    }

    return Response.json(
      { success: false, error: 'Backend not responding' },
      { status: 503 }
    )
  } catch (error) {
    return Response.json(
      { success: false, error: 'Cannot connect to backend' },
      { status: 503 }
    )
  }
}
