import { useState } from 'react'

interface SaveLoadSelectionProps {
  salt: string
  setSalt: (salt: string) => void
  count: number
  setCount: (count: number) => void
  participants: string[]
  setParticipants: (participants: string[]) => void
}

// 定义 SelectionData 类型
interface SelectionData {
  salt: string
  count: number
  participants: string[]
}

export default function SaveLoadSelection({
  salt,
  setSalt,
  count,
  setCount,
  participants,
  setParticipants,
}: SaveLoadSelectionProps) {
  // 使用 SelectionData 类型更新 savedSelections 的类型
  const [savedSelections, setSavedSelections] = useState<{ name: string; data: SelectionData }[]>([])
  const [selectionName, setSelectionName] = useState('')

  const saveSelection = () => {
    if (selectionName) {
      const newSelection = {
        name: selectionName,
        data: { salt, count, participants },
      }
      setSavedSelections([...savedSelections, newSelection])
      setSelectionName('')
    }
  }

  // 使用 SelectionData 类型更新 loadSelection 的参数
  const loadSelection = (selection: { name: string; data: SelectionData }) => {
    setSalt(selection.data.salt)
    setCount(selection.data.count)
    setParticipants(selection.data.participants)
  }

  const deleteSelection = (index: number) => {
    const newSelections = [...savedSelections];
    newSelections.splice(index, 1);
    setSavedSelections(newSelections);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">保存/加载选择</h2>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={selectionName}
            onChange={(e) => setSelectionName(e.target.value)}
            placeholder="输入保存名称"
            className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={saveSelection}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            保存
          </button>
        </div>
        <div className="space-y-2">
          {savedSelections.map((selection, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{selection.name}</span>
              <div>
                <button
                  onClick={() => loadSelection(selection)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors mr-2"
                >
                  加载
                </button>
                <button
                  onClick={() => deleteSelection(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}