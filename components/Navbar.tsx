/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationDestination, AuthSession } from '../types';
import { AlazabLogo } from './AlazabLogo';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Lock, 
  Star, 
  Grid, 
  Bell, 
  User, 
  Plus, 
  X,
  Search,
  Sparkles,
  StickyNote
} from 'lucide-react';

interface NavbarProps {
  currentDestination: NavigationDestination;
  onNavigate: (dest: NavigationDestination) => void;
  onOpenSearch: () => void;
  onOpenAddService: () => void;
  onOpenAuth: () => void;
  authSession: AuthSession;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  activeTabsCount: number;
  onRefreshSystemStatus: () => void;
  isCheckingStatus?: boolean;
  currentUrl?: string;
  onNewTab?: () => void;
  onToggleNotes?: () => void;
  isNotesOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDestination,
  onNavigate,
  onOpenSearch,
  onOpenAddService,
  onOpenAuth,
  authSession,
  onLogout,
  isDarkMode,
  onToggleTheme,
  activeTabsCount,
  onRefreshSystemStatus,
  isCheckingStatus = false,
  currentUrl = 'https://alazab.cloud',
  onNewTab,
  onToggleNotes,
  isNotesOpen = false,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#000000]/85 backdrop-blur-xl border-b border-white/10 text-[#FFFFFF] select-none">
      
      {/* Top Tab Bar Row */}
      <div className="px-3 pt-2 pb-0 flex items-center justify-between gap-2 border-b border-white/5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Main Active Tab */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-t-xl bg-[#14213D] border-t border-x border-[#FCA311]/30 text-xs font-semibold cursor-pointer shadow-lg group"
          >
            <AlazabLogo size={16} />
            <span className="tracking-wide text-[#FFFFFF] group-hover:text-[#FCA311] transition-colors whitespace-nowrap">
              ALAZAB CLOUD
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('home');
              }}
              className="p-0.5 rounded-full hover:bg-white/20 text-[#E5E5E5]/70 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* New Tab Button (+) */}
          <button
            onClick={() => {
              if (onNewTab) onNewTab();
              else onNavigate('browser');
            }}
            className="p-1.5 text-[#E5E5E5]/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
            title="فتح تبويب جديد"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Brand Kicker on right */}
        <div className="text-[11px] text-[#E5E5E5]/70 hidden sm:flex items-center gap-2 pl-2">
          <span>الواجهة الرقمية المركزية</span>
        </div>
      </div>

      {/* Browser Controls & URL Bar Row */}
      <div className="px-4 py-2 flex items-center justify-between gap-3 text-[#E5E5E5]">
        
        {/* Left Side: Navigation Icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => window.history.back()}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#E5E5E5] hover:text-white transition-colors"
            title="رجوع"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.history.forward()}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#E5E5E5] hover:text-white transition-colors"
            title="تقدم"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRefreshSystemStatus}
            disabled={isCheckingStatus}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#E5E5E5] hover:text-white transition-colors"
            title="تحديث الصفحة والأنظمة"
          >
            <RotateCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin text-[#FCA311]' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
              currentDestination === 'home' ? 'text-[#FCA311]' : 'text-[#E5E5E5] hover:text-white'
            }`}
            title="الصفحة الرئيسية"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Glass Capsule URL Bar */}
        <div 
          onClick={onOpenSearch}
          className="flex-1 max-w-2xl mx-auto flex items-center justify-between bg-[#14213D]/70 hover:bg-[#14213D]/90 border border-white/15 hover:border-[#FCA311]/60 rounded-full px-4 py-1.5 text-xs text-[#E5E5E5] shadow-inner cursor-pointer transition-all duration-200 group"
          title="انقر للبحث الموحد في الإنترنت أو أنظمة العزب (⌘K)"
        >
          <div className="flex items-center gap-2 min-w-0" dir="ltr">
            <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="font-mono text-xs tracking-tight text-[#E5E5E5] group-hover:text-white truncate">
              {currentUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Star className="w-3.5 h-3.5 text-slate-400 hover:text-[#FCA311] transition-colors" />
          </div>
        </div>

        {/* Right Side: Tools & Profile Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Notes Button */}
          {onToggleNotes && (
            <button
              onClick={onToggleNotes}
              className={`p-2 rounded-lg transition-colors relative ${
                isNotesOpen
                  ? 'bg-[#FCA311] text-[#000000]'
                  : 'hover:bg-white/10 text-[#E5E5E5] hover:text-[#FCA311]'
              }`}
              title="المفكرة السريعة والقصاصات (Alt+N)"
            >
              <StickyNote className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FCA311]" />
            </button>
          )}

          {/* 4-squares app grid icon */}
          <button
            onClick={() => onNavigate(currentDestination === 'public' ? 'private' : 'public')}
            className="p-2 rounded-lg hover:bg-white/10 text-[#E5E5E5] hover:text-white transition-colors"
            title="دليل التطبيقات والأنظمة"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Notification Bell with status badge */}
          <button
            onClick={onRefreshSystemStatus}
            className="p-2 rounded-lg hover:bg-white/10 text-[#E5E5E5] hover:text-white transition-colors relative"
            title="الإشعارات وتحديث حالة النظام"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FCA311] ring-2 ring-[#000000]"></span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 text-[#E5E5E5] hover:text-white transition-colors"
            title={authSession.isAuthenticated ? `المستخدم: ${authSession.displayName}` : 'تسجيل الدخول'}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
              authSession.isAuthenticated 
                ? 'bg-[#FCA311] text-[#000000] border-[#FCA311]' 
                : 'bg-white/10 text-[#FFFFFF] border-white/20'
            }`}>
              <User className="w-4 h-4" />
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
