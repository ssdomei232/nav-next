'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Package, Trash2, Search, BarChart, Download, Upload, Edit2, Save, Warehouse } from 'lucide-react'
import { motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Badge } from "@/components/ui/badge"
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  warehouse: string;
  location: string;
  price: number;
  totalValue: number;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [newItemWarehouse, setNewItemWarehouse] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editingItemName, setEditingItemName] = useState("")
  const [editingItemPrice, setEditingItemPrice] = useState("")
  const [warehouses, setWarehouses] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("inventory")
  const [newItemLocation, setNewItemLocation] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof InventoryItem>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingItemLocation, setEditingItemLocation] = useState("")
  const [editingItemWarehouse, setEditingItemWarehouse] = useState("")

  // 组件挂载时从localStorage加载库存和仓库数据
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory')
    const savedWarehouses = localStorage.getItem('warehouses')
    if (savedInventory) setInventory(JSON.parse(savedInventory))
    if (savedWarehouses) setWarehouses(JSON.parse(savedWarehouses))
  }, [])

  // 库存或仓库数据变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory))
    localStorage.setItem('warehouses', JSON.stringify(warehouses))
  }, [inventory, warehouses])

  const addItem = () => {
    if (newItemName && newItemQuantity && newItemWarehouse && newItemLocation && newItemPrice) {
      const quantity = parseInt(newItemQuantity) || 0;
      const price = parseFloat(newItemPrice) || 0;
      const newItem: InventoryItem = {
        id: Date.now(),
        name: newItemName,
        quantity: quantity,
        warehouse: newItemWarehouse,
        location: newItemLocation,
        price: price,
        totalValue: quantity * price,
      }
      setInventory([...inventory, newItem])
      setNewItemName("")
      setNewItemQuantity("")
      setNewItemWarehouse("")
      setNewItemLocation("")
      setNewItemPrice("")
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, (item.quantity || 0) + change);
        const price = item.price || 0;
        return { ...item, quantity: newQuantity, totalValue: newQuantity * price };
      }
      return item;
    }));
  }

  const confirmDelete = (id: number) => {
    setItemToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const deleteItem = () => {
    if (itemToDelete !== null) {
      setInventory(inventory.filter(item => item.id !== itemToDelete))
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  const startEditing = (id: number, name: string, price: number, location: string, warehouse: string) => {
    setEditingItemId(id)
    setEditingItemName(name)
    setEditingItemPrice(price.toString())
    setEditingItemLocation(location)
    setEditingItemWarehouse(warehouse)
  }

  const saveEdit = () => {
    if (editingItemId !== null) {
      setInventory(inventory.map(item => {
        if (item.id === editingItemId) {
          const newPrice = parseFloat(editingItemPrice) || item.price;
          return { 
            ...item, 
            name: editingItemName, 
            price: newPrice,
            location: editingItemLocation,
            warehouse: editingItemWarehouse,
            totalValue: item.quantity * newPrice
          }
        }
        return item
      }))
      setEditingItemId(null)
      setEditingItemName("")
      setEditingItemPrice("")
      setEditingItemLocation("")
      setEditingItemWarehouse("")
    }
  }

  const handleSort = (column: keyof InventoryItem) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const exportData = () => {
    const dataStr = JSON.stringify({ inventory, warehouses })
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'inventory_backup.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          setInventory(importedData.inventory)
          setWarehouses(importedData.warehouses)
        } catch (error) {
          console.error('Error parsing imported data:', error)
          alert('导入失败，请确保文件格式正确。')
        }
      }
      reader.readAsText(file)
    }
  }

  const getInventoryChartData = () => {
    return inventory.map(item => ({
      name: item.name,
      quantity: item.quantity || 0,
      totalValue: (item.quantity || 0) * (item.price || 0),
      warehouse: item.warehouse
    }))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">库存管理系统</h1>
        <p className="text-xl">高效管理家里的众多小破烂</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">库存管理</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="warehouses">仓库管理</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div {...fadeIn}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2" />
                    入库
                  </CardTitle>
                  <CardDescription>添加新商品到库存</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="itemName">商品名称</Label>
                      <Input
                        id="itemName"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="输入商品名称"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemQuantity">数量</Label>
                      <Input
                        id="itemQuantity"
                        type="number"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        placeholder="输入数量"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemWarehouse">仓库</Label>
                      <Select onValueChange={setNewItemWarehouse} value={newItemWarehouse}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择仓库" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse} value={warehouse}>
                              {warehouse}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="itemLocation">货品位置</Label>
                      <Input
                        id="itemLocation"
                        value={newItemLocation}
                        onChange={(e) => setNewItemLocation(e.target.value)}
                        placeholder="输入货品位置"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemPrice">单价</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="输入单价"
                      />
                    </div>
                    <Button onClick={addItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> 添加商品
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2" />
                    库存概览
                  </CardTitle>
                  <CardDescription>查看和管理现有库存</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-4">
                    <div>
                      <Label htmlFor="search">搜索商品或仓库</Label>
                      <div className="flex">
                        <Input
                          id="search"
                          type="text"
                          placeholder="输入商品名称或仓库"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mr-2"
                        />
                        <Button variant="outline">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={exportData}>
                        <Download className="mr-2 h-4 w-4" /> 导出数据
                      </Button>
                      <div>
                        <Input
                          type="file"
                          id="importData"
                          className="hidden"
                          onChange={importData}
                          accept=".json"
                        />
                        <Button variant="outline" onClick={() => document.getElementById('importData')?.click()}>
                          <Upload className="mr-2 h-4 w-4" /> 导入数据
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('name')}>
                              商品名称 {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('quantity')}>
                              库存数量 {sortColumn === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('warehouse')}>
                              仓库 {sortColumn === 'warehouse' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('location')}>
                              位置 {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('price')}>
                              单价 {sortColumn === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('totalValue')}>
                              总价 {sortColumn === 'totalValue' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </Button>
                          </TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {editingItemId === item.id ? 
                                <Input
                                  value={editingItemName}
                                  onChange={(e) => setEditingItemName(e.target.value)}
                                  className="w-full"
                                /> : item.name
                              }
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.quantity}</Badge>
                            </TableCell>
                            <TableCell>
                              {editingItemId === item.id ? 
                                <Select value={editingItemWarehouse} onValueChange={setEditingItemWarehouse}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择仓库" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {warehouses.map((warehouse) => (
                                      <SelectItem key={warehouse} value={warehouse}>
                                        {warehouse}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                : item.warehouse
                              }
                            </TableCell>
                            <TableCell>
                              {editingItemId === item.id ? 
                                <Input
                                  value={editingItemLocation}
                                  onChange={(e) => setEditingItemLocation(e.target.value)}
                                  className="w-full"
                                /> : item.location
                              }
                            </TableCell>
                            <TableCell>
                              {editingItemId === item.id ? 
                                <Input
                                  type="number"
                                  value={editingItemPrice}
                                  onChange={(e) => setEditingItemPrice(e.target.value)}
                                  className="w-full"
                                /> : 
                                <TooltipProvider>
                                  <ShadTooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help">¥{item.price?.toFixed(2) ?? '0.00'}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>点击编辑按钮修改单价</p>
                                    </TooltipContent>
                                  </ShadTooltip>
                                </TooltipProvider>
                              }
                            </TableCell>
                            <TableCell>¥{item.totalValue?.toFixed(2) ?? '0.00'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                {editingItemId === item.id ? (
                                  <Button size="sm" variant="outline" onClick={saveEdit}>
                                    <Save className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => startEditing(item.id, item.name, item.price, item.location, item.warehouse)}>
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" onClick={() => confirmDelete(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>所有货品数量图表</CardTitle>
              <CardDescription>展示所有货品的库存数量</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={getInventoryChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#8884d8" name="库存数量" yAxisId="left" />
                  <Bar dataKey="totalValue" fill="#82ca9d" name="总价值" yAxisId="right" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="warehouses">
          <WarehouseManagement 
            warehouses={warehouses} 
            setWarehouses={setWarehouses} 
            inventory={inventory}
            setInventory={setInventory}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个商品吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={deleteItem}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function WarehouseManagement({ warehouses, setWarehouses, inventory, setInventory }: { warehouses: string[], setWarehouses: React.Dispatch<React.SetStateAction<string[]>>, inventory: InventoryItem[], setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>> }) {
  const [newWarehouse, setNewWarehouse] = useState("")
  const [editingWarehouse, setEditingWarehouse] = useState<string | null>(null)
  const [editedWarehouseName, setEditedWarehouseName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [warehouseToDelete, setWarehouseToDelete] = useState<string | null>(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState("")

  const addWarehouse = () => {
    if (newWarehouse && !warehouses.includes(newWarehouse)) {
      setWarehouses([...warehouses, newWarehouse])
      setNewWarehouse("")
    }
  }

  const startEditing = (warehouse: string) => {
    setEditingWarehouse(warehouse)
    setEditedWarehouseName(warehouse)
  }

  const saveEdit = () => {
    if (editingWarehouse && editedWarehouseName) {
      setWarehouses(warehouses.map(w => w === editingWarehouse ? editedWarehouseName : w))
      setEditingWarehouse(null)
      setEditedWarehouseName("")
      setInventory(inventory.map(item => 
        item.warehouse === editingWarehouse 
          ? { ...item, warehouse: editedWarehouseName } 
          : item
      ))
    }
  }

  const confirmDelete = (warehouse: string) => {
    setWarehouseToDelete(warehouse)
    setDeleteConfirmOpen(true)
    setConfirmDeleteName("")
  }

  const deleteWarehouse = () => {
    if (warehouseToDelete && confirmDeleteName === warehouseToDelete) {
      setWarehouses(warehouses.filter(w => w !== warehouseToDelete))
      setInventory(inventory.filter(item => item.warehouse !== warehouseToDelete))
      setDeleteConfirmOpen(false)
      setWarehouseToDelete(null)
      setConfirmDeleteName("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Warehouse className="mr-2" />
          仓库管理
        </CardTitle>
        <CardDescription>添加、编辑或删除仓库</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newWarehouse}
              onChange={(e) => setNewWarehouse(e.target.value)}
              placeholder="输入新仓库名称"
            />
            <Button onClick={addWarehouse}>
              <Plus className="mr-2 h-4 w-4" /> 添加仓库
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>仓库名称</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse}>
                    <TableCell>
                      {editingWarehouse === warehouse ? (
                        <Input
                          value={editedWarehouseName}
                          onChange={(e) => setEditedWarehouseName(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        warehouse
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingWarehouse === warehouse ? (
                          <Button size="sm" variant="outline" onClick={saveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEditing(warehouse)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => confirmDelete(warehouse)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除仓库</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除仓库 &quot{warehouseToDelete}&quot 吗？此操作无法撤销。请输入仓库名称以确认删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={confirmDeleteName}
              onChange={(e) => setConfirmDeleteName(e.target.value)}
              placeholder="输入仓库名称"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={deleteWarehouse} disabled={confirmDeleteName !== warehouseToDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}