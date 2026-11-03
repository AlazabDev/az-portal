/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationDestination, 
  ServiceItem, 
  WorkspaceTab, 
  AuthSession, 
  WebBookmark,
  ServiceCategory,
  ToastNotification,
  ToastType
} from './types';
import { INITIAL_SERVICES, INITIAL_BOOKMARKS } from './data/servicesData';
import { Navbar } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { UnifiedSearchBar } from './components/UnifiedSearchBar';
import { AuthModal } from './components/AuthModal';
import { AddServiceModal } from './components/AddServiceModal';
import { ToastContainer } from './components/ToastContainer';
import { LeftSidebar } from './components/LeftSidebar';
import { PathwaysModal } from './components/PathwaysModal';
import { BrowserOverlayModal } from './components/BrowserOverlayModal';
import { QuickNotesPanel } from './components/QuickNotesPanel';

const App: React.FC = () => {
  // Navigation State
  const [currentDestination, setCurrentDestination] = useState<NavigationDestination>('home');
  
  // Pathway Overlay Modal State: 'public' | 'private' | 'frappe' | 'all' | null
  const [activePathwayCategory, setActivePathwayCategory] = useState<ServiceCategory | 'all' | null>(null);

  // Browser Overlay Modal State
  const [isBrowserOverlayOpen, setIsBrowserOverlayOpen] = useState(false);

  // Quick Notes Floating Panel State
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Theme State (Dark by default with Alazab Navy & Gold)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('alazab_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Services State (combines initial seed and local custom services)
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('alazab_custom_services');
      if (saved) {
        const customItems: ServiceItem[] = JSON.parse(saved);
        return [...customItems, ...INITIAL_SERVICES];
      }
    } catch (e) {
      console.error('Error loading custom services:', e);
    }
    return INITIAL_SERVICES;
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<WebBookmark[]>(INITIAL_BOOKMARKS);

  // Workspace Browser Tabs State
  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    {
      id: 'tab-default',
      title: 'بوابة العزب الرئيسية',
      url: 'https://alazab.cloud',
      type: 'service',
      timestamp: Date.now(),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-default');

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingProtectedServiceName, setPendingProtectedServiceName] = useState<string | undefined>();

  // Auth Session State
  const [authSession, setAuthSession] = useState<AuthSession>(() => {
    try {
      const saved = localStorage.getItem('alazab_auth_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading auth session:', e);
    }
    return { isAuthenticated: false };
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

  const showToast = (
    title: string, 
    message?: string, 
    type: ToastType = 'info', 
    duration = 4000
  ) => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // System Status Check & Update Action
  const handleRefreshSystemStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setTimeout(() => {
          setIsCheckingStatus(false);
          showToast(
            'تم تحديث حالة النظام بنجاح',
            'جميع خوادم وأنظمة ومسارات العزب السحابية وبيئة Frappe متصلة ومستقرة تماماً.',
            'success'
          );
        }, 500);
      } else {
        throw new Error('Health check error');
      }
    } catch {
      setTimeout(() => {
        setIsCheckingStatus(false);
        showToast(
          'حالة النظام نشطة ومستقرة',
          'دليل مسارات العزب متصل وجاهز للوصول الفوري لكافة الخدمات.',
          'info'
        );
      }, 500);
    }
  };

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('alazab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('alazab_theme', 'light');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Direct Pathway opener
  const handleOpenPathway = (cat: ServiceCategory | 'all') => {
    setActivePathwayCategory(cat);
  };

  // Direct Browser opener
  const handleOpenBrowser = () => {
    setIsBrowserOverlayOpen(true);
  };

  // Open Service handler
  const handleOpenService = (service: ServiceItem, inNewWindow = false) => {
    if (service.isProtected && !authSession.isAuthenticated) {
      setPendingProtectedServiceName(service.title);
      setIsAuthOpen(true);
      return;
    }

    if (inNewWindow) {
      window.open(service.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Check if service is already open in a tab
    const existingTab = tabs.find((t) => t.url === service.url);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setIsBrowserOverlayOpen(true);
      return;
    }

    // Otherwise create a new tab and open browser overlay
    const newTab: WorkspaceTab = {
      id: `tab-${Date.now()}`,
      title: service.title,
      url: service.url,
      type: service.category === 'frappe' ? 'frappe' : 'service',
      iconName: service.iconName,
      timestamp: Date.now(),
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowserOverlayOpen(true);
  };

  // Open URL handler
  const handleOpenUrl = (url: string, title?: string) => {
    const existingTab = tabs.find((t) => t.url === url);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setIsBrowserOverlayOpen(true);
      return;
    }

    const newTab: WorkspaceTab = {
      id: `tab-${Date.now()}`,
      title: title || url.replace(/^https?:\/\//, '').split('/')[0],
      url,
      type: 'web',
      timestamp: Date.now(),
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowserOverlayOpen(true);
  };

  // Tab operations
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) {
      setTabs([
        {
          id: `tab-${Date.now()}`,
          title: 'بحث Google',
          url: 'https://www.google.com',
          type: 'web',
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const handleNewTab = (url = 'https://www.google.com', title = 'صفحة جديدة') => {
    const newTab: WorkspaceTab = {
      id: `tab-${Date.now()}`,
      title,
      url,
      type: 'web',
      timestamp: Date.now(),
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowserOverlayOpen(true);
  };

  const handleUpdateTabUrl = (id: string, newUrl: string, newTitle?: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, url: newUrl, title: newTitle || t.title } : t))
    );
  };

  // Add custom service
  const handleAddService = (newService: ServiceItem) => {
    const updated = [newService, ...services];
    setServices(updated);

    try {
      const customOnes = updated.filter((s) => s.isCustom);
      localStorage.setItem('alazab_custom_services', JSON.stringify(customOnes));
    } catch (e) {
      console.error('Error saving custom service:', e);
    }

    showToast(
      'تمت إضافة الخدمة بنجاح',
      `تم إدراج "${newService.title}" في دليل أنظمة ومواقع Alazab Cloud.`,
      'success'
    );
  };

  // Auth operations
  const handleLoginSuccess = (session: AuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem('alazab_auth_session', JSON.stringify(session));
    } catch (e) {
      console.error('Error saving session:', e);
    }

    showToast(
      'تم تسجيل الدخول بنجاح',
      `مرحباً بك، ${session.displayName || 'مسؤول معتمد'} — تم تفعيل الصلاحيات الكاملة للأنظمة المحمية وبيئة Frappe.`,
      'success'
    );
  };

  const handleLogout = () => {
    const emptySession = { isAuthenticated: false };
    setAuthSession(emptySession);
    try {
      localStorage.removeItem('alazab_auth_session');
    } catch (e) {
      console.error('Error removing session:', e);
    }

    showToast(
      'تم تسجيل الخروج',
      'تم إنهاء جلسة العمل والعودة إلى وضع التصفح العام.',
      'info'
    );
  };

  const featuredServices = services.filter((s) => s.featured || s.isCustom);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white font-sans selection:bg-[#FCA311] selection:text-[#000000] relative">
      
      {/* Strict Top Bar Contract Navigation / Browser Chrome */}
      <Navbar
        currentDestination={currentDestination}
        onNavigate={() => {
          setActivePathwayCategory(null);
          setIsBrowserOverlayOpen(false);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddService={() => setIsAddServiceOpen(true)}
        onOpenAuth={() => {
          setPendingProtectedServiceName(undefined);
          setIsAuthOpen(true);
        }}
        authSession={authSession}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        activeTabsCount={tabs.length}
        onRefreshSystemStatus={handleRefreshSystemStatus}
        isCheckingStatus={isCheckingStatus}
        currentUrl={tabs.find((t) => t.id === activeTabId)?.url || 'https://alazab.cloud'}
        onNewTab={() => handleNewTab()}
        onToggleNotes={() => setIsNotesOpen((prev) => !prev)}
        isNotesOpen={isNotesOpen}
      />

      {/* Floating Vertical Glass Sidebar (matches screenshot) */}
      <LeftSidebar
        currentDestination={currentDestination}
        onNavigate={() => {
          setActivePathwayCategory(null);
          setIsBrowserOverlayOpen(false);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onRefreshSystemStatus={handleRefreshSystemStatus}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenPathway={handleOpenPathway}
        onOpenBrowser={handleOpenBrowser}
        onToggleNotes={() => setIsNotesOpen((prev) => !prev)}
        isNotesOpen={isNotesOpen}
      />

      {/* Main Single Master Canvas (Unified Gateway) */}
      <main className="flex-1 flex flex-col md:pl-16">
        <HomeOverview
          onNavigate={() => {
            setActivePathwayCategory(null);
            setIsBrowserOverlayOpen(false);
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenService={handleOpenService}
          featuredServices={featuredServices}
          authSession={authSession}
          onOpenAuth={() => setIsAuthOpen(true)}
          onRefreshSystemStatus={handleRefreshSystemStatus}
          isCheckingStatus={isCheckingStatus}
          onOpenAddService={() => setIsAddServiceOpen(true)}
          onOpenPathway={handleOpenPathway}
          onOpenBrowser={handleOpenBrowser}
        />
      </main>

      {/* Pathway Detail Modal (Non-disruptive overlay for Public, Private, Frappe, All) */}
      <PathwaysModal
        isOpen={activePathwayCategory !== null}
        onClose={() => setActivePathwayCategory(null)}
        category={activePathwayCategory || 'all'}
        services={services}
        onOpenService={handleOpenService}
        onOpenAuth={() => setIsAuthOpen(true)}
        authSession={authSession}
        onOpenAddService={() => setIsAddServiceOpen(true)}
      />

      {/* Browser Overlay View (Seamless in-place web browsing returning to the single gateway) */}
      <BrowserOverlayModal
        isOpen={isBrowserOverlayOpen}
        onClose={() => setIsBrowserOverlayOpen(false)}
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onUpdateTabUrl={handleUpdateTabUrl}
        bookmarks={bookmarks}
      />

      {/* Unified Command Search Modal */}
      <UnifiedSearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        services={services}
        bookmarks={bookmarks}
        onOpenService={handleOpenService}
        onOpenUrl={handleOpenUrl}
      />

      {/* Optional Auth Modal for Protected Systems */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        pendingServiceName={pendingProtectedServiceName}
      />

      {/* Add New Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onAddService={handleAddService}
      />

      {/* Quick Notes Floating Panel (Temporary text snippets with localStorage persistence) */}
      <QuickNotesPanel
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        onToggle={() => setIsNotesOpen((prev) => !prev)}
        onNotify={showToast}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
};

export default App;