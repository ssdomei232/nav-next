"use client";

import NicknameGenerator from '@/components/tools/CatgirlGenerator/NicknameGenerator'
import TextReversal from '@/components/tools/CatgirlGenerator/TextReversal'
import CustomTemplate from '@/components/tools/CatgirlGenerator/CustomTemplate'
import DarkModeToggle from '@/components/tools/CatgirlGenerator/DarkModeToggle'
import Footer from "@/components/tools/CatgirlGenerator/Footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">扩展昵称生成器</h1>
          <DarkModeToggle />
        </header>
        <main>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">原理说明</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              效果：当别人@你时，会在@的文字后面加上一另段文字。下图结尾的「喵~」不是发送者输入的。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {['step1.jpg', 'step2.jpg', 'example.jpg'].map((img, index) => (
                <img 
                  key={index}
                  src={`/img/CatgirlGenerator/${img}`} 
                  alt={`Example ${index + 1}`} 
                  className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              原理：用unicode控制字符 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">RLI</code> 和 
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">LRI</code> 包裹倒序的后缀部分，
              在别人@后，@后面的文本会跑到被包裹部分的前面去。
            </p>
          </section>
          <NicknameGenerator />
          <TextReversal />
          <CustomTemplate />
        </main>
      </div>
      <Footer />
    </div>
  )
}

