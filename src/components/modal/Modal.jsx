import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,

  size = 'lg', // sm | md | lg | xl
  closeOnOverlay = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  return createPortal(
    <div className="modal-view-overlay" onMouseDown={handleOverlayClick}>
      <div
        className={`modal-view-container modal-${size}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-view-header">
          <h3 className="modal-view-title">{title}</h3>
          <button
            className="modal-view-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-view-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
export default Modal;
