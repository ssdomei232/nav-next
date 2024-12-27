import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CoreAlgorithm() {
  const distanceCode = `
function calcMd5Distance(s1, s2) {
    let distance = 0;
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) {
            continue;
        }
        distance += Math.abs(s1.charCodeAt(i) - s2.charCodeAt(i));
    }
    return distance;
}
  `

  const sortCode = `
function makeSortedNameHashDistanceTuple(targetHash, names) {
    let nameHashDistanceTuple = names.map((name) => {
        let nameMd5 = makeMd5(name);
        let distance = calcMd5Distance(targetHash, nameMd5);
        return [name, nameMd5, distance];
    });
    // sort by distance
    nameHashDistanceTuple.sort((a, b) => {
        return a[2] - b[2];
    });
    return nameHashDistanceTuple;
}
  `

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">核心算法</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">md5 哈希计算依赖 js-md5 库。</p>
      <div className="mb-6">
        <SyntaxHighlighter language="html" style={tomorrow} className="rounded-md">
          {'<script src="https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js"></script>'}
        </SyntaxHighlighter>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-300">哈希距离计算算法</h3>
        <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-md">
          {distanceCode}
        </SyntaxHighlighter>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-300">哈希距离排序算法</h3>
        <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-md">
          {sortCode}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

