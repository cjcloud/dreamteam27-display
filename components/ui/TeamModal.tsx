'use client';

import { useEffect } from 'react';
import TeamCard from '@/components/team/TeamCard';

interface TeamModalProps {
  manager: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamModal({ manager, isOpen, onClose }: TeamModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !manager) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ top: '80px' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ top: '-80px' }}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>
        
        {/* Team Card */}
        <TeamCard manager={manager} />
      </div>
    </div>
  );
}
