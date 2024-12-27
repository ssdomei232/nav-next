import { useState } from 'react'

interface ParticipantListProps {
  setParticipants: (participants: string[]) => void
}

export default function ParticipantList({ setParticipants }: ParticipantListProps) {
  const [participantText, setParticipantText] = useState('')

  const handleRoll = () => {
    const participantArray = participantText.split(/[\n\s]+/).filter(Boolean)
    setParticipants(participantArray)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">参与人员</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            按行或空格分开所有参与人名：
          </label>
          <textarea
            id="participants"
            value={participantText}
            onChange={(e) => setParticipantText(e.target.value)}
            className="w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          onClick={handleRoll}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          抽取
        </button>
      </div>
    </div>
  )
}

