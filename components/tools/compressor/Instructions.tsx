export default function Instructions() {
    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">使用说明</h2>
        <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-200">
          <li>拖放或点击上传按钮选择要压缩的图片</li>
          <li>选择输出格式（WebP、JPEG 或 PNG）</li>
          <li>点击&quot;开始压缩&quot;按钮</li>
          <li>等待压缩完成，查看结果并下载压缩后的图片</li>
        </ol>
      </div>
    )
  }
  
  