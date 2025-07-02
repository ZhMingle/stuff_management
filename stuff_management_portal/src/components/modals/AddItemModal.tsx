'use client';

import React, { useState, useEffect } from 'react';
import { Item, CreateItemRequest, categoryService, itemService, Category } from '../../services';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: Item) => void;
}

export default function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateItemRequest>({
    name: '',
    subCategory: '',
    brand: '',
    model: '',
    status: 0,
    location: '',
    notes: '',
    imageUrl: '',
    price: undefined,
    quantity: 1,
    purchaseDate: '',
    expiryDate: '',
    condition: 10,
    tags: '',
    categoryId: undefined
  });

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('获取分类列表失败:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      subCategory: '',
      brand: '',
      model: '',
      status: 0,
      location: '',
      notes: '',
      imageUrl: '',
      price: undefined,
      quantity: 1,
      purchaseDate: '',
      expiryDate: '',
      condition: 10,
      tags: '',
      categoryId: undefined
    });
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('请输入物品名称');
      return;
    }

    try {
      setLoading(true);
      
      // 处理日期格式
      const submitData = {
        ...formData,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : undefined,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined
      };
      
      // 调试：打印请求数据
      console.log('发送的数据:', submitData);
      
      const newItem = await itemService.createItem(submitData);
      
      // 调试：打印响应数据
      console.log('创建成功:', newItem);
      
      onSuccess(newItem);
      resetForm();
      onClose();
    } catch (err) {
      console.error('创建物品失败:', err);
      alert('创建物品失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof CreateItemRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">添加物品</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                物品名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入物品名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                子分类
              </label>
              <input
                type="text"
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="子分类"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                品牌
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="品牌"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                型号
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="型号"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>正常使用</option>
                <option value={1}>闲置</option>
                <option value={2}>损坏</option>
                <option value={3}>丢失</option>
                <option value={4}>已售出</option>
                <option value={5}>已捐赠</option>
                <option value={6}>过期</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => handleInputChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择分类</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              存放位置
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="存放位置"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="备注信息"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                价格
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数量
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="数量"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                购买日期
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                过期日期
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态评分 (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.condition || ''}
                onChange={(e) => handleInputChange('condition', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="状态评分"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标签
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="标签，用逗号分隔"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              图片URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="图片URL"
            />
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建物品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 