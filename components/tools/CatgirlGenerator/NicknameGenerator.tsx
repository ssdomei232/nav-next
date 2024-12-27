'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Toast from './Toast'

export default function NicknameGenerator() {
  const [prefix, setPrefix] = useState('爱蜜莉雅')
  const [suffix, setSuffix] = useState('碳~')
  const [result, setResult] = useState('')
  const [result2, setResult2] = useState('')
  const [showToast, setShowToast] = useState(false)

  const generateNickname = () => {
    const wrapped = '\u2067' + suffix.split('').reverse().join('') + '\u2066'
    setResult(prefix + wrapped)
    setResult2(prefix + '\u2067' + suffix + '\u2066')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">基本生成</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">前半部分</label>
          <input
            type="text"
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">后半部分</label>
          <input
            type="text"
            id="suffix"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          onClick={generateNickname}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          生成
        </button>
        <div>
          <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">结果1</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="result"
              value={result}
              readOnly
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={() => copyToClipboard(result)}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
            >
              复制
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="result2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">结果2（修复版）</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="result2"
              value={result2}
              readOnly
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={() => copyToClipboard(result2)}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
            >
              复制
            </button>
          </div>
        </div>
      </div>
      <Toast message="复制成功！" isVisible={showToast} />
    </motion.section>
  )
}

