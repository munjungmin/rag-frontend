// components/ui/Modal.tsx
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-[95vw] h-[90vh] overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
