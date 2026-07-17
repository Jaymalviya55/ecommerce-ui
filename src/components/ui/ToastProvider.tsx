import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster 
      position="top-left"
      toastOptions={{
        // Default options for all toasts (can act as info/warning)
        className: 'dark:bg-slate-800 dark:text-white',
        duration: 4000,
        style: {
          background: 'var(--toast-bg, #fff)',
          color: 'var(--toast-color, #334155)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: '0.75rem',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#fff' }, // Emerald Green
          style: {
            borderLeft: '4px solid #10b981',
          }
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' }, // Rose Red
          style: {
            borderLeft: '4px solid #ef4444',
          }
        },
        // We can use default `toast('Warning message', { icon: '⚠️' })` for warnings
        blank: {
          style: {
            borderLeft: '4px solid #f59e0b', // Amber Yellow for general/warnings
          }
        }
      }} 
    />
  );
};
