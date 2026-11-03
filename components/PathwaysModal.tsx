/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceItem, ServiceCategory, AuthSession } from '../types';
import { IconRenderer } from './IconRenderer';
import { 
  X, 
  ExternalLink, 
  ArrowLeft, 
  Search, 
  Lock, 
  Shield, 
  Layers, 
  Box, 
  Globe, 
  Plus,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PathwaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ServiceCategory | 'all';
  services: ServiceItem[];
  onOpenService: (service: ServiceItem, inNewWindow?: boolean) => void;
  onOpenAuth: () => void;
  authSession: AuthSession;
  onOpenAddService: () => void;
}

export const PathwaysModal: React.FC<PathwaysModalProps> = ({
  isOpen,
  onClose,
  category,
  services,
  onOpenService,
  onOpenAuth,
  authSession,
  onOpenAddService,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ServiceCategory | 'all'>(category);

  // Sync activeTab when category prop changes
  React.useEffect(() => {
    setActiveTab(category);
    setSearchQuery('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const getTitleAndSubtitle = () => {
    switch (activeTab) {
      case 'public':
        return {
          title: 'مسار أنظمة العزب العامة',
          titleEn: 'Public Showcases, Websites & Blogs',
          desc: 'دليل متكامل لكافة المواقع والمعارض الرقمية والمدونات المفتوحة للجمهور والشركاء.',
          icon: <Layers className="w-6 h-6 text-cyan-400" />,
          accent: 'border-cyan-400/40 text-cyan-400',
        };
      case 'private':
        return {
          title: 'مسار الأنظمة الخاصة والمحمية',
          titleEn: 'Private Systems & Administrative Operations',
          desc: 'الأنظمة الإدارية واللوجستية والتحليلات المالية المخصصة للإدارة وفريق العمل.',
          icon: <Lock className="w-6 h-6 text-blue-400" />,
          accent: 'border-blue-500/40 text-blue-400',
        };
      case 'frappe':
        return {
          title: 'مسار بيئة Frappe وتطبيقاتها',
          titleEn: 'Frappe Framework & ERP Applications',
          desc: 'مدخل مباشر إلى مكتب Frappe المكتبي وتطبيقات ERPNext والموارد البشرية وCRM.',
          icon: <Box className="w-6 h-6 text-purple-400" />,
          accent: 'border-purple-500/40 text-purple-400',
        };
      case 'all':
      default:
        return {
          title: 'الدليل الموحد لكافة مسارات العزب',
          titleEn: 'Unified Master Directory of All Pathways',
          desc: 'استكشف كافة الخدمات والمواقع والتطبيقات الخاصة بمجموعة العزب في مسار واحد متناسق.',
          icon: <Globe className="w-6 h-6 text-[#FCA311]" />,
          accent: 'border-[#FCA311]/40 text-[#FCA311]',
        };
    }
  };

  const headerInfo = getTitleAndSubtitle();

  const filteredServices = services.filter((s) => {
    if (activeTab !== 'all' && s.category !== activeTab) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleLaunch = (service: ServiceItem, newWindow = false) => {
    if (service.isProtected && !authSession.isAuthenticated) {
      onOpenAuth();
      return;
    }
    onOpenService(service, newWindow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#14213D]/95 border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-w-4xl w-full max-h-[88vh] flex flex-col text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border ${headerInfo.accent} shadow-inner shrink-0`}>
              {headerInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#FFFFFF]">
                  {headerInfo.title}
                </h2>
                <span className="text-[10px] font-mono text-[#E5E5E5]/70 hidden sm:inline" dir="ltr">
                  ({headerInfo.titleEn})
                </span>
              </div>
              <p className="text-xs text-[#E5E5E5] mt-1 max-w-xl leading-relaxed">
                {headerInfo.desc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="إغلاق النافذة والعودة للدليل الرئيسي"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Search Filter Bar */}
        <div className="px-5 py-3 bg-[#000000]/70 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          
          {/* Pathway Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#FCA311] text-[#000000] shadow'
                  : 'text-[#E5E5E5] hover:bg-white/10'
              }`}
            >
              كافة المسارات ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'public'
                  ? 'bg-cyan-400 text-[#000000] shadow'
                  : 'text-[#E5E5E5] hover:bg-white/10'
              }`}
            >
              الأنظمة العامة
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'private'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-[#E5E5E5] hover:bg-white/10'
              }`}
            >
              الأنظمة الخاصة
            </button>
            <button
              onClick={() => setActiveTab('frappe')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'frappe'
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-[#E5E5E5] hover:bg-white/10'
              }`}
            >
              بيئة Frappe
            </button>
          </div>

          {/* Search Field */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-[#E5E5E5]/60 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="تصفية المسارات..."
              className="w-full bg-white/10 text-xs py-2 pr-9 pl-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/50"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1 max-h-[58vh]">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 text-[#E5E5E5]/70 text-xs">
              لا توجد مسارات مطابقة لكلمة البحث في هذا التصنيف.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FCA311]/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FCA311] group-hover:scale-105 transition-transform shrink-0">
                          <IconRenderer name={service.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#FFFFFF] group-hover:text-[#FCA311] transition-colors">
                            {service.title}
                          </h4>
                          <span className="text-[10px] text-[#E5E5E5]/70 font-mono" dir="ltr">
                            {service.titleEn}
                          </span>
                        </div>
                      </div>

                      {service.isProtected && (
                        <span className="text-[10px] text-[#FCA311] bg-[#FCA311]/15 px-2 py-0.5 rounded font-semibold flex items-center gap-1 shrink-0 border border-[#FCA311]/30">
                          <Lock className="w-3 h-3" />
                          <span>محمي</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#E5E5E5] mt-2.5 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    <div className="text-[10px] font-mono text-[#E5E5E5]/60 mt-3 truncate" dir="ltr">
                      {service.url}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleLaunch(service, false)}
                      className="flex-1 bg-white/10 hover:bg-[#FCA311] hover:text-[#000000] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow"
                    >
                      <span>فتح المسار</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleLaunch(service, true)}
                      className="p-2 rounded-xl text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors"
                      title="فتح في نافذة مستقلة"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info strip with Add Service CTA */}
        <div className="p-4 bg-[#000000]/85 border-t border-white/10 flex items-center justify-between text-xs text-[#E5E5E5]/70">
          <div className="flex items-center gap-2">
            <span>Alazab Cloud — الدليل الموحد لمسارات العزب</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAddService();
            }}
            className="flex items-center gap-1.5 text-[#FCA311] hover:underline font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة مسار أو موقع جديد</span>
          </button>
        </div>

      </div>
    </div>
  );
};
