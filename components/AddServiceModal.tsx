/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceItem, ServiceCategory, ServiceSubCategory } from '../types';
import { Plus, X, Globe, Shield, Layers, FileText, Sparkles, Building, BookOpen, LayoutGrid, Check } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (newService: ServiceItem) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onAddService,
}) => {
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('public');
  const [subCategory, setSubCategory] = useState<ServiceSubCategory>('websites');
  const [iconName, setIconName] = useState('Globe');
  const [isProtected, setIsProtected] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableIcons = [
    { name: 'Globe', label: 'موقع' },
    { name: 'Building2', label: 'مؤسسة' },
    { name: 'LayoutGrid', label: 'معرض' },
    { name: 'BookOpen', label: 'مدونة' },
    { name: 'Layers', label: 'Frappe' },
    { name: 'ShieldCheck', label: 'محمي' },
    { name: 'Receipt', label: 'مالية' },
    { name: 'Briefcase', label: 'إداري' },
    { name: 'FileText', label: 'توثيق' },
    { name: 'Database', label: 'بيانات' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('يرجى كتابة اسم الخدمة وعنوان الرابط.');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newService: ServiceItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      titleEn: titleEn.trim() || title.trim(),
      description: description.trim() || 'خدمة مضافة بواسطة المستخدم لدليل Alazab Cloud.',
      category,
      subCategory,
      url: finalUrl,
      iconName,
      isProtected: category === 'private' ? true : isProtected,
      tags: tags.length > 0 ? tags : ['مخصص', 'سحابي'],
      openMode: 'embed',
      status: 'active',
      isCustom: true,
      accentColor: category === 'private' ? '#14213D' : '#FCA311',
    };

    onAddService(newService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#14213D] border border-white/20 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-white relative overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 rounded-lg text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center border border-[#FCA311]/30">
            <Plus className="w-6 h-6 text-[#FCA311]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">إضافة موقع أو نظام جديد</h2>
            <p className="text-xs text-[#E5E5E5]/80">
              يُدرج النظام مباشرة في دليل Alazab Cloud دون الحاجة لتعديل الكود
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Title in Arabic and English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
                اسم الخدمة (عربي) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: معرض المقاولات الحديثة"
                className="w-full bg-[#000000]/50 text-xs py-2 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Modern Projects Showcase"
                className="w-full bg-[#000000]/50 text-xs py-2 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40 text-left ltr"
                dir="ltr"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
              عنوان الرابط (URL) *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://mysystem.alazab.cloud"
              className="w-full bg-[#000000]/50 text-xs py-2 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40 text-left ltr"
              dir="ltr"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
                الوجهة / القسم
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ServiceCategory;
                  setCategory(cat);
                  if (cat === 'private') setIsProtected(true);
                  if (cat === 'frappe') setSubCategory('erp');
                }}
                className="w-full bg-[#000000]/50 text-xs py-2 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white"
              >
                <option value="public" className="bg-[#14213D] text-white">أنظمة العزب العامة</option>
                <option value="private" className="bg-[#14213D] text-white">أنظمة العزب الخاصة (محمي)</option>
                <option value="frappe" className="bg-[#14213D] text-white">بيئة Frappe وتطبيقاتها</option>
                <option value="web" className="bg-[#14213D] text-white">رابط وموقع ويب عام</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
                التصنيف الفرعي
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value as ServiceSubCategory)}
                className="w-full bg-[#000000]/50 text-xs py-2 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white"
              >
                <option value="websites" className="bg-[#14213D] text-white">موقع رسمي</option>
                <option value="exhibitions" className="bg-[#14213D] text-white">معرض أو كتالوج</option>
                <option value="blogs" className="bg-[#14213D] text-white">مدونة أو مقالات</option>
                <option value="erp" className="bg-[#14213D] text-white">نظام ERP & Frappe</option>
                <option value="management" className="bg-[#14213D] text-white">نظام إداري</option>
                <option value="analytics" className="bg-[#14213D] text-white">تقارير وتحليلات</option>
                <option value="tools" className="bg-[#14213D] text-white">أداة أو استعلام</option>
              </select>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1.5">
              الأيقونة الرمزية
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIconName(item.name)}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center gap-1 transition-all border ${
                    iconName === item.name
                      ? 'border-[#FCA311] bg-[#FCA311]/20 text-[#FCA311] font-bold'
                      : 'border-white/10 hover:bg-white/5 text-[#E5E5E5]'
                  }`}
                >
                  <span className="text-[10px] truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
              نبذة مختصرة
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر لطبيعة النظام والغرض منه..."
              className="w-full bg-[#000000]/50 text-xs p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
              الكلمات المفتاحية (مفصولة بفاصلة)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="مشاريع, هندسة, تقارير"
              className="w-full bg-[#000000]/50 text-xs py-2 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-[#E5E5E5] hover:bg-white/10 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>إضافة الخدمة للدليل</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
