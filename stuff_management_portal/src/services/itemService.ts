import api from './api';

// 物品接口类型定义
export interface Item {
  itemId?: number;
  name: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  status?: number;
  location?: string;
  notes?: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
  purchaseDate?: string;
  expiryDate?: string;
  condition?: number;
  tags?: string;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemRequest {
  name: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  status?: number;
  location?: string;
  notes?: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
  purchaseDate?: string;
  expiryDate?: string;
  condition?: number;
  tags?: string;
  categoryId?: number;
}

export interface UpdateItemRequest {
  name?: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  status?: number;
  location?: string;
  notes?: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
  purchaseDate?: string;
  expiryDate?: string;
  condition?: number;
  tags?: string;
  categoryId?: number;
}

// 物品管理 API
export const itemService = {
  // 获取所有物品
  async getItems(categoryId?: number, status?: number, searchTerm?: string): Promise<Item[]> {
    const params: any = {};
    if (categoryId) params.categoryId = categoryId;
    if (status !== undefined) params.status = status;
    if (searchTerm) params.searchTerm = searchTerm;
    
    const response = await api.get('/Item', { params });
    return response.data;
  },

  // 根据 ID 获取物品
  async getItemById(id: number): Promise<Item> {
    const response = await api.get(`/Item/${id}`);
    return response.data;
  },

  // 创建物品
  async createItem(item: CreateItemRequest): Promise<Item> {
    const response = await api.post('/Item', item);
    return response.data;
  },

  // 更新物品
  async updateItem(id: number, item: UpdateItemRequest): Promise<Item> {
    const response = await api.put(`/Item/${id}`, item);
    return response.data;
  },

  // 删除物品
  async deleteItem(id: number): Promise<void> {
    await api.delete(`/Item/${id}`);
  },

  // 获取物品统计信息
  async getItemStatistics(): Promise<any> {
    const response = await api.get('/Item/statistics');
    return response.data;
  }
}; 