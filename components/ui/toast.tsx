// @/components/ui/toast.tsx

// 定义 ToastProps 类型
export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export interface ToasterToast extends ToastProps {
  id: string;
  onOpenChange?: (open: boolean) => void;
}

// 定义 ToastActionElement 类型
export interface ToastActionElement {
  label: string;
  onClick: () => void;
}


const Toast = ({ title, description, variant = 'default' }: ToastProps) => {
  const className = `p-4 rounded-lg shadow-md ${variant === 'success' ? 'bg-green-100' : variant === 'warning' ? 'bg-yellow-100' : variant === 'destructive' ? 'bg-red-100' : 'bg-gray-100'}`;

  return (
    <div className={className}>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-700">{description}</p>}
    </div>
  );
};

export default Toast;