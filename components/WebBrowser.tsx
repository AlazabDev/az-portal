/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { WorkspaceTab, WebBookmark } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Lock, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  X, 
  Globe, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  Star,
  Search,
  BookOpen
} from 'lucide-react';

interface WebBrowserProps {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string, title?: string) => void;
  onUpdateTabUrl: (id: string, newUrl: string, newTitle?: string) => void;
  bookmarks: WebBookmark[];
  onNavigateHome: () => void;
}

export const WebBrowser: React.FC<WebBrowserProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onUpdateTabUrl,
  bookmarks,
  onNavigateHome,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [addressBarInput, setAddressBarInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [embedState, setEmbedState] = useState<{
    canEmbed: boolean;
    checked: boolean;
    reason?: string;
  }>({ canEmbed: true, checked: false });
  const [forceIframe, setForceIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync address bar input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setAddressBarInput(activeTab.url);
      setForceIframe(false);
      checkUrlEmbeddability(activeTab.url);
    }
  }, [activeTab?.id, activeTab?.url]);

  const checkUrlEmbeddability = async (targetUrl: string) => {
    if (!targetUrl || targetUrl === 'about:blank') {
      setEmbedState({ canEmbed: true, checked: true });
      return;
    }

    // Common known sites that always block iframes
    const knownBlockers = ['google.com', 'youtube.com', 'x.com', 'twitter.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'github.com'];
    const isKnown = knownBlockers.some((domain) => targetUrl.toLowerCase().includes(domain));
    if (isKnown) {
      setEmbedState({
        canEmbed: false,
        checked: true,
        reason: 'هذا الموقع يطبق حماية X-Frame-Options تمنع التضمين داخل النوافذ المدمجة.',
      });
      return;
    }

    try {
      const res = await fetch(`/api/inspect-url?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const data = await res.json();
        setEmbedState({
          canEmbed: data.canEmbed ?? true,
          checked: true,
          reason: data.canEmbed ? undefined : 'الموقع يمنع التضمين داخل الإطارات عبر إعدادات الأمان الخاصة به.',
        });
      } else {
        setEmbedState({ canEmbed: true, checked: true });
      }
    } catch {
      setEmbedState({ canEmbed: true, checked: true });
    }
  };

  const handleNavigateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!addressBarInput.trim() || !activeTab) return;

    let target = addressBarInput.trim();
    // If it's a search term, search via Google
    if (!target.includes('.') && !target.startsWith('http')) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    } else if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    let pageTitle = target.replace(/^https?:\/\//, '').split('/')[0];
    onUpdateTabUrl(activeTab.id, target, pageTitle);
  };

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
        setIsLoading(false);
      }, 200);
    } else {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleCopyUrl = () => {
    if (activeTab?.url) {
      navigator.clipboard.writeText(activeTab.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenExternal = () => {
    if (activeTab?.url) {
      window.open(activeTab.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`flex flex-col bg-[#000000] ${
      isFullScreen ? 'fixed inset-0 z-50 p-2 bg-[#000000]/95' : 'h-[calc(100vh-4rem)]'
    }`}>
      
      {/* Top Tabs Bar */}
      <div className="bg-[#000000] px-3 pt-2 flex items-center gap-1.5 overflow-x-auto border-b border-white/10 shrink-0 text-xs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group max-w-[220px] min-w-[120px] flex items-center justify-between gap-2 px-3 py-2 rounded-t-xl cursor-pointer select-none transition-colors ${
                isActive
                  ? 'bg-[#14213D] text-white font-semibold shadow border-t-2 border-[#FCA311]'
                  : 'bg-white/5 hover:bg-white/10 text-[#E5E5E5] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Globe className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FCA311]' : 'text-[#E5E5E5]/60'}`} />
                <span className="truncate">{tab.title || 'تبويب جديد'}</span>
              </div>
              
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="opacity-70 hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-opacity"
                  title="إغلاق التبويب"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={() => onNewTab('https://www.google.com', 'صفحة جديدة')}
          className="p-1.5 text-[#E5E5E5] hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
          title="فتح تبويب جديد"
        >
          <Plus className="w-4 h-4 text-[#FCA311]" />
        </button>
      </div>

      {/* Browser Controls & Address Bar */}
      <div className="bg-[#14213D] px-3 py-2.5 flex items-center gap-2 border-b border-white/10 shadow-sm shrink-0">
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 shrink-0 text-[#E5E5E5]">
          <button
            onClick={onNavigateHome}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="العودة للرئيسية"
          >
            <Home className="w-4 h-4 text-[#FCA311]" />
          </button>

          <button
            onClick={() => window.history.back()}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
            title="السابق"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.history.forward()}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
            title="التالي"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleReload}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
              isLoading ? 'animate-spin text-[#FCA311]' : ''
            }`}
            title="تحديث الصفحة"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigateSubmit} className="flex-1 flex items-center relative">
          <div className="w-full flex items-center bg-[#000000]/60 border border-white/15 rounded-xl px-3 py-1.5 gap-2 text-xs text-white focus-within:border-[#FCA311] focus-within:ring-1 focus-within:ring-[#FCA311] transition-all">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="اتصال آمن SSL" />
            <input
              type="text"
              value={addressBarInput}
              onChange={(e) => setAddressBarInput(e.target.value)}
              placeholder="اكتب عنوان URL أو ابحث في الويب..."
              className="w-full bg-transparent focus:outline-none font-mono text-xs text-left ltr text-white placeholder-[#E5E5E5]/40"
              dir="ltr"
            />
            {addressBarInput && (
              <button
                type="submit"
                className="bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-2.5 py-0.5 rounded text-[11px] transition-colors shrink-0"
              >
                انتقال
              </button>
            )}
          </div>
        </form>

        {/* Utility buttons */}
        <div className="flex items-center gap-1 shrink-0 text-[#E5E5E5]">
          <button
            onClick={handleCopyUrl}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors relative"
            title="نسخ الرابط"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleOpenExternal}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="فتح في نافذة مستقلة جديدة"
          >
            <ExternalLink className="w-4 h-4 text-[#FCA311]" />
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={isFullScreen ? 'تصغير الشاشة' : 'تكبير الشاشة'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Bookmarks Bar */}
      <div className="bg-[#000000]/70 px-4 py-1.5 flex items-center gap-2 border-b border-white/10 overflow-x-auto text-xs shrink-0 text-[#E5E5E5]">
        <span className="text-[11px] font-semibold text-[#E5E5E5]/70 shrink-0 flex items-center gap-1">
          <Star className="w-3 h-3 text-[#FCA311]" />
          <span>المفضلة:</span>
        </span>
        {bookmarks.map((bm) => (
          <button
            key={bm.id}
            onClick={() => {
              if (activeTab) onUpdateTabUrl(activeTab.id, bm.url, bm.title);
            }}
            className="px-2 py-0.5 rounded hover:bg-white/10 text-[#E5E5E5] font-medium transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <span>{bm.title}</span>
          </button>
        ))}
      </div>

      {/* Viewport Area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {/* Anti-Embed Restriction Banner or Iframe View */}
        {!embedState.canEmbed && !forceIframe ? (
          <div className="h-full flex items-center justify-center p-6 bg-[#000000]">
            <div className="max-w-md w-full bg-[#14213D] border border-white/20 rounded-2xl p-6 sm:p-8 text-center shadow-xl space-y-5 animate-in fade-in duration-200 text-white">
              <div className="w-16 h-16 rounded-2xl bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center mx-auto border border-[#FCA311]/40">
                <ShieldAlert className="w-8 h-8 text-[#FCA311]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  الموقع يطبق سياسة حماية الإطارات
                </h3>
                <p className="text-xs sm:text-sm text-[#E5E5E5] mt-2 leading-relaxed">
                  يمنع هذا الموقع (أو محرك البحث) عرضه داخل إطار مدمج لحماية الجلسات والأمان (X-Frame-Options / CSP).
                </p>
                <div className="mt-3 p-2 bg-[#000000]/50 rounded-lg text-xs font-mono text-[#E5E5E5] truncate ltr border border-white/10" dir="ltr">
                  {activeTab?.url}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleOpenExternal}
                  className="flex-1 bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح الموقع في نافذة جديدة</span>
                </button>

                <button
                  onClick={() => setForceIframe(true)}
                  className="bg-white/10 hover:bg-white/15 text-[#E5E5E5] py-2.5 px-4 rounded-xl text-xs font-medium transition-colors border border-white/10"
                >
                  المحاولة داخل الإطار
                </button>
              </div>

              <div className="text-[11px] text-[#E5E5E5]/60">
                ستظل متصلاً ومحتفظاً بتبويباتك داخل Alazab Cloud دون انقطاع.
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={activeTab?.url}
            title={activeTab?.title || 'Web View'}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
            loading="lazy"
            onError={() => {
              setEmbedState({
                canEmbed: false,
                checked: true,
                reason: 'تعذر تحميل الإطار المباشر للموقع.',
              });
            }}
          />
        )}
      </div>

    </div>
  );
};
