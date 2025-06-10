'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import DocumentUpload from '@/components/DocumentUpload'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'upload'>('upload')

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 Upload Documents
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💬 Chat with Documents
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'upload' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <p className="text-gray-600 mb-6">
              Upload your documents to start chatting with them. Supported formats: PDF, DOCX, TXT, MD
            </p>
            <DocumentUpload />
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Chat with Your Documents</h2>
            <p className="text-gray-600 mb-6">
              Ask questions about your uploaded documents. The AI will search through them and provide answers with source citations.
            </p>
            <ChatInterface />
          </div>
        )}
      </div>

    
    </div>
  )
}