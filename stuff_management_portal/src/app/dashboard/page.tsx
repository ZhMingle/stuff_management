'use client';

import React from 'react';
import { useI18n } from '../../components/i18n/I18nProvider';

export default function DashboardPage() {
  const { t } = useI18n();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('dashboard_title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 统计卡片等内容 */}
        <div className="bg-white p-4 rounded shadow">{t('total_items')}</div>
        <div className="bg-white p-4 rounded shadow">{t('total_categories')}</div>
        <div className="bg-white p-4 rounded shadow">{t('recently_added')}</div>
      </div>
    </div>
  );
} 