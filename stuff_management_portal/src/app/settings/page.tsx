'use client';

import React from 'react';
import { useI18n } from '../../components/i18n/I18nProvider';

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('settings_title')}</h1>
      {/* 用户信息表单 */}
      <form className="bg-white rounded shadow p-6">
        <div className="mb-4">
          <label className="block mb-1 font-medium">{t('username')}</label>
          <input className="w-full border px-3 py-2 rounded" type="text" placeholder={t('username')} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">{t('email')}</label>
          <input className="w-full border px-3 py-2 rounded" type="email" placeholder={t('email')} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">{t('new_password')}</label>
          <input className="w-full border px-3 py-2 rounded" type="password" placeholder={t('new_password')} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{t('save')}</button>
      </form>
    </div>
  );
} 