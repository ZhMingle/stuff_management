import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">仪表板</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 统计卡片等内容 */}
        <div className="bg-white p-4 rounded shadow">物品总数：--</div>
        <div className="bg-white p-4 rounded shadow">分类总数：--</div>
        <div className="bg-white p-4 rounded shadow">最近添加：--</div>
      </div>
    </div>
  );
} 