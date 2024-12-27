interface HashTableProps {
    results: [string, string, number][]
    saltHash: string
  }
  
  export default function HashTable({ results }: HashTableProps) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">哈希表</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">为保持页面性能，仅显示前面最多 1000 位人员的哈希校验</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100 dark:bg-indigo-900">
                <th className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-left text-indigo-800 dark:text-indigo-200">序号</th>
                <th className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-left text-indigo-800 dark:text-indigo-200">参与人</th>
                <th className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-left text-indigo-800 dark:text-indigo-200">哈希值</th>
                <th className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-left text-indigo-800 dark:text-indigo-200">与种子的距离</th>
              </tr>
            </thead>
            <tbody>
              {results.map(([name, hash, distance], index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}>
                  <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-gray-800 dark:text-gray-200">{name}</td>
                  <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 font-mono text-sm text-gray-800 dark:text-gray-200">{hash}</td>
                  <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-2 text-gray-800 dark:text-gray-200">{distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  