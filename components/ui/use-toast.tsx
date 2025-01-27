import { useState } from 'react';

import type {
  ToastActionElement,
  ToastProps,
  ToasterToast,
} from '@/components/ui/toast';

const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const showToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToasterToast = {
      ...props,
      id,
      onOpenChange: (open) => {
        if (!open) dismiss(id);
      },
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, onOpenChange: undefined } : toast
      )
    );
  };

  return { toasts, showToast, removeToast };
};

export { useToast, ToastProps, ToastActionElement };