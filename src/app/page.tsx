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

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          🚀 Phase 1 Testing Instructions
        </h3>
        <div className="text-blue-800 space-y-2">
          <p>1. <strong>Upload Documents:</strong> Start by uploading 5-6 test documents using the upload tab</p>
          <p>2. <strong>Wait for Processing:</strong> Documents need to be processed before you can chat with them</p>
          <p>3. <strong>Test Queries:</strong> Try different types of questions to test accuracy:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Specific fact queries: "What is the vacation policy?"</li>
            <li>Complex questions: "How do performance reviews work?"</li>
            <li>Comparison questions: "What are the different types of leave?"</li>
          </ul>
          <p>4. <strong>Check Sources:</strong> Verify that the AI is citing the correct documents and information</p>
        </div>
      </div>
    </div>
  )
}