import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div
      id="status-toast"
      className={`status-toast ${message ? 'is-visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message || ''}
    </div>
  );
};
