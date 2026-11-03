/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkspaceTab, WebBookmark } from '../types';
import { WebBrowser } from './WebBrowser';
import { X, ArrowRight, Home } from 'lucide-react';

interface BrowserOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string, title?: string) => void;
  onUpdateTabUrl: (id: string, newUrl: string, newTitle?: string) => void;
  bookmarks: WebBookmark[];
}

export const BrowserOverlayModal: React.FC<BrowserOverlayModalProps> = ({
  isOpen,
  onClose,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onUpdateTabUrl,
  bookmarks,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
      {/* Top Banner to return to Master Directory */}
      <div className="bg-[#000000] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-white">
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow"
        >
          <Home className="w-4 h-4" />
          <span>العودة إلى دليل العزب الموحد</span>
        </button>

        <span className="text-[#E5E5E5]/70 font-mono text-[11px] hidden sm:inline">
          Alazab Cloud — متصفح مسارات الويب المتكامل
        </span>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors"
          title="إغلاق المتصفح"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Embedded Browser Canvas */}
      <div className="flex-1 overflow-hidden">
        <WebBrowser
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={onSelectTab}
          onCloseTab={onCloseTab}
          onNewTab={onNewTab}
          onUpdateTabUrl={onUpdateTabUrl}
          bookmarks={bookmarks}
          onNavigateHome={onClose}
        />
      </div>
    </div>
  );
};
