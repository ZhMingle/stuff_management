# 个人物品管理系统

一个基于 ASP.NET Core 的个人物品管理 Web API 系统，帮助用户管理个人物品的详细信息。

## 功能特性

### 物品管理 (Item)
- **基本信息**: 名称、品牌、型号、描述
- **分类管理**: 支持主分类和子分类
- **状态跟踪**: 正常使用、闲置、损坏、丢失、已售出、已捐赠、过期
- **位置管理**: 记录物品存放位置
- **价格管理**: 记录购买价格和数量
- **时间管理**: 购买日期、过期日期
- **状态评估**: 1-10分物品状态评分
- **标签系统**: 支持多标签分类
- **图片支持**: 物品图片URL存储

### 类别管理 (Category)
- **层级结构**: 支持父子类别关系
- **自定义属性**: 图标、颜色、排序
- **状态管理**: 启用/禁用类别
- **默认类别**: 预设常用类别

### 数据统计
- 物品总数统计
- 物品总价值计算
- 按状态分类统计
- 按类别分类统计

## 技术栈

- **后端框架**: ASP.NET Core 8.0
- **数据库**: SQL Server
- **ORM**: Entity Framework Core
- **API文档**: Swagger/OpenAPI

## 数据库设计

### Item (物品表)
```sql
- ItemId (主键)
- Name (名称)
- SubCategory (子分类)
- Brand (品牌)
- Model (型号)
- Status (状态枚举)
- Location (位置)
- Notes (备注)
- ImageUrl (图片URL)
- Price (价格)
- Quantity (数量)
- PurchaseDate (购买日期)
- ExpiryDate (过期日期)
- Condition (状态评分)
- Tags (标签)
- CategoryId (外键关联Category)
- CreatedAt (创建时间)
- UpdatedAt (更新时间)
```

### Category (类别表)
```sql
- CategoryId (主键)
- Name (名称)
- Description (描述)
- Icon (图标)
- Color (颜色)
- ParentCategoryId (父类别ID)
- SortOrder (排序)
- IsActive (是否启用)
- IsDefault (是否默认)
- CreatedAt (创建时间)
- UpdatedAt (更新时间)
```

## API 端点

### 类别管理
- `GET /api/Category` - 获取所有类别
- `GET /api/Category/tree` - 获取类别树结构
- `GET /api/Category/{id}` - 获取特定类别
- `POST /api/Category` - 创建新类别
- `PUT /api/Category/{id}` - 更新类别
- `DELETE /api/Category/{id}` - 删除类别

### 物品管理
- `GET /api/Item` - 获取所有物品（支持筛选）
- `GET /api/Item/{id}` - 获取特定物品
- `POST /api/Item` - 创建新物品
- `PUT /api/Item/{id}` - 更新物品
- `DELETE /api/Item/{id}` - 删除物品
- `GET /api/Item/statistics` - 获取统计信息

### 查询参数
- `categoryId` - 按类别筛选
- `status` - 按状态筛选
- `searchTerm` - 按关键词搜索

## 快速开始

### 1. 环境要求
- .NET 8.0 SDK
- SQL Server (或 SQL Server Express)

### 2. 配置数据库
在 `appsettings.json` 中配置数据库连接字符串：
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ItemManagementDb;User Id=sa;Password=123"
  }
}
```

### 3. 运行迁移
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. 启动应用
```bash
dotnet run
```

### 5. 访问API文档
打开浏览器访问: `https://localhost:7001/swagger`

## 使用示例

### 创建类别
```json
POST /api/Category
{
  "name": "运动用品",
  "description": "各种运动器材和装备",
  "icon": "sports",
  "color": "#17a2b8",
  "sortOrder": 5
}
```

### 创建物品
```json
POST /api/Item
{
  "name": "iPhone 15",
  "subCategory": "智能手机",
  "brand": "Apple",
  "model": "iPhone 15",
  "status": 0,
  "location": "卧室",
  "notes": "新买的手机，性能很好",
  "price": 5999.00,
  "quantity": 1,
  "purchaseDate": "2024-01-15T00:00:00Z",
  "condition": 10,
  "tags": "手机,苹果,电子产品",
  "categoryId": 1
}
```

## 预设类别

系统初始化时会创建以下默认类别：
1. 电子产品 - 各种电子设备和配件
2. 服装鞋帽 - 衣物、鞋子、帽子等
3. 书籍文具 - 书籍、笔记本、文具用品
4. 家居用品 - 家具、装饰品、生活用品
5. 其他 - 其他未分类物品

## 开发计划

- [ ] 用户认证和授权
- [ ] 物品借出/归还功能
- [ ] 物品维护记录
- [ ] 数据导入/导出功能
- [ ] 移动端适配
- [ ] 图片上传功能
- [ ] 数据备份功能 