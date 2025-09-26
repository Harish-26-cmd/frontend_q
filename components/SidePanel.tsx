import React, { useEffect, useRef } from 'react';
import type { User } from '../types';
import { XIcon } from './icons';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: User;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, onLogout, user }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      prevActiveElementRef.current = document.activeElement as HTMLElement;

      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements?.[0];
      firstElement?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab' && panelRef.current) {
          if (!focusableElements || focusableElements.length === 0) {
            event.preventDefault();
            return;
          }
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        } else if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        prevActiveElementRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);


  return (
    <div 
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? 'transform-none' : 'translate-x-full'}`
        }
      >
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-color">
                <h2 className="text-xl font-bold text-text-primary">My Profile</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-text-secondary hover:bg-foreground dark:hover:bg-card"
                    aria-label="Close panel"
                >
                    <XIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow overflow-y-auto">
                <div className="flex flex-col items-center text-center">
                    <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-border-color mb-4"
                    />
                    <h3 className="text-2xl font-bold text-text-primary">{user.name}</h3>
                    <p className="text-text-secondary">User ID: {user.id}</p>
                </div>

                <div className="mt-8 space-y-4 border-t border-border-color pt-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-text-secondary">Role:</span>
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                            : 'bg-primary/10 text-primary dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                           {user.role}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-text-secondary">Age:</span>
                        <span className="font-bold text-text-primary">{user.age || 'N/A'}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-text-secondary">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                           {user.status}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-text-secondary">Q-Points:</span>
                        <span className="font-bold text-primary">{user.points.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer with Logout Button */}
            <div className="p-4 border-t border-border-color">
                 <button
                    onClick={onLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300"
                 >
                    Logout
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;