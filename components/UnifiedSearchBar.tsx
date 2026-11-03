/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ServiceItem, WebBookmark } from '../types';
import { IconRenderer } from './IconRenderer';
import { 
  Search, 
  X, 
  Globe, 
  ExternalLink, 
  Shield, 
  ArrowLeft,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface UnifiedSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  bookmarks: WebBookmark[];
  onOpenService: (service: ServiceItem) => void;
  onOpenUrl: (url: string, title?: string) => void;
}

export const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  isOpen,
  onClose,
  services,
  bookmarks,
  onOpenService,
  onOpenUrl,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'private' | 'frappe' | 'web'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const isUrlLike = /^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,})/i.test(trimmed);

  // Filter services
  const matchedServices = services.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (!trimmed) return true;
    return (
      s.title.toLowerCase().includes(trimmed) ||
      s.titleEn.toLowerCase().includes(trimmed) ||
      s.description.toLowerCase().includes(trimmed) ||
      s.tags.some((t) => t.toLowerCase().includes(trimmed))
    );
  });

  // Filter bookmarks
  const matchedBookmarks = bookmarks.filter((b) => {
    if (selectedCategory !== 'all' && selectedCategory !== 'web') return false;
    if (!trimmed) return true;
    return b.title.toLowerCase().includes(trimmed) || b.url.toLowerCase().includes(trimmed);
  });

  const handleLaunchUrl = (targetUrl: string, title?: string) => {
    let finalUrl = targetUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }
    onOpenUrl(finalUrl, title || trimmed);
    onClose();
  };

  const handleSearchEngine = (engine: 'google' | 'bing' | 'duckduckgo' | 'wikipedia') => {
    const q = encodeURIComponent(query.trim());
    let url = '';
    let name = '';
    if (engine === 'google') {
      url = `https://www.google.com/search?q=${q}`;
      name = `بحث Google: ${query}`;
    } else if (engine === 'duckduckgo') {
      url = `https://duckduckgo.com/?q=${q}`;
      name = `بحث DuckDuckGo: ${query}`;
    } else if (engine === 'bing') {
      url = `https://www.bing.com/search?q=${q}`;
      name = `بحث Bing: ${query}`;
    } else {
      url = `https://ar.wikipedia.org/wiki/Special:Search?search=${q}`;
      name = `ويكيبيديا: ${query}`;
    }
    onOpenUrl(url, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#14213D] border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col text-white max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-[#FCA311] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (isUrlLike) {
                  handleLaunchUrl(query);
                } else if (matchedServices.length > 0) {
                  onOpenService(matchedServices[0]);
                  onClose();
                } else if (query.trim()) {
                  handleSearchEngine('google');
                }
              }
            }}
            placeholder="ابحث في الإنترنت أو أنظمة العزب..."
            className="w-full bg-transparent text-base sm:text-lg focus:outline-none placeholder-[#E5E5E5]/50 font-medium text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#E5E5E5]/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-[#000000]/60 px-2 py-1 rounded text-[#E5E5E5] border border-white/10">
            ESC للإغلاق
          </kbd>
        </div>

        {/* Filter Categories Bar (Segmented Controls) */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#000000]/60 border-b border-white/10 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow-sm'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            الكل ({services.length})
          </button>
          <button
            onClick={() => setSelectedCategory('public')}
            className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'public'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow-sm'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            أنظمة العزب العامة
          </button>
          <button
            onClick={() => setSelectedCategory('private')}
            className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'private'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow-sm'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            الأنظمة الخاصة
          </button>
          <button
            onClick={() => setSelectedCategory('frappe')}
            className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'frappe'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow-sm'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            بيئة Frappe
          </button>
          <button
            onClick={() => setSelectedCategory('web')}
            className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'web'
                ? 'bg-[#FCA311] text-[#000000] font-bold shadow-sm'
                : 'text-[#E5E5E5] hover:bg-white/10'
            }`}
          >
            الويب والمفضلة
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[55vh]">
          {/* Direct URL Detection */}
          {isUrlLike && (
            <div className="p-3 bg-[#000000]/60 border border-[#FCA311]/50 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#FCA311] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">
                    فتح الرابط المباشر في متصفح العزب
                  </div>
                  <div className="text-xs text-[#E5E5E5]/70 font-mono">
                    {query}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleLaunchUrl(query)}
                className="bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <span>فتح الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Search Engines Action Bar if user typed something */}
          {query.trim() && (
            <div>
              <div className="text-xs font-semibold text-[#E5E5E5]/80 mb-2 px-1">
                البحث في محركات الإنترنت
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleSearchEngine('google')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#000000]/40 hover:bg-[#FCA311]/20 text-xs font-medium text-white transition-colors border border-white/10 hover:border-[#FCA311]/40 text-right"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Google</span>
                </button>
                <button
                  onClick={() => handleSearchEngine('duckduckgo')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#000000]/40 hover:bg-[#FCA311]/20 text-xs font-medium text-white transition-colors border border-white/10 hover:border-[#FCA311]/40 text-right"
                >
                  <Search className="w-3.5 h-3.5 text-[#FCA311] shrink-0" />
                  <span className="truncate">DuckDuckGo</span>
                </button>
                <button
                  onClick={() => handleSearchEngine('bing')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#000000]/40 hover:bg-[#FCA311]/20 text-xs font-medium text-white transition-colors border border-white/10 hover:border-[#FCA311]/40 text-right"
                >
                  <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Bing</span>
                </button>
                <button
                  onClick={() => handleSearchEngine('wikipedia')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#000000]/40 hover:bg-[#FCA311]/20 text-xs font-medium text-white transition-colors border border-white/10 hover:border-[#FCA311]/40 text-right"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">ويكيبيديا</span>
                </button>
              </div>
            </div>
          )}

          {/* Matched Services */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#E5E5E5]/80 mb-2 px-1">
              <span>أنظمة وخدمات العزب ({matchedServices.length})</span>
            </div>

            {matchedServices.length === 0 ? (
              <div className="text-center py-6 text-sm text-[#E5E5E5]/60">
                لا توجد خدمات مطابقة لكلمة البحث
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchedServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      onOpenService(service);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#000000]/40 text-right transition-colors group border border-transparent hover:border-[#FCA311]/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#FCA311]/15 flex items-center justify-center text-[#FCA311] shrink-0 group-hover:scale-105 transition-transform border border-[#FCA311]/30">
                        <IconRenderer name={service.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">
                            {service.title}
                          </span>
                          {service.isProtected && (
                            <span className="text-[10px] text-[#FCA311] font-medium flex items-center gap-0.5 bg-[#FCA311]/15 px-1.5 py-0.5 rounded border border-[#FCA311]/30">
                              <Shield className="w-3 h-3" />
                              <span>محمي</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#E5E5E5]/80 truncate mt-0.5">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#E5E5E5]/60 hidden sm:inline">
                        {service.category === 'frappe' ? 'Frappe' : service.category === 'private' ? 'خاص' : 'عام'}
                      </span>
                      <ArrowLeft className="w-4 h-4 text-[#E5E5E5]/60 group-hover:text-[#FCA311] group-hover:-translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarks Section */}
          {matchedBookmarks.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[#E5E5E5]/80 mb-2 px-1">
                المفضلة والروابط السريعة
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedBookmarks.map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => handleLaunchUrl(bm.url, bm.title)}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#000000]/40 hover:bg-[#000000]/60 text-right text-xs transition-colors border border-white/10"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-[#FCA311] shrink-0" />
                      <span className="font-medium text-white truncate">{bm.title}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[#E5E5E5]/60 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2.5 bg-[#000000]/70 border-t border-white/10 text-[11px] text-[#E5E5E5]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Alazab Cloud Unified Search</span>
            <span aria-hidden="true">·</span>
            <span>بحث فوري بضغطة واحدة</span>
          </div>
          <span className="font-mono text-[10px]">One Gateway. All Services.</span>
        </div>
      </div>
    </div>
  );
};
