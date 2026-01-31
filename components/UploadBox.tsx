'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { convertFile, downloadBlob } from '@/lib/api'

interface UploadBoxProps {
  acceptedFormats?: string[]
  conversionType: string
  onFileSelect?: (file: File) => void
}

export default function UploadBox({
  acceptedFormats = ['.pdf', '.doc', '.docx'],
  conversionType,
  onFileSelect,
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleFileSelect = (file: File) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      setError(`File size exceeds 100MB. Your file is ${formatFileSize(file.size)}.`)
      return
    }

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedFormats.includes(fileExt)) {
      setError(`Invalid file type. Accepted: ${acceptedFormats.join(', ')}`)
      return
    }

    setSelectedFile(file)
    setError(null)
    setConvertedBlob(null)
    setDownloadFilename(null)
    onFileSelect?.(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError(null)
    setConvertedBlob(null)
    setDownloadFilename(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = () => {
    if (convertedBlob && downloadFilename) {
      // Verify blob type before downloading
      console.log('[UploadBox] Downloading file:', downloadFilename)
      console.log('[UploadBox] Blob type:', convertedBlob.type)
      console.log('[UploadBox] Blob size:', convertedBlob.size)
      
      // Ensure filename has correct extension
      const expectedExt = getOutputExtension(conversionType)
      const filenameExt = downloadFilename.split('.').pop()?.toLowerCase()
      
      if (filenameExt !== expectedExt) {
        console.warn(`[UploadBox] Filename extension mismatch! Expected: ${expectedExt}, Got: ${filenameExt}`)
        // Fix the extension
        const baseName = downloadFilename.replace(/\.[^/.]+$/, '')
        const correctedFilename = `${baseName}.${expectedExt}`
        console.log(`[UploadBox] Corrected filename: ${correctedFilename}`)
        downloadBlob(convertedBlob, correctedFilename)
      } else {
        downloadBlob(convertedBlob, downloadFilename)
      }
    }
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a file first!')
      return
    }

    setIsConverting(true)
    setError(null)
    setConvertedBlob(null)
    setDownloadFilename(null)

    try {
      const blob = await convertFile(selectedFile, conversionType)
      const filename =
        (blob as any).filename ||
        `${selectedFile.name.replace(/\.[^/.]+$/, '')}_converted.${getOutputExtension(conversionType)}`
      
      // Store blob and filename for download button
      setConvertedBlob(blob)
      setDownloadFilename(filename)
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Conversion failed.')
      console.error('Conversion error:', err)
    } finally {
      setIsConverting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getOutputExtension = (type: string): string => {
    const map: Record<string, string> = {
      'word-to-pdf': 'pdf',
      'pdf-to-word': 'docx',
      'excel-to-pdf': 'pdf',
      'pdf-to-excel': 'xlsx',
      'ppt-to-pdf': 'pdf',
      'pdf-to-ppt': 'pptx',
      'image-to-pdf': 'pdf',
      'pdf-to-image': 'png',
    }
    return map[type] || 'pdf'
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative overflow-hidden p-4 sm:p-5 text-center cursor-pointer transition-all duration-300 rounded-xl ${
              isDragging 
                ? 'scale-[1.03] shadow-2xl border-orange-400 bg-gradient-to-br from-orange-50 via-amber-50 to-primary-50' 
                : 'hover:scale-[1.01] shadow-md hover:shadow-lg border-orange-300 bg-gradient-to-br from-white via-orange-50/40 to-primary-50/30'
            } border-2 border-dashed`}
          >
            {/* Animated gradient overlay when dragging */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-br from-orange-400/25 via-amber-400/20 to-primary-400/15 rounded-xl"
                style={{
                  animation: 'gradient 3s ease infinite',
                  backgroundSize: '200% 200%',
                }}
              />
            )}
            
            {/* Decorative shimmer effect */}
            {isDragging && (
              <div 
                className="absolute inset-0 opacity-100 pointer-events-none rounded-xl"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
            <motion.div 
              animate={{ y: isDragging ? -5 : 0 }} 
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <motion.div
                animate={{ 
                  scale: isDragging ? 1.08 : 1,
                  rotate: isDragging ? 3 : 0
                }}
                transition={{ duration: 0.3 }}
                className="inline-block mb-2"
              >
                <div className={`p-2.5 rounded-lg bg-white border-2 transition-all duration-300 ${
                  isDragging 
                    ? 'border-orange-400 bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg' 
                    : 'border-orange-300 hover:border-orange-400 hover:shadow-md'
                }`}>
                  <Upload className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto transition-colors duration-300 ${
                    isDragging ? 'text-white' : 'text-orange-600'
                  }`} />
                </div>
              </motion.div>
              <h3 className={`text-base sm:text-lg font-semibold mb-1 transition-colors duration-300 ${
                isDragging ? 'text-orange-700' : 'text-slate-800'
              }`}>
                {isDragging ? 'Drop your file here' : 'Drag & drop your file'}
              </h3>
              <p className={`text-xs sm:text-sm mb-2 transition-colors duration-300 ${
                isDragging ? 'text-orange-600' : 'text-slate-600'
              }`}>
                or click to browse
              </p>
              <p className={`text-xs transition-colors duration-300 ${
                isDragging ? 'text-orange-500' : 'text-slate-500'
              }`}>
                Supported: {acceptedFormats.slice(0, 3).join(', ')}{acceptedFormats.length > 3 ? '...' : ''}
              </p>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isDragging ? 'text-orange-400' : 'text-slate-400'
              }`}>
                Max size: 100MB
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="selected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card p-4 sm:p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${convertedBlob ? 'bg-green-100' : isConverting ? 'bg-blue-100' : 'bg-primary-100'}`}>
                    {convertedBlob ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : isConverting ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <File className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {convertedBlob 
                        ? `Ready (${formatFileSize(convertedBlob.size)})`
                        : formatFileSize(selectedFile.size)
                      }
                    </p>
                  </div>
                </div>
                {!isConverting && !convertedBlob && (
                  <button onClick={handleRemove} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Remove file">
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-start space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </motion.div>
                )}
                
                {convertedBlob && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-2 mb-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-green-800">Conversion Successful!</p>
                        <p className="text-xs text-green-600 mt-0.5">Ready to download</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download {downloadFilename?.split('.').pop()?.toUpperCase()}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!convertedBlob && (
                <div className="space-y-2">
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2.5"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <span>Convert Now</span>
                    )}
                  </button>
                  {!isConverting && (
                    <button
                      onClick={handleRemove}
                      className="w-full btn-secondary text-xs py-2"
                    >
                      Remove File
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
