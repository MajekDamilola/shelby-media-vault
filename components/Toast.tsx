"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "◎",
  warning: "⚠",
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; bar: string }> = {
  success: {
    bg: "rgba(14,13,10,0.95)",
    border: "rgba(0,229,176,0.25)",
    icon: "#00e5b0",
    bar: "#00e5b0",
  },
  error: {
    bg: "rgba(14,13,10,0.95)",
    border: "rgba(255,87,87,0.25)",
    icon: "#ff5757",
    bar: "#ff5757",
  },
  info: {
    bg: "rgba(14,13,10,0.95)",
    border: "rgba(255,170,0,0.25)",
    icon: "#ffaa00",
    bar: "#ffaa00",
  },
  warning: {
    bg: "rgba(14,13,10,0.95)",
    border: "rgba(255,181,71,0.25)",
    icon: "#ffb547",
    bar: "#ffb547",
  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const c = COLORS[toast.type];

  useEffect(() => {
    // Enter
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto dismiss
    const t2 = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 350);
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.id, onRemove]);

  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "14px 16px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        minWidth: 300, maxWidth: 380,
        position: "relative", overflow: "hidden",
        transform: visible && !leaving ? "translateX(0) scale(1)" : "translateX(100%) scale(0.95)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        cursor: "pointer",
      }}
      onClick={() => { setLeaving(true); setTimeout(() => onRemove(toast.id), 350); }}
    >
      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: `rgba(255,255,255,0.05)`,
      }}>
        <div style={{
          height: "100%", background: c.bar,
          animation: "toastProgress 4s linear forwards",
          borderRadius: 2,
        }} />
      </div>

      {/* Icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `${c.icon}15`,
        border: `1px solid ${c.icon}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: c.icon,
      }}>
        {ICONS[toast.type]}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: toast.message ? 3 : 0 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
            {toast.message}
          </div>
        )}
      </div>

      {/* Close */}
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 1 }}>✕</div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]);
  }, []);

  const ctx: ToastContextType = {
    toast: add,
    success: (t, m) => add("success", t, m),
    error: (t, m) => add("error", t, m),
    info: (t, m) => add("info", t, m),
    warning: (t, m) => add("warning", t, m),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div style={{
        position: "fixed", top: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none",
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "all" }}>
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
