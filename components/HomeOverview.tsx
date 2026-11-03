/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationDestination, ServiceItem, AuthSession, ServiceCategory } from '../types';
import { AlazabLogo } from './AlazabLogo';
import { 
  Globe, 
  Layers, 
  Lock, 
  Box, 
  Search, 
  ArrowLeft, 
  Sparkles,
  Folder,
  Image as ImageIcon,
  BookOpen,
  LayoutGrid,
  Plus,
  Zap,
} from 'lucide-react';

interface HomeOverviewProps {
  onNavigate: (dest: NavigationDestination) => void;
  onOpenSearch: () => void;
  onOpenService: (service: ServiceItem, inNewWindow?: boolean) => void;
  featuredServices: ServiceItem[];
  authSession: AuthSession;
  onOpenAuth: () => void;
  onRefreshSystemStatus: () => void;
  isCheckingStatus?: boolean;
  onOpenAddService?: () => void;
  onOpenPathway: (category: ServiceCategory | 'all') => void;
  onOpenBrowser: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenService,
  featuredServices,
  authSession,
  onOpenAuth,
  onRefreshSystemStatus,
  isCheckingStatus = false,
  onOpenAddService,
  onOpenPathway,
  onOpenBrowser,
}) => {
  return (
    <div 
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-[#000000] text-white select-none"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 80%, rgba(20,33,61,0.5) 0%, rgba(0,0,0,0.92) 75%), url('/assets/images/cosmic_earth_horizon.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 85%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top and side ambient light overlays matching the reference */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#000000]/95 via-[#000000]/50 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[300px] bg-gradient-to-l from-[#FCA311]/15 via-[#FCA311]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[450px] h-[300px] bg-gradient-to-r from-[#14213D]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Center Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 flex flex-col items-center text-center space-y-6 sm:space-y-7">
        
        {/* 1. Geometric 3D Gold Triangle Emblem & Title Lockup */}
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="transition-transform duration-300 hover:scale-105">
            <AlazabLogo size={78} />
          </div>

          <div className="flex items-center gap-2.5 mt-3 leading-none">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#FFFFFF]">
              ALAZAB
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#FCA311]">
              CLOUD
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#E5E5E5] font-medium mt-2 tracking-wide">
            بوابتك الموحدة إلى عالم العزب الرقمي
          </p>
        </div>

        {/* 2. Central Glass Pill Search Bar */}
        <div className="w-full max-w-2xl px-2">
          <button
            onClick={onOpenSearch}
            className="w-full bg-[#14213D]/80 hover:bg-[#14213D]/95 border border-white/20 hover:border-[#FCA311]/80 rounded-full py-3.5 px-5 flex items-center justify-between text-[#E5E5E5] hover:text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-200 backdrop-blur-xl group"
            title="ابحث في الويب أو أنظمة العزب (⌘K)"
          >
            {/* Right: AI Sparkle Icon in Gold */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FCA311] group-hover:scale-110 transition-transform" />
            </div>

            {/* Center: Placeholder Text */}
            <span className="text-xs sm:text-sm font-medium text-[#E5E5E5] group-hover:text-white">
              ابحث في الويب أو أنظمة العزب...
            </span>

            {/* Left: Magnifying Glass Icon */}
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#E5E5E5]/70 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>

        {/* 3. The 4 Luminous Glass Destination Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-1">
          
          {/* Card 1: متصفح الويب (Right-most in RTL, Gold luminous glow) */}
          <div
            onClick={onOpenBrowser}
            className="relative bg-[#14213D]/70 hover:bg-[#14213D]/90 border-2 border-[#FCA311]/80 hover:border-[#FCA311] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between shadow-[0_0_35px_rgba(252,163,17,0.25)] hover:shadow-[0_0_45px_rgba(252,163,17,0.45)] backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group min-h-[220px]"
          >
            <div className="flex flex-col items-center">
              {/* Globe Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#FCA311]/20 border border-[#FCA311]/40 text-[#FCA311] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <Globe className="w-7 h-7 text-[#FCA311]" />
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#FCA311] transition-colors">
                متصفح الويب
              </h3>
              <p className="text-xs text-[#E5E5E5] mt-1.5 font-medium">
                تصفح الإنترنت بحرية
              </p>
            </div>

            {/* Circular Gold Button with Arrow */}
            <div className="mt-5 w-8 h-8 rounded-full bg-[#FCA311] group-hover:bg-[#FFBE4D] text-[#000000] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 font-bold" />
            </div>
          </div>

          {/* Card 2: أنظمة العزب العامة (Cyan/Blue luminous glow) */}
          <div
            onClick={() => onOpenPathway('public')}
            className="relative bg-[#14213D]/60 hover:bg-[#14213D]/80 border-2 border-cyan-400/60 hover:border-cyan-300 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group min-h-[220px]"
          >
            <div className="flex flex-col items-center">
              {/* Layers Icon */}
              <div className="w-14 h-14 rounded-2xl bg-cyan-400/15 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <Layers className="w-7 h-7 text-cyan-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                أنظمة العزب العامة
              </h3>
              <p className="text-xs text-[#E5E5E5] mt-1.5 font-medium">
                المعارض والمواقع والمدونات
              </p>
            </div>

            {/* Circular Cyan Button with Arrow */}
            <div className="mt-5 w-8 h-8 rounded-full bg-cyan-400 group-hover:bg-cyan-300 text-[#000000] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 font-bold" />
            </div>
          </div>

          {/* Card 3: الأنظمة الخاصة (Electric Blue luminous glow) */}
          <div
            onClick={() => onOpenPathway('private')}
            className="relative bg-[#14213D]/60 hover:bg-[#14213D]/80 border-2 border-blue-500/60 hover:border-blue-400 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group min-h-[220px]"
          >
            <div className="flex flex-col items-center">
              {/* Padlock Icon */}
              <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <Lock className="w-7 h-7 text-blue-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                الأنظمة الخاصة
              </h3>
              <p className="text-xs text-[#E5E5E5] mt-1.5 font-medium">
                {authSession.isAuthenticated ? 'مفعلة بالكامل للمسؤول' : 'تسجيل الدخول للوصول'}
              </p>
            </div>

            {/* Circular Blue Button with Arrow */}
            <div className="mt-5 w-8 h-8 rounded-full bg-blue-500 group-hover:bg-blue-400 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 font-bold" />
            </div>
          </div>

          {/* Card 4: بيئة Frappe (Violet/Purple luminous glow) */}
          <div
            onClick={() => onOpenPathway('frappe')}
            className="relative bg-[#14213D]/60 hover:bg-[#14213D]/80 border-2 border-purple-500/60 hover:border-purple-400 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group min-h-[220px]"
          >
            <div className="flex flex-col items-center">
              {/* 3D Box Icon */}
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <Box className="w-7 h-7 text-purple-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
                بيئة Frappe
              </h3>
              <p className="text-xs text-[#E5E5E5] mt-1.5 font-medium">
                مدخل التطبيقات والأنظمة الإدارية
              </p>
            </div>

            {/* Circular Purple Button with Arrow */}
            <div className="mt-5 w-8 h-8 rounded-full bg-purple-500 group-hover:bg-purple-400 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 font-bold" />
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Dock: "⚡ وصول سريع" (Floating Glass Bar) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 mb-5">
        <div className="bg-[#14213D]/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
          
          {/* Header Tag on Top Right */}
          <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-[#FCA311] mb-3 pr-2">
            <span>وصول سريع</span>
            <Zap className="w-4 h-4 fill-[#FCA311]" />
          </div>

          {/* 6 Quick Launch Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            
            {/* 1. المستندات (Documents) */}
            <button
              onClick={() => {
                const docService = featuredServices.find((s) => s.id === 'alazab-docs');
                if (docService) onOpenService(docService, false);
                else onNavigate('public');
              }}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <Folder className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-[#E5E5E5] group-hover:text-white whitespace-nowrap">
                المستندات
              </span>
            </button>

            {/* 2. معرض الصور (Image Gallery) */}
            <button
              onClick={() => {
                const galleryService = featuredServices.find((s) => s.id === 'alazab-showcase');
                if (galleryService) onOpenService(galleryService, false);
                else onNavigate('public');
              }}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-[#E5E5E5] group-hover:text-white whitespace-nowrap">
                معرض الصور
              </span>
            </button>

            {/* 3. الموقع الرئيسي (Main Portal) */}
            <button
              onClick={() => {
                const portalService = featuredServices.find((s) => s.id === 'alazab-portal');
                if (portalService) onOpenService(portalService, false);
                else onNavigate('public');
              }}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <AlazabLogo size={20} />
              </div>
              <span className="text-xs font-medium text-[#E5E5E5] group-hover:text-white whitespace-nowrap">
                الموقع الرئيسي
              </span>
            </button>

            {/* 4. المدونة (Blog) */}
            <button
              onClick={() => {
                const blogService = featuredServices.find((s) => s.id === 'alazab-blog');
                if (blogService) onOpenService(blogService, false);
                else onNavigate('public');
              }}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-[#E5E5E5] group-hover:text-white whitespace-nowrap">
                المدونة
              </span>
            </button>

            {/* 5. المزيد (All Systems Directory) */}
            <button
              onClick={() => onOpenPathway('all')}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-[#E5E5E5] group-hover:text-white whitespace-nowrap">
                المزيد
              </span>
            </button>

            {/* 6. إضافة (+ Add Custom Service) */}
            <button
              onClick={() => {
                if (onOpenAddService) onOpenAddService();
              }}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FCA311]/15 text-[#FCA311] flex items-center justify-center group-hover:scale-110 transition-transform border border-[#FCA311]/30">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-[#E5E5E5] group-hover:text-white whitespace-nowrap">
                إضافة
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* 5. Bottom Brand Footnote Bar */}
      <div className="relative z-10 w-full px-6 py-3 flex items-center justify-between text-xs text-[#E5E5E5]/70 border-t border-white/10 bg-[#000000]/90 backdrop-blur-md">
        
        {/* Bottom Left: Logo + ALAZAB Digital Group */}
        <div className="flex items-center gap-2">
          <AlazabLogo size={20} />
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-[#FFFFFF]">
            <span>ALAZAB</span>
            <span className="text-[10px] font-normal text-[#E5E5E5]">Digital Group</span>
          </div>
        </div>

        {/* Bottom Right: Tagline with golden bar */}
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide">
          <span>All Alazab Services in <strong className="text-white">One Place</strong></span>
          <span className="w-6 h-0.5 bg-[#FCA311] inline-block rounded-full"></span>
        </div>

      </div>

    </div>
  );
};

