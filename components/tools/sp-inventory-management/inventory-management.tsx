'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Package, Trash2, Search, BarChart, Download, Upload, Edit2, Save, Warehouse, TrendingUp, Users, ShoppingCart } from 'lucide-react'
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
import { format } from 'date-fns'

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  warehouse: string;
  unitPrice: number;
  supplier: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface OutboundRecord {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  recipient: string;
  date: string;
  warehouse: string;
  supplier: string;
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
  const [newItemUnitPrice, setNewItemUnitPrice] = useState("")
  const [newItemSupplier, setNewItemSupplier] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editingItemName, setEditingItemName] = useState("")
  const [warehouses, setWarehouses] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("inventory")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [outboundRecords, setOutboundRecords] = useState<OutboundRecord[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem | 'totalValue'; direction: 'ascending' | 'descending' } | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory')
    const savedWarehouses = localStorage.getItem('warehouses')
    const savedSuppliers = localStorage.getItem('suppliers')
    const savedProducts = localStorage.getItem('products')
    const savedOutboundRecords = localStorage.getItem('outboundRecords')
    if (savedInventory) setInventory(JSON.parse(savedInventory))
    if (savedWarehouses) setWarehouses(JSON.parse(savedWarehouses))
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers))
    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedOutboundRecords) setOutboundRecords(JSON.parse(savedOutboundRecords))
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory))
    localStorage.setItem('warehouses', JSON.stringify(warehouses))
    localStorage.setItem('suppliers', JSON.stringify(suppliers))
    localStorage.setItem('products', JSON.stringify(products))
    localStorage.setItem('outboundRecords', JSON.stringify(outboundRecords))
  }, [inventory, warehouses, suppliers, products, outboundRecords])

  const addItem = () => {
    if (newItemName && newItemQuantity && newItemWarehouse && newItemUnitPrice && newItemSupplier) {
      const newItem: InventoryItem = {
        id: Date.now(),
        name: newItemName,
        quantity: parseInt(newItemQuantity),
        warehouse: newItemWarehouse,
        unitPrice: parseFloat(newItemUnitPrice),
        supplier: newItemSupplier,
      }
      setInventory([...inventory, newItem])
      setNewItemName("")
      setNewItemQuantity("")
      setNewItemWarehouse("")
      setNewItemUnitPrice("")
      setNewItemSupplier("")
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
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

  const startEditing = (id: number, name: string) => {
    setEditingItemId(id)
    setEditingItemName(name)
  }

  const saveEdit = () => {
    if (editingItemId !== null) {
      setInventory(inventory.map(item => {
        if (item.id === editingItemId) {
          return { ...item, name: editingItemName }
        }
        return item
      }))
      setEditingItemId(null)
      setEditingItemName("")
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedInventory = sortConfig !== null 
    ? [...filteredInventory].sort((a, b) => {
        if (sortConfig.key === 'totalValue') {
          const aTotal = a.quantity * a.unitPrice;
          const bTotal = b.quantity * b.unitPrice;
          return sortConfig.direction === 'ascending' ? aTotal - bTotal : bTotal - aTotal;
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      })
    : filteredInventory;

  const requestSort = (key: keyof InventoryItem | 'totalValue') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const exportData = () => {
    const dataStr = JSON.stringify({ 
      inventory, 
      warehouses, 
      suppliers, 
      products, 
      outboundRecords 
    })
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
          setSuppliers(importedData.suppliers)
          setProducts(importedData.products)
          setOutboundRecords(importedData.outboundRecords)
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
      quantity: item.quantity,
      totalValue: item.quantity * item.unitPrice
    }))
  }

  const addOutboundRecord = (productId: number, productName: string, quantity: number, recipient: string, warehouse: string, supplier: string) => {
    const newRecord: OutboundRecord = {
      id: Date.now(),
      productId,
      productName,
      quantity,
      recipient,
      date: new Date().toISOString(),
      warehouse,
      supplier
    }
    setOutboundRecords(prevRecords => [...prevRecords, newRecord])

    // 更新库存
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(0, item.quantity - quantity) } 
          : item
      )
    )
  }

  const updateWarehouseName = (oldName: string, newName: string) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.warehouse === oldName ? { ...item, warehouse: newName } : item
      )
    )
    setOutboundRecords(prevRecords => 
      prevRecords.map(record => 
        record.warehouse === oldName ? { ...record, warehouse: newName } : record
      )
    )
  }

  const updateSupplierName = (oldName: string, newName: string) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.supplier === oldName ? { ...item, supplier: newName } : item
      )
    )
    setOutboundRecords(prevRecords => 
      prevRecords.map(record => 
        record.supplier === oldName ? { ...record, supplier: newName } : record
      )
    )
  }

  const updateProductName = (oldName: string, newName: string) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.name === oldName ? { ...item, name: newName } : item
      )
    )
    setOutboundRecords(prevRecords => 
      prevRecords.map(record => 
        record.productName === oldName ? { ...record, productName: newName } : record
      )
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">库存管理系统</h1>
        <p className="text-xl">高效管理您的多仓库商品库存</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="inventory">库存管理</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="warehouses">仓库管理</TabsTrigger>
          <TabsTrigger value="suppliers">供应商管理</TabsTrigger>
          <TabsTrigger value="products">商品管理</TabsTrigger>
          <TabsTrigger value="outbound">出库记录</TabsTrigger>
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
                      <Select onValueChange={setNewItemName} value={newItemName}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择商品" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.name}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="itemUnitPrice">单价</Label>
                      <Input
                        id="itemUnitPrice"
                        type="number"
                        value={newItemUnitPrice}
                        onChange={(e) => setNewItemUnitPrice(e.target.value)}
                        placeholder="输入单价"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemSupplier">供应商</Label>
                      <Select onValueChange={setNewItemSupplier} value={newItemSupplier}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择供应商" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.name}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="search">搜索商品、仓库或供应商</Label>
                      <div className="flex">
                        
                        <Input
                          id="search"
                          type="text"
                          placeholder="输入商品名称、仓库或供应商"
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
                          <TableHead onClick={() => requestSort('name')} className="cursor-pointer">商品名称 {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</TableHead>
                          <TableHead onClick={() => requestSort('quantity')} className="cursor-pointer">库存数量 {sortConfig?.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</TableHead>
                          <TableHead onClick={() => requestSort('warehouse')} className="cursor-pointer">仓库 {sortConfig?.key === 'warehouse' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</TableHead>
                          <TableHead onClick={() => requestSort('unitPrice')} className="cursor-pointer">单价 {sortConfig?.key === 'unitPrice' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</TableHead>
                          <TableHead onClick={() => requestSort('supplier')} className="cursor-pointer">供应商 {sortConfig?.key === 'supplier' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</TableHead>
                          <TableHead onClick={() => requestSort('totalValue')} className="cursor-pointer">总价值 {sortConfig?.key === 'totalValue' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</TableHead>
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
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.warehouse}</TableCell>
                            <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>{item.supplier}</TableCell>
                            <TableCell>{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
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
                                  <Button size="sm" variant="outline" onClick={() => startEditing(item.id, item.name)}>
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
              <CardTitle>所有货品数量和价值图表</CardTitle>
              <CardDescription>展示所有货品的库存数量和总价值</CardDescription>
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
                  <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="库存数量" />
                  <Bar yAxisId="right" dataKey="totalValue" fill="#82ca9d" name="总价值" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="warehouses">
          <WarehouseManagement warehouses={warehouses} setWarehouses={setWarehouses} updateWarehouseName={updateWarehouseName} />
        </TabsContent>
        <TabsContent value="suppliers">
          <SupplierManagement suppliers={suppliers} setSuppliers={setSuppliers} updateSupplierName={updateSupplierName} />
        </TabsContent>
        <TabsContent value="products">
          <ProductManagement products={products} setProducts={setProducts} updateProductName={updateProductName} />
        </TabsContent>
        <TabsContent value="outbound">
          <OutboundManagement 
            inventory={inventory} 
            setInventory={setInventory}
            outboundRecords={outboundRecords} 
            addOutboundRecord={addOutboundRecord}
            products={products}
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

function WarehouseManagement({ 
  warehouses, 
  setWarehouses, 
  updateWarehouseName 
}: { 
  warehouses: string[], 
  setWarehouses: React.Dispatch<React.SetStateAction<string[]>>,
  updateWarehouseName: (oldName: string, newName: string) => void
}) {
  const [newWarehouse, setNewWarehouse] = useState("")
  const [editingWarehouse, setEditingWarehouse] = useState<string | null>(null)
  const [editedWarehouseName, setEditedWarehouseName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [warehouseToDelete, setWarehouseToDelete] = useState<string | null>(null)

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
      updateWarehouseName(editingWarehouse, editedWarehouseName)
      setEditingWarehouse(null)
      setEditedWarehouseName("")
    }
  }

  const confirmDelete = (warehouse: string) => {
    setWarehouseToDelete(warehouse)
    setDeleteConfirmOpen(true)
  }

  const deleteWarehouse = () => {
    if (warehouseToDelete) {
      setWarehouses(warehouses.filter(w => w !== warehouseToDelete))
      setDeleteConfirmOpen(false)
      setWarehouseToDelete(null)
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
              您确定要删除仓库 &quot;{warehouseToDelete}&quot; 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={deleteWarehouse}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function SupplierManagement({ 
  suppliers, 
  setSuppliers,
  updateSupplierName
}: { 
  suppliers: Supplier[], 
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>,
  updateSupplierName: (oldName: string, newName: string) => void
}) {
  const [newSupplier, setNewSupplier] = useState("")
  const [editingSupplier, setEditingSupplier] = useState<number | null>(null)
  const [editedSupplierName, setEditedSupplierName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null)

  const addSupplier = () => {
    if (newSupplier && !suppliers.some(s => s.name === newSupplier)) {
      setSuppliers([...suppliers, { id: Date.now(), name: newSupplier }])
      setNewSupplier("")
    }
  }

  const startEditing = (supplier: Supplier) => {
    setEditingSupplier(supplier.id)
    setEditedSupplierName(supplier.name)
  }

  const saveEdit = () => {
    if (editingSupplier !== null && editedSupplierName) {
      const oldName = suppliers.find(s => s.id === editingSupplier)?.name
      setSuppliers(suppliers.map(s => s.id === editingSupplier ? { ...s, name: editedSupplierName } : s))
      if (oldName) {
        updateSupplierName(oldName, editedSupplierName)
      }
      setEditingSupplier(null)
      setEditedSupplierName("")
    }
  }

  const confirmDelete = (id: number) => {
    setSupplierToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const deleteSupplier = () => {
    if (supplierToDelete !== null) {
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete))
      setDeleteConfirmOpen(false)
      setSupplierToDelete(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2" />
          供应商管理
        </CardTitle>
        <CardDescription>添加、编辑或删除供应商</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              placeholder="输入新供应商名称"
            />
            <Button onClick={addSupplier}>
              <Plus className="mr-2 h-4 w-4" /> 添加供应商
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>供应商名称</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      {editingSupplier === supplier.id ? (
                        <Input
                          value={editedSupplierName}
                          onChange={(e) => setEditedSupplierName(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        supplier.name
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingSupplier === supplier.id ? (
                          <Button size="sm" variant="outline" onClick={saveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEditing(supplier)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => confirmDelete(supplier.id)}>
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
            <AlertDialogTitle>确认删除供应商</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个供应商吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSupplier}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function ProductManagement({ 
  products, 
  setProducts,
  updateProductName
}: { 
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  updateProductName: (oldName: string, newName: string) => void
}) {
  const [newProduct, setNewProduct] = useState("")
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [editedProductName, setEditedProductName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  const addProduct = () => {
    if (newProduct && !products.some(p => p.name === newProduct)) {
      setProducts([...products, { id: Date.now(), name: newProduct }])
      setNewProduct("")
    }
  }

  const startEditing = (product: Product) => {
    setEditingProduct(product.id)
    setEditedProductName(product.name)
  }

  const saveEdit = () => {
    if (editingProduct !== null && editedProductName) {
      const oldName = products.find(p => p.id === editingProduct)?.name
      setProducts(products.map(p => p.id === editingProduct ? { ...p, name: editedProductName } : p))
      if (oldName) {
        updateProductName(oldName, editedProductName)
      }
      setEditingProduct(null)
      setEditedProductName("")
    }
  }

  const confirmDelete = (id: number) => {
    setProductToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const deleteProduct = () => {
    if (productToDelete !== null) {
      setProducts(products.filter(p => p.id !== productToDelete))
      setDeleteConfirmOpen(false)
      setProductToDelete(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2" />
          商品管理
        </CardTitle>
        <CardDescription>添加、编辑或删除商品</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="输入新商品名称"
            />
            <Button onClick={addProduct}>
              <Plus className="mr-2 h-4 w-4" /> 添加商品
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名称</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {editingProduct === product.id ? (
                        <Input
                          value={editedProductName}
                          onChange={(e) => setEditedProductName(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        product.name
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingProduct === product.id ? (
                          <Button size="sm" variant="outline" onClick={saveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEditing(product)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => confirmDelete(product.id)}>
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
            <AlertDialogTitle>确认删除商品</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个商品吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function OutboundManagement({ 
  inventory, 
  outboundRecords, 
  addOutboundRecord
}: { 
  inventory: InventoryItem[], 
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  outboundRecords: OutboundRecord[], 
  addOutboundRecord: (productId: number, productName: string, quantity: number, recipient: string, warehouse: string, supplier: string) => void,
  products: Product[]
}) {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [outboundQuantity, setOutboundQuantity] = useState("")
  const [recipient, setRecipient] = useState("")

  const handleOutbound = () => {
    const product = inventory.find(item => item.name === selectedProduct)
    if (product && outboundQuantity && recipient) {
      const quantity = parseInt(outboundQuantity)
      if (quantity > product.quantity) {
        alert('出库数量不能大于库存数量！')
        return
      }
      addOutboundRecord(product.id, product.name, quantity, recipient, product.warehouse, product.supplier)
      // 清空输入框
      setSelectedProduct("")
      setOutboundQuantity("")
      setRecipient("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2" />
          出库管理
        </CardTitle>
        <CardDescription>记录商品出库情况</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="product">商品</Label>
              <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="选择商品" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name} (库存: {item.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">数量</Label>
              <Input
                id="quantity"
                type="number"
                value={outboundQuantity}
                onChange={(e) => setOutboundQuantity(e.target.value)}
                placeholder="输入数量"
              />
            </div>
            <div>
              <Label htmlFor="recipient">接收方</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="输入接收方"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleOutbound} className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" /> 记录出库
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名称</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>接收方</TableHead>
                  <TableHead>仓库</TableHead>
                  <TableHead>供应商</TableHead>
                  <TableHead>日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outboundRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.productName}</TableCell>
                    <TableCell>{record.quantity}</TableCell>
                    <TableCell>{record.recipient}</TableCell>
                    <TableCell>{record.warehouse}</TableCell>
                    <TableCell>{record.supplier}</TableCell>
                    <TableCell>{format(new Date(record.date), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}