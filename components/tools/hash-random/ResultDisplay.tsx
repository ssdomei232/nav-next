import { useState } from "react";

interface ResultDisplayProps {
  results: [string, string, number][];
  saltHash: string;
}

export default function ResultDisplay({
  results,
  saltHash,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const resultText = results.map(([name]) => name).join("\n");
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">
        随机结果
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        此网页将逐一比较每个参与者的哈希值与种子的哈希值。通过计算它们之间的相似度，可以找出与种子值最接近的参与者，并将他们按照相似度的程度进行排序。这种排序方法可以确保在每次排序过程中都能产生一致而可靠的结果，满足了「事后可复现」。
      </p>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="results"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            抽取结果：
          </label>
          <div className="flex">
            <textarea
              id="results"
              value={results.map(([name]) => name).join("\n")}
              readOnly
              className="flex-grow h-32 border-gray-300 rounded-l-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleCopy}
              className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="saltHash"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            种子哈希：
          </label>
          <input
            id="saltHash"
            type="text"
            value={saltHash}
            readOnly
            className="w-full border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
