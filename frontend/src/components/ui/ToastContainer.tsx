import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastType } from './Toast';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

// Export a singleton instance
export const toast = {
  success: (message: string) => {
    const container = document.getElementById('toast-container');
    if (container) {
      const event = new CustomEvent('toast', {
        detail: { type: 'success', message }
      });
      container.dispatchEvent(event);
    }
  },
  error: (message: string) => {
    const container = document.getElementById('toast-container');
    if (container) {
      const event = new CustomEvent('toast', {
        detail: { type: 'error', message }
      });
      container.dispatchEvent(event);
    }
  },
  warning: (message: string) => {
    const container = document.getElementById('toast-container');
    if (container) {
      const event = new CustomEvent('toast', {
        detail: { type: 'warning', message }
      });
      container.dispatchEvent(event);
    }
  },
  info: (message: string) => {
    const container = document.getElementById('toast-container');
    if (container) {
      const event = new CustomEvent('toast', {
        detail: { type: 'info', message }
      });
      container.dispatchEvent(event);
    }
  }
}; 