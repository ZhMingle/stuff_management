import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>
        {/* 登录表单内容 */}
        <form>
          <input className="w-full mb-4 px-3 py-2 border rounded" type="text" placeholder="用户名" />
          <input className="w-full mb-4 px-3 py-2 border rounded" type="password" placeholder="密码" />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">登录</button>
        </form>
      </div>
    </div>
  );
} 