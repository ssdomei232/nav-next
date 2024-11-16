'use client'

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useState } from "react"

type NavItem = {
  name: string
  url: string
  description: string
}

type SubCategory = {
  name: string
  items: NavItem[]
}

type CategoryData = {
  [key: string]: SubCategory[]
}

export function Navigation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeSubCategory, setActiveSubCategory] = useState("all")
  const [data, setData] = useState<CategoryData>({})
  const [filteredItems, setFilteredItems] = useState<NavItem[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/load-yaml-data');
        const yamlData = await response.json();
        setData(yamlData);
      } catch (error) {
        console.error('Failed to load YAML data:', error);
      }
    }
    loadData();
  }, [])

  useEffect(() => {
    let items: NavItem[] = []
    
    if (activeCategory === "all") {
      items = Object.values(data).flatMap(subCategories => 
        subCategories.flatMap(subCategory => subCategory.items)
      )
    } else if (activeSubCategory === "all") {
      items = data[activeCategory]?.flatMap(subCategory => subCategory.items) || []
    } else {
      items = data[activeCategory]?.find(subCategory => subCategory.name === activeSubCategory)?.items || []
    }

    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredItems(items)
  }, [searchTerm, activeCategory, activeSubCategory, data])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md overflow-y-auto">
        <ScrollArea className="h-full">
          <nav className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">APS NAV</h2>
            <button
              onClick={() => {
                setActiveCategory("all")
                setActiveSubCategory("all")
              }}
              className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ease-in-out ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            >
              全部
            </button>
            {Object.entries(data).map(([category, subCategories]) => (
              <div key={category} className="mt-2">
                <button
                  onClick={() => {
                    toggleCategory(category)
                    setActiveCategory(category)
                    setActiveSubCategory("all")
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ease-in-out flex items-center justify-between ${activeCategory === category ? "bg-primary text-primary-foreground" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                >
                  <span>{category}</span>
                  {expandedCategories.includes(category) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {expandedCategories.includes(category) && (
                  <div className="ml-4 mt-1">
                    {subCategories.map((subCategory) => (
                      <button
                        key={subCategory.name}
                        onClick={() => {
                          setActiveCategory(category)
                          setActiveSubCategory(subCategory.name)
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ease-in-out ${activeCategory === category && activeSubCategory === subCategory.name ? "bg-secondary text-secondary-foreground" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                      >
                        {subCategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            className="w-full max-w-md mx-auto"
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md transition-all hover:shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">没有找到相关项目</p>
          </div>
        )}
      </main>
    </div>
  )
}