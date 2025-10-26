import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-white/10 relative p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl opacity-50 blur-lg -z-10"></div>
        <div className="flex justify-between items-center p-5 border-b border-white/10 sticky top-0">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-transform transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;