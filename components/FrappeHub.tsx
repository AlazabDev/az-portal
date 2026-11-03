/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceItem, AuthSession } from '../types';
import { IconRenderer } from './IconRenderer';
import { 
  Layers, 
  ArrowLeft, 
  ExternalLink, 
  Search, 
  Database, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Server,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface FrappeHubProps {
  frappeServices: ServiceItem[];
  onOpenService: (service: ServiceItem, inNewWindow?: boolean) => void;
  onOpenAuth: () => void;
  authSession: AuthSession;
  onOpenUrl: (url: string, title?: string) => void;
}

export const FrappeHub: React.FC<FrappeHubProps> = ({
  frappeServices,
  onOpenService,
  onOpenAuth,
  authSession,
  onOpenUrl,
}) => {
  const [docTypeSearch, setDocTypeSearch] = useState('');

  const commonDocTypes = [
    { name: 'Sales Invoice', label: 'فاتورة المبيعات', app: 'ERPNext Accounts', route: '/app/sales-invoice' },
    { name: 'Journal Entry', label: 'قيد يومية', app: 'ERPNext Accounts', route: '/app/journal-entry' },
    { name: 'Employee', label: 'ملف موظف', app: 'Frappe HR', route: '/app/employee' },
    { name: 'Attendance', label: 'سجل الحضور', app: 'Frappe HR', route: '/app/attendance' },
    { name: 'Lead', label: 'عميل محتمل', app: 'Frappe CRM', route: '/app/lead' },
    { name: 'HD Ticket', label: 'تذكرة دعم', app: 'Frappe Helpdesk', route: '/app/hd-ticket' },
    { name: 'Project', label: 'مشروع تطوير', app: 'ERPNext Projects', route: '/app/project' },
    { name: 'Custom DocType', label: 'نموذج مخصص جديد', app: 'Frappe Builder', route: '/app/doctype' },
  ];

  const filteredDocTypes = commonDocTypes.filter(
    (d) =>
      d.name.toLowerCase().includes(docTypeSearch.toLowerCase()) ||
      d.label.includes(docTypeSearch) ||
      d.app.toLowerCase().includes(docTypeSearch.toLowerCase())
  );

  const handleLaunchDocType = (route: string, label: string) => {
    const fullUrl = `https://frappe.alazab.cloud${route}`;
    if (!authSession.isAuthenticated) {
      onOpenAuth();
      return;
    }
    onOpenUrl(fullUrl, `Frappe: ${label}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200 text-white">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#14213D] to-[#000000] border border-white/15 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCA311]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FCA311]">
            <Layers className="w-4 h-4" />
            <span>بيئة Frappe وتطبيقاتها المؤسسية</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px]">Frappe Framework Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            مدخل تطبيقات Frappe المباشر لمجموعة العزب
          </h1>

          <p className="text-sm sm:text-base text-[#E5E5E5] leading-relaxed">
            المنصة التشغيلية الموحدة لجميع عمليات التخطيط وإدارة الموارد، المحاسبة، الموارد البشرية، خدمة العملاء والتحليلات دون ازدواجية خوادم أو تشتيت في الروابط.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => {
                const desk = frappeServices.find((s) => s.id === 'frappe-desk');
                if (desk) onOpenService(desk, false);
                else onOpenUrl('https://frappe.alazab.cloud/app', 'Frappe Desk');
              }}
              className="bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
            >
              <span>فتح مكتب Frappe المكتبي (Desk)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenUrl('https://frappeframework.com/docs', 'توثيق Frappe')}
              className="bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors border border-white/10"
            >
              <span>دليل المطورين والـ DocTypes</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FCA311]" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick DocType Finder Strip */}
      <div className="bg-[#14213D] border border-white/15 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FCA311]" />
              <span>الانتقال السريع إلى نماذج Frappe (DocType Quick Navigator)</span>
            </h2>
            <p className="text-xs text-[#E5E5E5]/80 mt-0.5">
              ابحث عن أي نموذج عمل وافتحه مباشرة في بيئة العمل بنقرة واحدة.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#E5E5E5]/60 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={docTypeSearch}
              onChange={(e) => setDocTypeSearch(e.target.value)}
              placeholder="ابحث باسم DocType..."
              className="w-full bg-[#000000]/50 text-xs py-2 pr-9 pl-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40"
            />
          </div>
        </div>

        {/* DocTypes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {filteredDocTypes.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLaunchDocType(item.route, item.label)}
              className="p-2.5 rounded-xl bg-[#000000]/40 hover:bg-[#000000]/70 text-right transition-colors border border-white/10 hover:border-[#FCA311]/40 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-[#FCA311] transition-colors truncate">
                  {item.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E5E5E5]/60 group-hover:text-[#FCA311] transition-colors shrink-0" />
              </div>
              <div className="text-[10px] text-[#E5E5E5]/60 font-mono mt-0.5 truncate" dir="ltr">
                {item.name} · {item.app}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Frappe Modules Catalog */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            تطبيقات وأنظمة بيئة Frappe المعتمدة
          </h2>
          <p className="text-xs text-[#E5E5E5]/70">
            مفعلة وجاهزة للعمل المشترك تحت سقف Alazab Cloud
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {frappeServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#14213D] border border-white/15 hover:border-[#FCA311]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FCA311]/15 flex items-center justify-center text-[#FCA311] group-hover:scale-105 transition-transform shadow-inner border border-[#FCA311]/30">
                    <IconRenderer name={service.iconName} className="w-6 h-6" />
                  </div>
                  {service.badge && (
                    <span className="text-[11px] font-mono text-[#E5E5E5] bg-white/10 px-2 py-0.5 rounded">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base mt-3.5 group-hover:text-[#FCA311] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[#E5E5E5]/60 font-mono mt-0.5" dir="ltr">
                  {service.titleEn}
                </p>

                <p className="text-xs text-[#E5E5E5]/80 mt-3 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#E5E5E5]/60 mt-4 pt-3 border-t border-white/10">
                  <span>تطبيق معتمد</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{service.url.replace(/^https?:\/\//, '')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    if (service.isProtected && !authSession.isAuthenticated) {
                      onOpenAuth();
                    } else {
                      onOpenService(service, false);
                    }
                  }}
                  className="flex-1 bg-white/10 hover:bg-[#FCA311] hover:text-[#000000] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>فتح في Alazab Workspace</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (service.isProtected && !authSession.isAuthenticated) {
                      onOpenAuth();
                    } else {
                      onOpenService(service, true);
                    }
                  }}
                  className="p-2 rounded-xl text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="فتح في نافذة مستقلة جديدة"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Principles Accordion / Callout */}
      <div className="bg-[#000000]/60 border border-white/15 rounded-2xl p-6 text-xs text-[#E5E5E5] space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Server className="w-4 h-4 text-[#FCA311]" />
          <span>مبدأ التكامل مع Frappe — التكامل لا إعادة البناء</span>
        </div>
        <p className="leading-relaxed text-[#E5E5E5]/90">
          يرتكز Alazab Cloud على توفير طبقة تجميع وتصفح موحدة (Unified Workspace Gateway) فوق بيئة Frappe والأنظمة القائمة. لا حاجة لنقل البيانات أو ازدواجية الخوادم؛ حيث يتم استدعاء واجهات Frappe مباشرة وبأمان مع الحفاظ الكامل على استقلالية قاعدة البيانات وتطبيقات DocTypes المخصصة.
        </p>
      </div>

    </div>
  );
};
