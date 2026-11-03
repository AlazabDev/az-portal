/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { QuickNote, NoteCategory } from '../types';
import { 
  StickyNote, 
  X, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Pin, 
  Search, 
  Maximize2, 
  Minimize2, 
  Download, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  FileText, 
  Code, 
  Link as LinkIcon, 
  CheckSquare,
  PenLine,
  Layers
} from 'lucide-react';

interface QuickNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onNotify?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const STORAGE_KEY = 'alazab_quick_notes';

const DEFAULT_NOTES: QuickNote[] = [
  {
    id: 'note-welcome',
    title: 'ملاحظة ترحيبية وتوجيهات سريعة',
    content: 'مرحباً بك في مفكرة Alazab Cloud السريعة! تُحفظ ملاحظاتك وقصاصاتك النصية تلقائياً في المتصفح لاستخدامها في أي وقت أثناء تصفح المسارات.',
    category: 'general',
    pinned: true,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'note-frappe-api',
    title: 'رابط واجهة Frappe Desk المباشر',
    content: 'https://frappe.alazab.cloud/app\nاستخدم هذا المسار للوصول السريع إلى جداول البيانات وفواتير المبيعات.',
    category: 'link',
    pinned: false,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
];

export const QuickNotesPanel: React.FC<QuickNotesPanelProps> = ({
  isOpen,
  onClose,
  onToggle,
  onNotify,
}) => {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading quick notes:', e);
    }
    return DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'list'>('editor');

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving quick notes:', e);
    }
  }, [notes]);

  // Global keyboard shortcut: Alt+N to toggle Quick Notes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCreateNote = (category: NoteCategory = 'general') => {
    const newNote: QuickNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: 'قصاصة جديدة',
      content: '',
      category,
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setViewMode('editor');

    setTimeout(() => {
      contentTextareaRef.current?.focus();
    }, 50);

    if (onNotify) {
      onNotify('تم إنشاء قصاصة جديدة', 'ابدأ في تدوين الملاحظة أو لصق النص السريع.', 'info');
    }
  };

  const handleUpdateNote = (id: string, updates: Partial<QuickNote>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      )
    );
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const noteToDelete = notes.find((n) => n.id === id);
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);

    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
    }

    if (onNotify) {
      onNotify('تم حذف الملاحظة', noteToDelete?.title ? `تمت إزالة "${noteToDelete.title}"` : undefined, 'info');
    }
  };

  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleCopyContent = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);

    if (onNotify) {
      onNotify('تم نسخ النص إلى الحافظة', 'يمكنك لصقه الآن في أي مكان.', 'success', 2500);
    }
  };

  const handleExportAll = () => {
    const textOutput = notes
      .map(
        (n, index) =>
          `[${index + 1}] ${n.title} (${new Date(n.updatedAt).toLocaleString('ar-EG')})\nتصنيف: ${n.category}\n----------------------------------------\n${n.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([textOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alazab-quick-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify('تم تنزيل الملاحظات', 'تم حفظ جميع القصاصات النصية في ملف نصي.', 'success');
    }
  };

  const filteredNotes = notes
    .filter((n) => {
      if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

  const getCategoryBadge = (cat: NoteCategory) => {
    switch (cat) {
      case 'code':
        return { label: 'كود / نص تقني', icon: <Code className="w-3 h-3 text-cyan-400" />, color: 'border-cyan-400/30 text-cyan-400 bg-cyan-400/10' };
      case 'link':
        return { label: 'رابط / مسار', icon: <LinkIcon className="w-3 h-3 text-[#FCA311]" />, color: 'border-[#FCA311]/30 text-[#FCA311] bg-[#FCA311]/10' };
      case 'task':
        return { label: 'مهمة عمل', icon: <CheckSquare className="w-3 h-3 text-emerald-400" />, color: 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10' };
      case 'general':
      default:
        return { label: 'ملاحظة عامة', icon: <FileText className="w-3 h-3 text-[#E5E5E5]" />, color: 'border-white/20 text-[#E5E5E5] bg-white/5' };
    }
  };

  const wordCount = activeNote?.content ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote?.content ? activeNote.content.length : 0;

  return (
    <>
      {/* 1. Floating Launcher Capsule (Visible when panel is closed) */}
      {!isOpen && (
        <aside
          aria-label="الملاحظات السريعة"
          className="fixed bottom-6 end-6 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <button
            onClick={onToggle}
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#14213D]/90 hover:bg-[#14213D] border border-white/20 hover:border-[#FCA311]/70 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl text-white transition-all duration-300 hover:scale-105"
            title="فتح المفكرة السريعة (Alt+N)"
          >
            <div className="w-7 h-7 rounded-full bg-[#FCA311]/20 flex items-center justify-center text-[#FCA311] border border-[#FCA311]/40 shadow-inner group-hover:scale-110 transition-transform">
              <StickyNote className="w-4 h-4 text-[#FCA311]" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-white group-hover:text-[#FCA311] transition-colors">
                المفكرة السريعة
              </span>
              <span className="text-[10px] text-[#E5E5E5]/70 font-mono">
                {notes.length} {notes.length === 1 ? 'قصاصة' : 'قصاصات'}
              </span>
            </div>
            <div className="ms-1 w-2 h-2 rounded-full bg-[#FCA311] shadow-[0_0_8px_rgba(252,163,17,0.8)]" />
          </button>
        </aside>
      )}

      {/* 2. Floating Quick Notes Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded
              ? 'inset-4 sm:inset-10 md:inset-14'
              : 'bottom-4 end-4 w-[95vw] sm:w-[460px] md:w-[500px] h-[580px] max-h-[85vh]'
          }`}
          role="dialog"
          aria-label="المفكرة وقصاصات النصوص السريعة"
        >
          <div className="w-full h-full bg-[#14213D]/95 backdrop-blur-2xl border border-white/20 hover:border-[#FCA311]/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col text-white overflow-hidden relative">
            
            {/* Top Chrome / Window Header */}
            <div className="px-4 py-3 bg-[#000000]/80 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
              
              {/* Title & Badge */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FCA311]/20 flex items-center justify-center text-[#FCA311] border border-[#FCA311]/40 shadow-inner">
                  <StickyNote className="w-4 h-4 text-[#FCA311]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white">المفكرة السريعة</h3>
                    <span className="text-[10px] font-mono bg-white/10 text-[#FCA311] px-2 py-0.5 rounded-full border border-white/10">
                      {notes.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#E5E5E5]/60 font-mono">
                    حفظ تلقائي محلي (Local Storage)
                  </span>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                {/* View Switcher: Editor / All Notes */}
                <button
                  onClick={() => setViewMode(viewMode === 'editor' ? 'list' : 'editor')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    viewMode === 'list'
                      ? 'bg-[#FCA311] text-[#000000] font-bold'
                      : 'bg-white/10 text-[#E5E5E5] hover:bg-white/15 hover:text-white'
                  }`}
                  title={viewMode === 'editor' ? 'عرض كافة الملاحظات' : 'العودة للمحرر'}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{viewMode === 'editor' ? 'كل القصاصات' : 'المحرر'}</span>
                </button>

                {/* New Note Button */}
                <button
                  onClick={() => handleCreateNote('general')}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FCA311] hover:text-[#000000] text-white transition-colors"
                  title="قصاصة جديدة"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Export / Download */}
                <button
                  onClick={handleExportAll}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E5E5E5] hover:text-white transition-colors"
                  title="تصدير وحفظ كل القصاصات كملف نصي (.txt)"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Maximize / Restore */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E5E5E5] hover:text-white transition-colors"
                  title={isExpanded ? 'استعادة الحجم الطبيعي' : 'تكبير النافذة'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500 hover:text-white text-[#E5E5E5] transition-colors"
                  title="تصغير / إغلاق (Alt+N)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Category / Snippet Selector Bar */}
            <div className="px-4 py-2 bg-[#000000]/50 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
              <div className="flex items-center gap-1.5">
                {(['all', 'general', 'link', 'code', 'task'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#FCA311] text-[#000000] font-bold shadow'
                        : 'text-[#E5E5E5]/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat === 'all' && 'الكل'}
                    {cat === 'general' && 'عام'}
                    {cat === 'link' && 'روابط'}
                    {cat === 'code' && 'أكواد'}
                    {cat === 'task' && 'مهام'}
                  </button>
                ))}
              </div>

              {/* Search Bar for Notes */}
              <div className="relative min-w-[130px] sm:min-w-[170px]">
                <Search className="w-3.5 h-3.5 text-[#E5E5E5]/50 absolute right-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في القصاصات..."
                  className="w-full bg-[#000000]/60 text-xs py-1 pr-8 pl-2 rounded-lg border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40"
                />
              </div>
            </div>

            {/* Main Body */}
            {viewMode === 'list' ? (
              /* All Notes Grid / List View */
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {filteredNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#E5E5E5]/60 space-y-3">
                    <StickyNote className="w-10 h-10 text-[#FCA311]/40" />
                    <p className="text-xs">لا توجد قصاصات مطابقة لبحثك الحالي.</p>
                    <button
                      onClick={() => handleCreateNote('general')}
                      className="text-xs text-[#FCA311] font-bold hover:underline"
                    >
                      + إنشاء قصاصة جديدة الآن
                    </button>
                  </div>
                ) : (
                  filteredNotes.map((note) => {
                    const badge = getCategoryBadge(note.category);
                    return (
                      <div
                        key={note.id}
                        onClick={() => {
                          setActiveNoteId(note.id);
                          setViewMode('editor');
                        }}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                          note.id === activeNoteId
                            ? 'bg-white/10 border-[#FCA311]/60 shadow-md'
                            : 'bg-[#000000]/40 border-white/10 hover:border-white/20 hover:bg-[#000000]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {note.pinned && (
                              <Pin className="w-3.5 h-3.5 text-[#FCA311] fill-[#FCA311] shrink-0" />
                            )}
                            <h4 className="text-xs font-bold text-white group-hover:text-[#FCA311] transition-colors truncate">
                              {note.title || 'قصاصة بلا عنوان'}
                            </h4>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${badge.color}`}>
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        <p className="text-xs text-[#E5E5E5]/80 mt-2 line-clamp-2 leading-relaxed font-mono whitespace-pre-wrap">
                          {note.content || 'قصاصة فارغة...'}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/10 text-[10px] text-[#E5E5E5]/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(note.updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleCopyContent(note.content, note.id, e)}
                              className="p-1 rounded hover:bg-white/10 text-[#E5E5E5] hover:text-[#FCA311] transition-colors"
                              title="نسخ محتوى القصاصة"
                            >
                              {copiedId === note.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={(e) => handleTogglePin(note.id, e)}
                              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                                note.pinned ? 'text-[#FCA311]' : 'text-[#E5E5E5]/60 hover:text-white'
                              }`}
                              title={note.pinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteNote(note.id, e)}
                              className="p-1 rounded hover:bg-rose-500/20 text-[#E5E5E5]/60 hover:text-rose-400 transition-colors"
                              title="حذف القصاصة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Active Note Editor View */
              activeNote ? (
                <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
                  
                  {/* Note Title & Category Selector */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#000000]/40 p-2.5 rounded-2xl border border-white/10">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                      placeholder="عنوان الملاحظة..."
                      className="bg-transparent font-bold text-sm text-white focus:outline-none placeholder-[#E5E5E5]/40 flex-1 px-1"
                    />

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Category Selector */}
                      <select
                        value={activeNote.category}
                        onChange={(e) => handleUpdateNote(activeNote.id, { category: e.target.value as NoteCategory })}
                        className="bg-[#14213D] border border-white/15 text-[11px] rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#FCA311]"
                      >
                        <option value="general">عام</option>
                        <option value="link">رابط / URL</option>
                        <option value="code">كود برمجي</option>
                        <option value="task">مهمة</option>
                      </select>

                      {/* Pin button */}
                      <button
                        onClick={() => handleTogglePin(activeNote.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          activeNote.pinned
                            ? 'bg-[#FCA311]/20 border-[#FCA311]/50 text-[#FCA311]'
                            : 'bg-white/5 border-white/10 text-[#E5E5E5]/70 hover:text-white'
                        }`}
                        title={activeNote.pinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy content */}
                      <button
                        onClick={() => handleCopyContent(activeNote.content, activeNote.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#FCA311] hover:text-[#000000] border border-white/10 text-white transition-all"
                        title="نسخ النص كاملاً"
                      >
                        {copiedId === activeNote.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteNote(activeNote.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 text-[#E5E5E5]/70 hover:text-rose-400 transition-colors"
                        title="حذف هذه القصاصة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Textarea Scratchpad */}
                  <div className="flex-1 relative flex flex-col bg-[#000000]/60 rounded-2xl border border-white/15 focus-within:border-[#FCA311]/80 transition-colors overflow-hidden p-3 shadow-inner">
                    <textarea
                      ref={contentTextareaRef}
                      value={activeNote.content}
                      onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })}
                      placeholder="اكتب أو الصق نصاً هنا، رابطاً، أو كوداً برمجياً... (يُحفظ تلقائياً)"
                      className="w-full flex-1 bg-transparent text-xs sm:text-sm text-[#E5E5E5] placeholder-[#E5E5E5]/40 focus:outline-none resize-none leading-relaxed font-mono"
                      dir="auto"
                      spellCheck={false}
                    />
                  </div>

                  {/* Editor Bottom Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-[#E5E5E5]/60 px-1 pt-1 shrink-0">
                    <div className="flex items-center gap-3">
                      <span>{wordCount} كلمة</span>
                      <span aria-hidden="true">·</span>
                      <span>{charCount} حرف</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <Sparkles className="w-3 h-3 text-[#FCA311]" />
                      <span>حُفظ في {new Date(activeNote.updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <StickyNote className="w-12 h-12 text-[#FCA311]/40" />
                  <p className="text-xs text-[#E5E5E5]/70">لا توجد ملاحظات حالياً.</p>
                  <button
                    onClick={() => handleCreateNote('general')}
                    className="bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold px-4 py-2 rounded-xl text-xs shadow transition-colors"
                  >
                    + إنشاء أول قصاصة
                  </button>
                </div>
              )
            )}

            {/* Bottom Global Footer Quick Actions */}
            <div className="px-4 py-2 bg-[#000000]/90 border-t border-white/10 flex items-center justify-between text-[11px] text-[#E5E5E5]/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>متصل محلياً بمساحة التخزين</span>
              </div>

              <span className="font-mono text-[10px]">اختصار: Alt + N</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
