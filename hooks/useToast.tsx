import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../components/Toast/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToast(options);
  };

  const success = (message: string, duration?: number) => {
    showToast({ message, type: 'success', duration });
  };

  const error = (message: string, duration?: number) => {
    showToast({ message, type: 'error', duration });
  };

  const warning = (message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration });
  };

  const info = (message: string, duration?: number) => {
    showToast({ message, type: 'info', duration });
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onHide={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

