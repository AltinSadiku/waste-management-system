import React from 'react';
import { X } from 'lucide-react';

export default function BottomSheet({ open, onClose, children, title, subtitle }) {
  return (
    <div className={`fixed inset-0 z-[1000] ${open ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div
        className={`absolute left-0 right-0 bottom-0 transform transition-all duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-3xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Handle */}
            <div className="pt-4 pb-2 flex items-center justify-center">
              <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
                  )}
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Safe area for mobile devices */}
      <div className="h-[env(safe-area-inset-bottom,0)]" />
    </div>
  );
}


