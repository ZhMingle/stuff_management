"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "zh" | "en";

type TranslationDict = Record<string, string>;

type Translations = Record<Language, TranslationDict>;

const translations: Translations = {
  zh: {
    app_title: "物品管理系统",
    nav_items: "物品管理",
    nav_categories: "分类管理",
    nav_dashboard: "仪表板",
    nav_settings: "设置",
    items_title: "物品管理",
    error_fetch_items: "获取物品列表失败",
    error_search: "搜索失败",
    confirm_delete_item: "确定要删除这个物品吗？",
    uncategorized: "未分类",
    search_placeholder: "搜索物品...",
    search: "搜索",
    add_item: "添加物品",
    loading: "加载中...",
    name: "名称",
    brand_model: "品牌/型号",
    images: "图片",
    category: "分类",
    status: "状态",
    location: "位置",
    price: "价格",
    actions: "操作",
    no_items: "暂无物品数据",
    details: "详情",
    edit: "编辑",
    delete: "删除",
    delete_failed: "删除物品失败",
    please_enter_item_name: "请输入物品名称",
    item_name: "物品名称",
    sub_category: "子分类",
    brand: "品牌",
    model: "型号",
    select_category: "选择分类",
    notes: "备注",
    notes_placeholder: "备注信息",
    quantity: "数量",
    purchase_date: "购买日期",
    expiry_date: "过期日期",
    condition_score: "状态评分",
    tags: "标签",
    tags_placeholder: "标签，用逗号分隔",
    image_url: "图片URL",
    manage_images: "管理图片",
    add_image_url: "添加图片URL",
    enter_image_url: "请输入图片URL",
    max_images_limit: "最多只能添加3张图片",
    drag_to_reorder: "拖拽图片重新排序，最多支持3张图片",
    cancel: "取消",
    creating: "创建中...",
    create_item: "创建物品",
    create_item_failed: "创建物品失败，请重试",
    status_0: "正常使用",
    status_1: "闲置",
    status_2: "损坏",
    status_3: "丢失",
    status_4: "已售出",
    status_5: "已捐赠",
    status_6: "过期",
    status_unknown: "未知",
    categories_title: "分类管理",
    category_name: "分类名称",
    dashboard_title: "仪表板",
    total_items: "物品总数：--",
    total_categories: "分类总数：--",
    recently_added: "最近添加：--",
    settings_title: "用户设置",
    username: "用户名",
    email: "邮箱",
    new_password: "新密码",
    save: "保存",
    update_failed: "更新失败",
    uploading: "上传中...",
    upload_image_failed: "图片上传失败",
    lang_zh: "中文",
    lang_en: "English",
  },
  en: {
    app_title: "Stuff Management",
    nav_items: "Items",
    nav_categories: "Categories",
    nav_dashboard: "Dashboard",
    nav_settings: "Settings",
    items_title: "Items",
    error_fetch_items: "Failed to fetch items",
    error_search: "Search failed",
    confirm_delete_item: "Are you sure you want to delete this item?",
    uncategorized: "Uncategorized",
    search_placeholder: "Search items...",
    search: "Search",
    add_item: "Add Item",
    loading: "Loading...",
    name: "Name",
    brand_model: "Brand/Model",
    images: "Images",
    category: "Category",
    status: "Status",
    location: "Location",
    price: "Price",
    actions: "Actions",
    no_items: "No items",
    details: "Details",
    edit: "Edit",
    delete: "Delete",
    delete_failed: "Failed to delete item",
    please_enter_item_name: "Please enter item name",
    item_name: "Item Name",
    sub_category: "Subcategory",
    brand: "Brand",
    model: "Model",
    select_category: "Select Category",
    notes: "Notes",
    notes_placeholder: "Notes",
    quantity: "Quantity",
    purchase_date: "Purchase Date",
    expiry_date: "Expiry Date",
    condition_score: "Condition Score",
    tags: "Tags",
    tags_placeholder: "Tags, separated by commas",
    image_url: "Image URL",
    manage_images: "Manage Images",
    add_image_url: "Add Image URL",
    enter_image_url: "Enter image URL",
    max_images_limit: "Maximum 3 images allowed",
    drag_to_reorder: "Drag to reorder images, maximum 3 images supported",
    cancel: "Cancel",
    creating: "Creating...",
    create_item: "Create Item",
    create_item_failed: "Failed to create item, please try again",
    status_0: "In Use",
    status_1: "Idle",
    status_2: "Damaged",
    status_3: "Lost",
    status_4: "Sold",
    status_5: "Donated",
    status_6: "Expired",
    status_unknown: "Unknown",
    categories_title: "Categories",
    category_name: "Category Name",
    dashboard_title: "Dashboard",
    total_items: "Total Items: --",
    total_categories: "Total Categories: --",
    recently_added: "Recently Added: --",
    settings_title: "User Settings",
    username: "Username",
    email: "Email",
    new_password: "New Password",
    save: "Save",
    update_failed: "Update failed",
    uploading: "Uploading...",
    upload_image_failed: "Image upload failed",
    lang_zh: "中文",
    lang_en: "English",
  },
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "stuff_mgmt_language";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Language | null) : null;
    if (saved === "zh" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
      const html = document.documentElement;
      html.lang = language === "zh" ? "zh-CN" : "en";
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = translations[language];
      return dict[key] ?? key;
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


