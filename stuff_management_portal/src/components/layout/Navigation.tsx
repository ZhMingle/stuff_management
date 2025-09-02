'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../i18n/I18nProvider';

export default function Navigation() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useI18n();

  const navItems = [
    { href: '/items', label: t('nav_items') },
    { href: '/categories', label: t('nav_categories') },
    { href: '/dashboard', label: t('nav_dashboard') },
    { href: '/settings', label: t('nav_settings') },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/items" className="text-xl font-bold text-gray-900">
                {t('app_title')}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            >
              {language === 'zh' ? t('lang_en') : t('lang_zh')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 