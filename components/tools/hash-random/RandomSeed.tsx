import { ChangeEvent, useState } from 'react'

interface RandomSeedProps {
  salt: string
  setSalt: (salt: string) => void
  count: number
  setCount: (count: number) => void
}

export default function RandomSeed({ salt, setSalt, count, setCount }: RandomSeedProps) {
  const [errors, setErrors] = useState({ salt: '', count: '' })

  const validateSalt = (value: string) => {
    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, salt: '请输入随机种子' }))
    } else {
      setErrors(prev => ({ ...prev, salt: '' }))
    }
    setSalt(value)
  }

  const validateCount = (value: number) => {
    if (value < 1) {
      setErrors(prev => ({ ...prev, count: '抽取数量必须大于0' }))
    } else {
      setErrors(prev => ({ ...prev, count: '' }))
    }
    setCount(value)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">随机种子</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        选择一个随机的文本作为种子值。这个种子值将被用作计算哈希值的输入。为了获得最好的排序效果，建议选择事先无法确定的内容作为种子，如明天的热搜第一条，或某一个群聊内最新的一条消息。
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="salt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            填写事先无法预测的文本：
          </label>
          <input
            id="salt"
            type="text"
            value={salt}
            onChange={(e: ChangeEvent<HTMLInputElement>) => validateSalt(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.salt && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salt}</p>}
        </div>
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            抽取数量：
          </label>
          <input
            id="count"
            type="number"
            value={count}
            onChange={(e: ChangeEvent<HTMLInputElement>) => validateCount(Number(e.target.value))}
            className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.count && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.count}</p>}
        </div>
      </div>
    </div>
  )
}

