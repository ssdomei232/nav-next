'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Toast from './Toast'

export default function TextReversal() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [showToast, setShowToast] = useState(false)

  const reverseText = () => {
    setOutput(input.split('').reverse().join(''))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">文本反转</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">输入</label>
          <input
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={reverseText}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">输出</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="output"
              value={output}
              readOnly
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={copyToClipboard}
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

