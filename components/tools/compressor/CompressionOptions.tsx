import { useState } from 'react'
import { motion } from 'framer-motion'

interface CompressionOptionsProps {
  onCompress: (format: string) => void
  isCompressing: boolean
  progress: number
}

export default function CompressionOptions({ onCompress, isCompressing, progress }: CompressionOptionsProps) {
  const [format, setFormat] = useState('webp')

  return (
    <div className="mt-6">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            输出格式
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>
      </div>
      <motion.button
        onClick={() => onCompress(format)}
        disabled={isCompressing}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCompressing ? '压缩中...' : '开始压缩'}
      </motion.button>
      {isCompressing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">{progress}%</p>
        </div>
      )}
    </div>
  )
}

