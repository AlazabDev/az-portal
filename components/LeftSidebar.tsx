/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationDestination, ServiceCategory } from '../types';
import { Home, Globe, Layers, LayoutGrid, Box, Bookmark, Settings, Sun, StickyNote } from 'lucide-react';

interface LeftSidebarProps {
  currentDestination: NavigationDestination;
  onNavigate: (dest: NavigationDestination) => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onRefreshSystemStatus: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPathway: (cat: ServiceCategory | 'all') => void;
  onOpenBrowser: () => void;
  onToggleNotes?: () => void;
  isNotesOpen?: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentDestination,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onRefreshSystemStatus,
  isDarkMode,
  onToggleTheme,
  onOpenPathway,
  onOpenBrowser,
  onToggleNotes,
  isNotesOpen = false,
}) => {
  return (
    <aside 
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 p-2 bg-[#000000]/80 hover:bg-[#000000]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] transition-all duration-300"
      aria-label="شريط الوصول السريع الجانبي"
    >
      {/* 1. Home - Glowing Golden Active Square */}
      <button
        onClick={() => onNavigate('home')}
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative bg-gradient-to-br from-[#FFBE4D] via-[#FCA311] to-[#E08C00] text-[#000000] shadow-[0_0_18px_rgba(252,163,17,0.6)] font-bold scale-105"
        title="الدليل الموحد - الرئيسية"
      >
        <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      {/* 2. Web Browser - Globe */}
      <button
        onClick={onOpenBrowser}
        className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311] flex items-center justify-center transition-all duration-200 group"
        title="متصفح الويب المدمج"
      >
        <Globe className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      {/* 3. Public Systems - Layers */}
      <button
        onClick={() => onOpenPathway('public')}
        className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311] flex items-center justify-center transition-all duration-200 group"
        title="مسار أنظمة العزب العامة (معارض، مواقع، مدونات)"
      >
        <Layers className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      {/* 4. All Systems / Directory - 4-Squares Grid */}
      <button
        onClick={() => onOpenPathway('private')}
        className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311] flex items-center justify-center transition-all duration-200 group"
        title="مسار الأنظمة الخاصة والمحمية"
      >
        <LayoutGrid className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      {/* 5. Frappe Ecosystem - 3D Cube */}
      <button
        onClick={() => onOpenPathway('frappe')}
        className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311] flex items-center justify-center transition-all duration-200 group"
        title="مسار بيئة Frappe وتطبيقاتها"
      >
        <Box className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      {/* Separator */}
      <div className="w-6 h-px bg-white/15 my-1"></div>

      {/* 6. Quick Notes Trigger Button */}
      {onToggleNotes && (
        <button
          onClick={onToggleNotes}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
            isNotesOpen
              ? 'bg-[#FCA311] text-[#000000] shadow-[0_0_15px_rgba(252,163,17,0.5)]'
              : 'bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311]'
          }`}
          title="المفكرة السريعة والقصاصات (Alt+N)"
        >
          <StickyNote className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FCA311]" />
        </button>
      )}

      {/* 7. Bookmark / Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311] flex items-center justify-center transition-all duration-200 group"
        title="البحث الموحد في كافة المسارات (⌘K)"
      >
        <Bookmark className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      {/* 8. Settings / Theme / Status */}
      <button
        onClick={onToggleTheme}
        className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/15 text-[#E5E5E5] hover:text-[#FCA311] flex items-center justify-center transition-all duration-200 group"
        title={isDarkMode ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
      >
        {isDarkMode ? (
          <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
        ) : (
          <Sun className="w-5 h-5 text-[#FCA311]" />
        )}
      </button>
    </aside>
  );
};
