import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">用户设置</h1>
      {/* 用户信息表单 */}
      <form className="bg-white rounded shadow p-6">
        <div className="mb-4">
          <label className="block mb-1 font-medium">用户名</label>
          <input className="w-full border px-3 py-2 rounded" type="text" placeholder="用户名" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">邮箱</label>
          <input className="w-full border px-3 py-2 rounded" type="email" placeholder="邮箱" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">新密码</label>
          <input className="w-full border px-3 py-2 rounded" type="password" placeholder="新密码" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">保存</button>
      </form>
    </div>
  );
} 