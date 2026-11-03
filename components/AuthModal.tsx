/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthSession } from '../types';
import { Shield, Lock, User, Key, CheckCircle, X, ArrowLeft, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AuthSession) => void;
  pendingServiceName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  pendingServiceName,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور أو استخدام الدخول السريع.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate verified authentication
    setTimeout(() => {
      setIsLoading(false);
      const session: AuthSession = {
        isAuthenticated: true,
        userEmail: email.trim(),
        displayName: email.split('@')[0],
        role: 'مستخدم معتمد',
        lastLogin: Date.now(),
      };
      onLoginSuccess(session);
      onClose();
    }, 400);
  };

  const handleQuickDemoAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const session: AuthSession = {
        isAuthenticated: true,
        userEmail: 'admin@alazab.cloud',
        displayName: 'م. محمد العزب (إدارة النظام)',
        role: 'مدير النظام التنفيذي',
        lastLogin: Date.now(),
      };
      onLoginSuccess(session);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#14213D] border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 rounded-lg text-[#E5E5E5]/70 hover:text-white hover:bg-white/10 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#FCA311]/15 text-[#FCA311] flex items-center justify-center mb-5 border border-[#FCA311]/30 shadow-inner">
          <Shield className="w-7 h-7 text-[#FCA311]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            تسجيل الدخول للأنظمة المحمية
          </h2>
          <p className="text-xs sm:text-sm text-[#E5E5E5] leading-relaxed">
            {pendingServiceName ? (
              <span>
                للوصول إلى <strong className="text-[#FCA311]">{pendingServiceName}</strong>، يلزم تأكيد هوية الحساب المعتمد.
              </span>
            ) : (
              <span>
                تتيح بوابة العزب تصفح المعارض والمواقع بحرية عامة، بينما تقتصر الأنظمة الإدارية وFrappe الخاصة على المصرح لهم.
              </span>
            )}
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Fast Access Demo Button */}
        <div className="mt-6 p-4 rounded-2xl bg-[#000000]/60 border border-white/10 text-right space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FCA311]">
              الدخول التجريبي الفوري (مدير النظام)
            </span>
            <span className="text-[10px] text-[#E5E5E5]/60 font-mono">1-Click Access</span>
          </div>
          <p className="text-[11px] text-[#E5E5E5]">
            يتيح لك فتح كافة الأنظمة المحمية وبيئة Frappe بكامل الصلاحيات للتجربة المباشرة.
          </p>
          <button
            type="button"
            onClick={handleQuickDemoAdminLogin}
            disabled={isLoading}
            className="w-full bg-[#FCA311] hover:bg-[#FFBE4D] text-[#000000] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-colors"
          >
            <Key className="w-4 h-4" />
            <span>دخول فوري كمسؤول معتمد (Admin)</span>
          </button>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleStandardLogin} className="mt-5 space-y-3.5">
          <div className="relative">
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
              البريد الإلكتروني المؤسسي
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@alazab.cloud"
              className="w-full bg-[#000000]/50 text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40 text-left ltr"
              dir="ltr"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1">
              كلمة المرور أو رمز التفويض
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#000000]/50 text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FCA311] text-white placeholder-[#E5E5E5]/40 text-left ltr"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white/10 hover:bg-[#FCA311] hover:text-[#000000] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/20 mt-2 shadow"
          >
            <span>تسجيل الدخول بالحساب</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#E5E5E5]/70">
            الدخول اختياري؛ يمكنك إغلاق هذه النافذة ومواصلة تصفح الأنظمة العامة.
          </p>
        </div>

      </div>
    </div>
  );
};
