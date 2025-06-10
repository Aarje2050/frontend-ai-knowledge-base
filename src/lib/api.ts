const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types
interface ChatResponse {
  response: string
  sources: Array<{
    id: number
    content: string
    score: number
    metadata: Record<string, unknown>  // Changed from 'any'
  }>
  session_id: string
  timestamp: string
}

interface UploadResponse {
  message: string
  document_id: string
  filename: string
  chunks_processed: number
}

// API Functions
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('company_id', 'default')

  const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Upload failed')
  }

  return response.json()
}

export async function chatQuery(message: string, sessionId?: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Query failed')
  }

  return response.json()
}

export async function testSearch(query: string = 'test query') {
  const response = await fetch(`${API_BASE_URL}/api/chat/test?query=${encodeURIComponent(query)}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Test failed')
  }

  return response.json()
}

export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/health`)
  
  if (!response.ok) {
    throw new Error('Health check failed')
  }

  return response.json()
}