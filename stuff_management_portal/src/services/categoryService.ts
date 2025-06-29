import api from './api';

// 分类接口类型定义
export interface Category {
  id?: number;
  name: string;
  description?: string;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

// 分类管理 API
export const categoryService = {
  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  // 根据 ID 获取分类
  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // 创建分类
  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    const response = await api.post('/categories', category);
    return response.data;
  },

  // 更新分类
  async updateCategory(id: number, category: UpdateCategoryRequest): Promise<Category> {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  // 删除分类
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  // 获取分类及其物品数量
  async getCategoriesWithItemCount(): Promise<Category[]> {
    const response = await api.get('/categories/with-item-count');
    return response.data;
  }
}; 