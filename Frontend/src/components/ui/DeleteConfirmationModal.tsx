import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./Button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Are you sure?</h3>
            <p className="text-sm text-zinc-400">
              This action cannot be undone. This will permanently delete this item from your dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full mt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {loading ? "Deleting..." : "Delete Content"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
