'use client'

import { useState } from 'react'
import { X, Download } from 'lucide-react'

interface ImagePreviewModalProps {
  isOpen: boolean
  imageUrl: string | null
  onClose: () => void
  title?: string
}

export function ImagePreviewModal({ isOpen, imageUrl, onClose, title = 'Image Preview' }: ImagePreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen || !imageUrl) return null

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image-${Date.now()}.jpg`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-slate-50 p-6">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-500">{new URL(imageUrl).hostname}</p>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  )
}
