import api from './api';

// 分类接口类型定义
export interface Category {
  categoryId?: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentCategoryId?: number;
  sortOrder?: number;
  isActive?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentCategoryId?: number;
  sortOrder?: number;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  parentCategoryId?: number;
  sortOrder?: number;
  isActive?: boolean;
  isDefault?: boolean;
}

// 分类管理 API
export const categoryService = {
  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/Category');
    return response.data;
  },

  // 根据 ID 获取分类
  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/Category/${id}`);
    return response.data;
  },

  // 创建分类
  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    const response = await api.post('/Category', category);
    return response.data;
  },

  // 更新分类
  async updateCategory(id: number, category: UpdateCategoryRequest): Promise<Category> {
    const response = await api.put(`/Category/${id}`, category);
    return response.data;
  },

  // 删除分类
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/Category/${id}`);
  },

  // 获取分类树结构
  async getCategoryTree(): Promise<Category[]> {
    const response = await api.get('/Category/tree');
    return response.data;
  }
}; 