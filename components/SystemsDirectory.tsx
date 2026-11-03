/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceItem, ServiceCategory, AuthSession } from '../types';
import { IconRenderer } from './IconRenderer';
import { 
  Shield, 
  ExternalLink, 
  ArrowLeft, 
  Plus, 
  Search, 
  CheckCircle2, 
  SlidersHorizontal,
  Lock,
  Layers,
  Sparkles,
  Activity,
  RefreshCw
} from 'lucide-react';

interface SystemsDirectoryProps {
  services: ServiceItem[];
  currentCategoryFilter: ServiceCategory | 'all';
  onSelectCategoryFilter: (cat: ServiceCategory | 'all') => void;
  onOpenService: (service: ServiceItem, inNewWindow?: boolean) => void;
  onOpenAddService: () => void;
  onOpenAuth: () => void;
  authSession: AuthSession;
  onRefreshSystemStatus?: () => void;
  isCheckingStatus?: boolean;
}

export const SystemsDirectory: React.FC<SystemsDirectoryProps> = ({
  services,
  currentCategoryFilter,
  onSelectCategoryFilter,
  onOpenService,
  onOpenAddService,
  onOpenAuth,
  authSession,
  onRefreshSystemStatus,
  isCheckingStatus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  const filteredServices = services.filter((s) => {
    // Category filter
    if (currentCategoryFilter !== 'all' && s.category !== currentCategoryFilter) {
      return false;
    }
    // Subcategory filter
    if (selectedSubCategory !== 'all' && s.subCategory !== selectedSubCategory) {
      return false;
    }
    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const getSubcategoriesForCategory = () => {
    if (currentCategoryFilter === 'public') {
      return [
        { id: 'all', label: 'كافة الأنظمة العامة' },
        { id: 'websites', label: 'المواقع الرئيسية' },
        { id: 'exhibitions', label: 'المعارض والكتالوجات' },
        { id: 'blogs', label: 'المدونات والمقالات' },
        { id: 'tools', label: 'الخدمات والاستعلام' },
      ];
    }
    if (currentCategoryFilter === 'private') {
      return [
        { id: 'all', label: 'كافة الأنظمة الخاصة' },
        { id: 'management', label: 'الأنظمة الإدارية' },
        { id: 'analytics', label: 'التقارير والتحليلات' },
      ];
    }
    if (currentCategoryFilter === 'frappe') {
      return [
        { id: 'all', label: 'كافة تطبيقات Frappe' },
        { id: 'erp', label: 'تطبيقات ERP الأساسية' },
        { id: 'analytics', label: 'التحليلات والذكاء' },
        { id: 'tools', label: 'أدوات التطوير DocTypes' },
      ];
    }
    return [
      { id: 'all', label: 'الكل' },
      { id: 'exhibitions', label: 'المعارض' },
      { id: 'websites', label: 'المواقع' },
      { id: 'blogs', label: 'المدونات' },
      { id: 'erp', label: 'Frappe & ERP' },
      { id: 'management', label: 'الإدارية' },
      { id: 'analytics', label: 'التحليلات' },
    ];
  };

  const handleServiceClick = (service: ServiceItem, newWindow = false) => {
    if (service.isProtected && !authSession.isAuthenticated) {
      onOpenAuth();
      return;
    }
    onOpenService(service, newWindow);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200 text-white">
      
      {/* Header section with Title, Description, and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FCA311]">
            <span>دليل منظومة العزب الموحد</span>
            <span aria-hidden="true">·</span>
            <span>Alazab Systems Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {currentCategoryFilter === 'public'
              ? 'أنظمة العزب العامة — المعارض والمواقع والمدونات'
              : currentCategoryFilter === 'private'
              ? 'أنظمة العزب الخاصة — الدخول عند الحاجة'
              : currentCategoryFilter === 'frappe'
              ? 'بيئة Frappe وتطبيقاتها المؤسسية'
              : 'جميع أنظمة وخدمات Alazab Cloud'}
          </h1>
          <p className="text-sm text-[#E5E5E5] mt-2 max-w-2xl leading-relaxed">
            الوصول المباشر إلى كل خدمة وموقع وتطبيق لمجموعة العزب عبر واجهة موحدة، دون تشتت بين الروابط أو الخوادم.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRefreshSystemStatus && (
            <button
              onClick={onRefreshSystemStatus}
              disabled={isCheckingStatus}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/10 transition-colors"
              title="فحص وتحديث حالة الأنظمة"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FCA311] ${isCheckingStatus ? 'animate-spin' : ''}`} />
              <span>تحديث حالة الأنظمة</span>
            </button>
          )}

          <button
            onClick={onOpenAddService}
            className="flex items-center gap-2 bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خدمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#14213D] p-3 rounded-2xl border border-white/15 shadow-sm">
        
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => {
              onSelectCategoryFilter('all');
              setSelectedSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              currentCategoryFilter === 'all'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            كافة الأنظمة ({services.length})
          </button>

          <button
            onClick={() => {
              onSelectCategoryFilter('public');
              setSelectedSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              currentCategoryFilter === 'public'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            العامة (معارض ومدونات ومواقع)
          </button>

          <button
            onClick={() => {
              onSelectCategoryFilter('private');
              setSelectedSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentCategoryFilter === 'private'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>الأنظمة الخاصة</span>
          </button>

          <button
            onClick={() => {
              onSelectCategoryFilter('frappe');
              setSelectedSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              currentCategoryFilter === 'frappe'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            بيئة Frappe
          </button>
        </div>

        {/* Directory Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#E5E5E5]/60 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="تصفية الأنظمة بالاسم..."
            className="w-full bg-[#000000]/50 text-xs py-2 pr-9 pl-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40"
          />
        </div>
      </div>

      {/* Subcategory Pill Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#E5E5E5]">
        <span className="font-semibold text-[#E5E5E5]/60 shrink-0">التصنيف الدقيق:</span>
        {getSubcategoriesForCategory().map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubCategory(sub.id)}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              selectedSubCategory === sub.id
                ? 'bg-[#FCA311] text-[#000000] font-bold'
                : 'bg-white/5 hover:bg-white/10 text-[#E5E5E5]'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Notice for Protected Systems */}
      {currentCategoryFilter === 'private' && !authSession.isAuthenticated && (
        <div className="bg-[#000000]/60 border border-[#FCA311]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center shrink-0 border border-[#FCA311]/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                الدخول عند الحاجة للأنظمة المحمية
              </h4>
              <p className="text-xs text-[#E5E5E5] mt-0.5">
                يمكن تصفح دليل الأنظمة بحرية، ولفتح أي نظام محمي يلزم تسجيل الدخول بحساب معتمد أو رمز وصول.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap shadow transition-colors"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      )}

      {/* Grid of Service Cards */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-[#14213D]/50 rounded-2xl border border-white/10">
          <p className="text-[#E5E5E5]/70 text-sm">
            لا توجد أنظمة مطابقة لمعايير البحث والتصفية المحددة.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubCategory('all');
              onSelectCategoryFilter('all');
            }}
            className="mt-3 text-xs font-semibold text-[#FCA311] hover:underline"
          >
            إعادة ضبط عوامل التصفية
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const isProtectedLocked = service.isProtected && !authSession.isAuthenticated;

            return (
              <div
                key={service.id}
                className="bg-[#14213D] border border-white/15 hover:border-[#FCA311]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg group"
              >
                <div>
                  {/* Top card bar with icon, title, badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FCA311]/15 flex items-center justify-center text-[#FCA311] group-hover:scale-105 transition-transform shadow-inner border border-[#FCA311]/30">
                        <IconRenderer name={service.iconName} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#FCA311] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-[#E5E5E5]/60 font-mono mt-0.5" dir="ltr">
                          {service.titleEn}
                        </p>
                      </div>
                    </div>

                    {/* Protection or Category Flag */}
                    {service.isProtected ? (
                      <span className="text-[11px] text-[#FCA311] font-semibold flex items-center gap-1 shrink-0 bg-[#FCA311]/15 px-2 py-0.5 rounded border border-[#FCA311]/30">
                        <Lock className="w-3 h-3" />
                        <span>محمي</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#E5E5E5]/60 shrink-0">
                        متاح
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#E5E5E5] mt-3.5 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-[11px] text-[#E5E5E5]/60 mt-4 pt-3 border-t border-white/10 overflow-hidden">
                    <span>
                      {service.category === 'frappe'
                        ? 'تطبيق Frappe'
                        : service.category === 'private'
                        ? 'نظام خاص'
                        : 'نظام عام'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{service.url.replace(/^https?:\/\//, '')}</span>
                    {service.tags.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">#{service.tags[0]}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleServiceClick(service, false)}
                    className="flex-1 bg-white/10 hover:bg-[#FCA311] hover:text-[#000000] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    {isProtectedLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-[#FCA311]" />
                        <span>تسجيل الدخول للفتح</span>
                      </>
                    ) : (
                      <>
                        <span>فتح في المتصفح</span>
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleServiceClick(service, true)}
                    className="p-2 rounded-xl text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="فتح في نافذة مستقلة جديدة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
