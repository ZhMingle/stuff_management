import api from './api';

// 物品接口类型定义
export interface Item {
  id?: number;
  name: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  categoryId?: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  categoryId?: number;
}

// 物品管理 API
export const itemService = {
  // 获取所有物品
  async getItems(): Promise<Item[]> {
    const response = await api.get('/items');
    return response.data;
  },

  // 根据 ID 获取物品
  async getItemById(id: number): Promise<Item> {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // 创建物品
  async createItem(item: CreateItemRequest): Promise<Item> {
    const response = await api.post('/items', item);
    return response.data;
  },

  // 更新物品
  async updateItem(id: number, item: UpdateItemRequest): Promise<Item> {
    const response = await api.put(`/items/${id}`, item);
    return response.data;
  },

  // 删除物品
  async deleteItem(id: number): Promise<void> {
    await api.delete(`/items/${id}`);
  },

  // 搜索物品
  async searchItems(query: string): Promise<Item[]> {
    const response = await api.get('/items/search', {
      params: { q: query }
    });
    return response.data;
  },

  // 根据分类获取物品
  async getItemsByCategory(categoryId: number): Promise<Item[]> {
    const response = await api.get(`/categories/${categoryId}/items`);
    return response.data;
  }
}; 