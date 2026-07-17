import { Modal } from './Modal';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false
}: ConfirmModalProps) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} className="text-rose-500 dark:text-rose-400" />;
      case 'warning':
        return <AlertCircle size={24} className="text-amber-500 dark:text-amber-400" />;
      case 'info':
      default:
        return <Info size={24} className="text-blue-500 dark:text-blue-400" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'info':
      default:
        return 'bg-primary hover:bg-primary-hover text-white';
    }
  };

  const getIconBgClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'info':
      default:
        return 'bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center ${getIconBgClass()}`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-5">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${getButtonClass()}`}
        >
          {isLoading && (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          )}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
