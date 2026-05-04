import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = '确认', 
  cancelText = '取消',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-red-600';
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className={`h-6 w-6 ${getIconColor()}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
