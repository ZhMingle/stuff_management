// 导出 API 实例
export { default as api } from './api';

// 导出物品服务
export { itemService } from './itemService';
export type { Item, CreateItemRequest, UpdateItemRequest } from './itemService';

// 导出分类服务
export { categoryService } from './categoryService';
export type { Category, CreateCategoryRequest, UpdateCategoryRequest } from './categoryService'; 