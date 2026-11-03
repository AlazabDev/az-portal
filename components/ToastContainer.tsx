/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-5 start-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="الإشعارات"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#FCA311] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#FCA311] shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40';
      case 'warning':
        return 'border-[#FCA311]/50';
      case 'error':
        return 'border-rose-500/40';
      case 'info':
      default:
        return 'border-[#FCA311]/30';
    }
  };

  return (
    <div
      className={`pointer-events-auto bg-[#14213D] border ${getBorderColor()} rounded-2xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all duration-300 transform translate-y-0 text-white animate-in slide-in-from-bottom-3 fade-in`}
    >
      {/* Icon */}
      <div className="pt-0.5">{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-xs sm:text-sm font-bold leading-tight text-white">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-[11px] sm:text-xs text-[#E5E5E5] mt-1 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#E5E5E5]/70 hover:text-white p-1 rounded-lg transition-colors shrink-0"
        title="إغلاق الإشعار"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Subtle Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311] opacity-30"
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};
