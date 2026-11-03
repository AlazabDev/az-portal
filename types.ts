/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavigationDestination = 'home' | 'browser' | 'public' | 'private' | 'frappe';

export type ServiceCategory = 'public' | 'private' | 'frappe' | 'web';

export type ServiceSubCategory = 
  | 'exhibitions'   // المعارض
  | 'websites'      // المواقع
  | 'blogs'         // المدونات
  | 'erp'           // تطبيقات ERP & Frappe
  | 'management'    // الأنظمة الإدارية
  | 'analytics'     // التقارير والتحليلات
  | 'tools'         // الأدوات والخدمات الرقمية
  | 'external';     // أدوات ومواقع خارجية

export interface ServiceItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: ServiceCategory;
  subCategory: ServiceSubCategory;
  url: string;
  iconName: string;
  badge?: string;
  isProtected: boolean;
  tags: string[];
  openMode: 'embed' | 'tab' | 'window';
  status: 'active' | 'maintenance' | 'beta';
  accentColor?: string;
  isCustom?: boolean;
  docCount?: number;
  featured?: boolean;
}

export interface WorkspaceTab {
  id: string;
  title: string;
  url: string;
  type: 'web' | 'service' | 'frappe';
  iconName?: string;
  pinned?: boolean;
  canEmbed?: boolean;
  isLoading?: boolean;
  timestamp: number;
}

export interface AuthSession {
  isAuthenticated: boolean;
  userEmail?: string;
  role?: string;
  displayName?: string;
  lastLogin?: number;
}

export interface WebBookmark {
  id: string;
  title: string;
  url: string;
  iconName?: string;
  category: string;
}

export interface SearchFilter {
  query: string;
  category: 'all' | 'public' | 'private' | 'frappe' | 'web';
  subCategory?: string;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

export type NoteCategory = 'general' | 'code' | 'link' | 'task';

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  pinned?: boolean;
  createdAt: number;
  updatedAt: number;
}