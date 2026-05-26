import React, { useEffect } from 'react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const bgColors = {
    success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200 shadow-emerald-950/20',
    error: 'bg-rose-950/80 border-rose-500/30 text-rose-200 shadow-rose-950/20',
    warning: 'bg-amber-950/80 border-amber-500/30 text-amber-200 shadow-amber-950/20',
    info: 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200 shadow-indigo-950/20'
  };

  const borderColors = {
    success: 'border-l-emerald-500',
    error: 'border-l-rose-500',
    warning: 'border-l-amber-500',
    info: 'border-l-indigo-500'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-l-4 backdrop-blur-md shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in ${bgColors[toast.type]} ${borderColors[toast.type]}`}
      role="alert"
    >
      <span className="text-lg">{icons[toast.type]}</span>
      <div className="flex-1">
        {toast.title && <h4 className="font-bold text-sm mb-0.5">{toast.title}</h4>}
        <p className="text-xs opacity-90 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-xs hover:opacity-100 opacity-60 transition-opacity bg-transparent border-0 text-white cursor-pointer px-1"
      >
        ✕
      </button>
    </div>
  );
}
