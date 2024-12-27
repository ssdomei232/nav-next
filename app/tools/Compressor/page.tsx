'use client'

import { useState } from 'react'
import { ThemeProvider } from 'next-themes'
import FileUpload from '@/components/tools/compressor/FileUpload'
import CompressionOptions from '@/components/tools/compressor/CompressionOptions'
import CompressionResult from '@/components/tools/compressor/CompressionResult'
import ThemeToggle from '@/components/tools/compressor/ThemeToggle'
import Instructions from '@/components/tools/compressor/Instructions'
import useImageCompression from '@/hooks/useImageCompression'

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const { compressImage, compressedImage, isCompressing, progress, error } = useImageCompression()

  const handleCompress = async (format: string) => {
    if (file) {
      await compressImage(file, format)
    }
  }

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">图片压缩工具</h1>
            <ThemeToggle />
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-200">
            <Instructions />
            <FileUpload onFileSelect={setFile} selectedFile={file} />
            {file && (
              <CompressionOptions 
                onCompress={handleCompress}
                isCompressing={isCompressing}
                progress={progress}
              />
            )}
            {compressedImage && (
              <CompressionResult 
                originalImage={file!}
                compressedImage={compressedImage}
              />
            )}
            {error && (
              <p className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

