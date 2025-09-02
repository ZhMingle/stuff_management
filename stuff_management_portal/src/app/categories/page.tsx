'use client';

import React from 'react';
import { useI18n } from '../../components/i18n/I18nProvider';

export default function CategoriesPage() {
  const { t } = useI18n();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('categories_title')}</h1>
      {/* 分类列表和操作 */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">{t('category_name')}</th>
              <th className="text-left py-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {/* 分类数据渲染 */}
            <tr>
              <td className="py-2">示例分类</td>
              <td className="py-2">
                <button className="text-green-600 mr-2">{t('edit')}</button>
                <button className="text-red-600">{t('delete')}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 