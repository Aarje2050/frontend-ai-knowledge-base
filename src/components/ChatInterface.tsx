'use client'

import { useState, useRef, useEffect } from 'react'
import { chatQuery } from '@/lib/api'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  sources?: Array<{
    id: number
    content: string
    score: number
    metadata: Record<string, unknown>  // Changed from 'any'
  }>
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await chatQuery(input.trim(), sessionId)
      
      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai',
        content: response.response,
        sources: response.sources,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setSessionId(response.session_id)

    } catch (error) {
      const errorMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setSessionId(undefined)
  }

  const formatMetadata = (metadata: Record<string, unknown>) => {
    const items = []
    if (metadata.filename) items.push(`File: ${metadata.filename}`)
    if (metadata.page) items.push(`Page: ${metadata.page}`)
    if (metadata.chunk_index !== undefined) items.push(`Chunk: ${Number(metadata.chunk_index) + 1}`)
    return items.join(' • ')
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-900">AI Assistant</h3>
        <div className="flex items-center space-x-2">
          {sessionId && (
            <span className="text-xs text-gray-500">Session: {sessionId.slice(0, 8)}</span>
          )}
          <button
            onClick={clearChat}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>Ask me anything about your uploaded documents!</p>
      
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2 text-gray-500">
            <div
              className={`chat-message ${
                message.type === 'user' ? 'user-message' : 'ai-message'
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg">
                  {message.type === 'user' ? '👤' : '🤖'}
                </span>
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="ml-8 space-y-2">
                <p className="text-sm font-medium text-gray-700">Sources:</p>
                {message.sources.map((source) => (
                  <div key={source.id} className="source-item">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-xs text-gray-600">
                        Source {source.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {source.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{source.content}</p>
                    <p className="text-xs text-gray-500">
                      {formatMetadata(source.metadata)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="chat-message ai-message">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🤖</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2  text-gray-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Press Enter to send • {messages.length} messages in conversation
        </p>
      </form>
    </div>
  )
}