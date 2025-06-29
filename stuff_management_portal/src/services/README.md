# API 接口使用说明

## 概述

本项目使用 axios 封装了 RESTful API 接口，提供了物品管理和分类管理的完整功能。

## 文件结构

```
src/services/
├── api.ts              # axios 实例配置
├── itemService.ts      # 物品管理 API
├── categoryService.ts  # 分类管理 API
├── index.ts           # 统一导出
└── README.md          # 使用说明
```

## 基础配置

### API 实例 (`api.ts`)

- 基础 URL: `http://localhost:5000/api` (可通过环境变量 `NEXT_PUBLIC_API_BASE_URL` 配置)
- 超时时间: 10秒
- 自动添加认证 token
- 统一错误处理

## 使用方法

### 1. 导入服务

```typescript
import { itemService, categoryService, Item, Category } from '@/services';
```

### 2. 物品管理

```typescript
// 获取所有物品
const items = await itemService.getItems();

// 创建物品
const newItem = await itemService.createItem({
  name: '新物品',
  description: '物品描述',
  categoryId: 1
});

// 更新物品
const updatedItem = await itemService.updateItem(1, {
  name: '更新后的名称'
});

// 删除物品
await itemService.deleteItem(1);

// 搜索物品
const searchResults = await itemService.searchItems('关键词');
```

### 3. 分类管理

```typescript
// 获取所有分类
const categories = await categoryService.getCategories();

// 创建分类
const newCategory = await categoryService.createCategory({
  name: '新分类',
  description: '分类描述'
});

// 更新分类
const updatedCategory = await categoryService.updateCategory(1, {
  name: '更新后的分类名'
});

// 删除分类
await categoryService.deleteCategory(1);
```

### 4. 错误处理

所有 API 调用都会自动处理常见错误：

- 401: 未授权访问
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器错误
- 网络错误

建议在组件中使用 try-catch 进行错误处理：

```typescript
try {
  const items = await itemService.getItems();
  setItems(items);
} catch (error) {
  console.error('获取物品失败:', error);
  setError('获取物品失败');
}
```

## 类型定义

### Item 接口

```typescript
interface Item {
  id?: number;
  name: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Category 接口

```typescript
interface Category {
  id?: number;
  name: string;
  description?: string;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

## 环境变量配置

在 `.env.local` 文件中配置 API 基础 URL：

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 注意事项

1. 所有 API 调用都是异步的，需要使用 `async/await` 或 Promise
2. 删除操作会弹出确认对话框
3. 搜索功能支持按名称搜索
4. 分类删除前需要确保没有关联的物品
5. 认证 token 会自动从 localStorage 中获取 