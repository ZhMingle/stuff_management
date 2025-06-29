import React from 'react';

export default function CategoriesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">分类管理</h1>
      {/* 分类列表和操作 */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">分类名称</th>
              <th className="text-left py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {/* 分类数据渲染 */}
            <tr>
              <td className="py-2">示例分类</td>
              <td className="py-2">
                <button className="text-green-600 mr-2">编辑</button>
                <button className="text-red-600">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 