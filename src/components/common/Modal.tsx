import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  okButtonTitle?: string;
  okButtonColor?: string;
  onPressOK?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  okButtonTitle = '閉じる',
  okButtonColor = 'bg-blue-600',
  onPressOK,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl py-8 px-12 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[1000px] max-h-[90vh] flex flex-col"
      >
        {title && (
          <h3 className="text-[24px] md:text-[28px] text-center font-semibold text-[#22aebd] mb-4">
            {title}
          </h3>
        )}
        <div className="flex-grow overflow-y-auto mb-4">
          {children}
        </div>
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={onPressOK || onClose}
            className={`
              cursor-pointer inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm
              ${okButtonColor}
              opacity-90 hover:opacity-100
            `}
          >
            {okButtonTitle}
          </button>
        </div>
      </div>
    </div>
  );
} 