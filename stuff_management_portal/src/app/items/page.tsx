'use client';

import React, { useState, useEffect } from 'react';
import { itemService, Item, categoryService, Category } from '../../services';
import AddItemModal from '../../components/modals/AddItemModal';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 获取物品列表
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('获取物品列表失败');
      console.error('获取物品列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('获取分类列表失败:', err);
    }
  };

  // 搜索物品
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }

    try {
      setLoading(true);
      const data = await itemService.getItems(undefined, undefined, searchQuery);
      setItems(data);
      setError(null);
    } catch (err) {
      setError('搜索失败');
      console.error('搜索失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除物品
  const handleDeleteItem = async (id: number) => {
    if (!confirm('确定要删除这个物品吗？')) {
      return;
    }

    try {
      await itemService.deleteItem(id);
      setItems(items.filter(item => item.itemId !== id));
      setError(null);
    } catch (err) {
      setError('删除物品失败');
      console.error('删除物品失败:', err);
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return '未分类';
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category?.name || '未分类';
  };

  // 处理添加物品成功
  const handleAddItemSuccess = (newItem: Item) => {
    setItems([newItem, ...items]);
    setError(null);
  };

  // 打开添加物品弹窗
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // 关闭添加物品弹窗
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">物品管理</h1>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 搜索、筛选、添加按钮等 */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <input 
            className="border px-3 py-2 rounded w-64" 
            placeholder="搜索物品..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleSearch}
          >
            搜索
          </button>
        </div>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={openAddModal}
        >
          添加物品
        </button>
      </div>

      {/* 物品列表表格 */}
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">名称</th>
                <th className="text-left py-2">品牌/型号</th>
                <th className="text-left py-2">分类</th>
                <th className="text-left py-2">状态</th>
                <th className="text-left py-2">位置</th>
                <th className="text-left py-2">价格</th>
                <th className="text-left py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    暂无物品数据
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.itemId} className="border-b hover:bg-gray-50">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-gray-600">
                      {item.brand && item.model ? `${item.brand} ${item.model}` : 
                       item.brand || item.model || '-'}
                    </td>
                    <td className="py-2">{getCategoryName(item.categoryId)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 0 ? 'bg-green-100 text-green-800' :
                        item.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 2 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 0 ? '正常使用' :
                         item.status === 1 ? '闲置' :
                         item.status === 2 ? '损坏' :
                         item.status === 3 ? '丢失' :
                         item.status === 4 ? '已售出' :
                         item.status === 5 ? '已捐赠' :
                         item.status === 6 ? '过期' : '未知'}
                      </span>
                    </td>
                    <td className="py-2">{item.location || '-'}</td>
                    <td className="py-2">
                      {item.price ? `¥${item.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-2">
                      <button className="text-blue-600 mr-2 hover:underline">详情</button>
                      <button className="text-green-600 mr-2 hover:underline">编辑</button>
                      <button 
                        className="text-red-600 hover:underline"
                        onClick={() => item.itemId && handleDeleteItem(item.itemId)}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 添加物品弹窗 */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSuccess={handleAddItemSuccess}
      />
    </div>
  );
} 