import { useState } from 'react'
import Image from 'next/image'

interface CompressionResultProps {
  originalImage: File
  compressedImage: File
}

export default function CompressionResult({ originalImage, compressedImage }: CompressionResultProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  const originalSizeKB = (originalImage.size / 1024).toFixed(2)
  const compressedSizeKB = (compressedImage.size / 1024).toFixed(2)
  const compressionRatio = ((1 - compressedImage.size / originalImage.size) * 100).toFixed(2)

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">压缩结果</h2>
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">原始大小</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{originalSizeKB} KB</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">压缩后大小</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compressedSizeKB} KB</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">压缩比例</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compressionRatio}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">输出格式</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compressedImage.type.split('/')[1].toUpperCase()}</p>
          </div>
        </div>
        <div className="mt-4">
          <a
            href={URL.createObjectURL(compressedImage)}
            download={`compressed_${compressedImage.name}`}
            className="inline-block bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-600 dark:hover:bg-green-700"
          >
            下载压缩后的图片
          </a>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">图片对比</h3>
        <div className="relative">
          <Image
            src={URL.createObjectURL(showOriginal ? originalImage : compressedImage)}
            alt="Compressed Image"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
          />
          <button
            className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-md text-sm font-medium"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            {showOriginal ? '显示压缩后' : '显示原图'}
          </button>
        </div>
      </div>
    </div>
  )
}

