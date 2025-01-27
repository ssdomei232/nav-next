"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, RotateCcw, Download, Upload, Trash2, Edit2, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface Checklist {
  id: string
  name: string
  items: ChecklistItem[]
}

export function CombinedChecklistAppComponent() {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [currentChecklist, setCurrentChecklist] = useState<string>('')
  const [newItemText, setNewItemText] = useState('')
  const [newChecklistName, setNewChecklistName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    const savedChecklists = localStorage.getItem('checklists')
    if (savedChecklists) {
      setChecklists(JSON.parse(savedChecklists))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('checklists', JSON.stringify(checklists))
  }, [checklists])

  const addChecklist = () => {
    if (newChecklistName.trim() === '') return
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      name: newChecklistName,
      items: []
    }
    setChecklists([...checklists, newChecklist])
    setNewChecklistName('')
    setCurrentChecklist(newChecklist.id)
    showToast({
      title: "新检查单已创建",
      description: `"${newChecklistName}" 已添加到您的检查单列表。`,
    })
  }

  const addItem = () => {
    if (newItemText.trim() === '' || currentChecklist === '') return
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false
    }
    setChecklists(checklists.map(list => 
      list.id === currentChecklist 
        ? { ...list, items: [...list.items, newItem] }
        : list
    ))
    setNewItemText('')
  }

  const toggleItem = (itemId: string) => {
    setChecklists(checklists.map(list => 
      list.id === currentChecklist 
        ? {
            ...list,
            items: list.items.map(item => 
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : list
    ))
  }

  const deleteItem = (itemId: string) => {
    setChecklists(checklists.map(list => 
      list.id === currentChecklist 
        ? {
            ...list,
            items: list.items.filter(item => item.id !== itemId)
          }
        : list
    ))
    showToast({
      title: "检查项已删除",
      description: "该项目已从您的检查单中移除。",
    })
  }

  const resetChecklist = () => {
    setChecklists(checklists.map(list => 
      list.id === currentChecklist 
        ? { ...list, items: list.items.map(item => ({ ...item, completed: false })) }
        : list
    ))
    showToast({
      title: "检查单已重置",
      description: "所有项目已标记为未完成。",
    })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(checklists)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'checklists.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    showToast({
      title: "数据已导出",
      description: "您的检查单数据已成功导出为 JSON 文件。",
    })
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          try {
            const importedChecklists = JSON.parse(content)
            setChecklists(importedChecklists)
            showToast({
              title: "数据导入成功",
              description: "您的检查单已成功导入。",
            })
          } catch (error) {
            showToast({
              title: "导入失败",
              description: "无法解析导入的文件。请确保它是有效的 JSON 格式。",
              variant: "destructive",
            })
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const saveEdit = (id: string) => {
    setChecklists(checklists.map(list => 
      list.id === id ? { ...list, name: editName } : list
    ))
    setEditingId(null)
    showToast({
      title: "检查单已更新",
      description: `检查单名称已更改为 "${editName}"。`,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter(list => list.id !== id))
    if (currentChecklist === id) {
      setCurrentChecklist('')
    }
    showToast({
      title: "检查单已删除",
      description: "该检查单及其所有项目已被移除。",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        检查单应用
      </motion.h1>

      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="checklist">检查单</TabsTrigger>
          <TabsTrigger value="manage">管理检查单</TabsTrigger>
        </TabsList>
        <TabsContent value="checklist">
          <motion.div 
            className="mb-6 p-4 bg-card rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Label htmlFor="new-checklist" className="text-lg font-semibold mb-2 block">新建检查单</Label>
            <div className="flex mt-1">
              <Input
                id="new-checklist"
                value={newChecklistName}
                onChange={(e) => setNewChecklistName(e.target.value)}
                placeholder="输入检查单名称"
                className="mr-2 flex-grow"
              />
              <Button onClick={addChecklist} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> 添加
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="mb-6 p-4 bg-card rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="checklist-select" className="text-lg font-semibold mb-2 block">选择检查单</Label>
            <Select value={currentChecklist} onValueChange={setCurrentChecklist}>
              <SelectTrigger id="checklist-select" className="w-full">
                <SelectValue placeholder="选择一个检查单" />
              </SelectTrigger>
              <SelectContent>
                {checklists.map(list => (
                  <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {currentChecklist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 p-4 bg-card rounded-lg shadow-md">
                <Label htmlFor="new-item" className="text-lg font-semibold mb-2 block">添加检查项</Label>
                <div className="flex mt-1">
                  <Input
                    id="new-item"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="输入新的检查项"
                    className="mr-2 flex-grow"
                  />
                  <Button onClick={addItem} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> 添加
                  </Button>
                </div>
              </div>

              <motion.ul className="space-y-2 mb-6">
                <AnimatePresence>
                  {checklists.find(list => list.id === currentChecklist)?.items.map(item => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                        item.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-card'
                      } shadow-sm hover:shadow-md`}
                    >
                      <motion.div 
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center cursor-pointer ${
                          item.completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                        }`}
                        onClick={() => toggleItem(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {item.completed && <Check className="w-4 h-4 text-white" />}
                      </motion.div>
                      <span className={`flex-grow ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.text}
                      </span>
                      <motion.button
                        onClick={() => deleteItem(item.id)}
                        className="text-destructive hover:text-destructive/90 p-1 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>

              <div className="flex space-x-2 mb-4">
                <Button onClick={resetChecklist} variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" /> 重置
                </Button>
                <Button onClick={exportData} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> 导出
                </Button>
                <Button variant="outline" className="relative flex-1">
                  <Upload className="w-4 h-4 mr-2" /> 导入
                  <input
                    type="file"
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".json"
                  />
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>
        <TabsContent value="manage">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence>
              {checklists.map(checklist => (
                <motion.div
                  key={checklist.id}
                  className="bg-card rounded-lg shadow-md p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {editingId === checklist.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-grow"
                        placeholder="输入新的检查单名称"
                      />
                      <Button onClick={() => saveEdit(checklist.id)} size="icon" variant="ghost">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button onClick={cancelEdit} size="icon" variant="ghost">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">{checklist.name}</span>
                      <div className="space-x-2">
                        <Button onClick={() => startEditing(checklist.id, checklist.name)} size="icon" variant="ghost">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>确认删除</DialogTitle>
                            </DialogHeader>
                            <p className="text-muted-foreground">
                              您确定要删除 &quot;{checklist.name}&quot; 检查单吗？此操作无法撤销。
                            </p>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button variant="outline" onClick={() => {}}>取消</Button>
                              <Button variant="destructive" onClick={() => deleteChecklist(checklist.id)}>删除</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    共 {checklist.items.length} 个项目，
                    {checklist.items.filter(item => item.completed).length} 个已完成
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {checklists.length === 0 && (
            <motion.p
              className="text-center text-muted-foreground mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              暂无检查单。请在检查单标签页创建新的检查单。
            </motion.p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}