import React, { useState, useEffect } from 'react';

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(); // Call onClose after fade out
      }, 5000); // Disappear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !isVisible) return null;

  return (
    <div
      role="alert"
      className="alert alert-success fixed top-0 left-0 right-0 z-50 transition-opacity duration-1000 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }} // Fade-out effect
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
      <button onClick={() => setIsVisible(false)} className="btn btn-ghost btn-sm ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
