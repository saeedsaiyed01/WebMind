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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="glass-strong relative w-full max-w-md rounded-3xl border border-border p-6 shadow-lift animate-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full border border-destructive/30 bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Are you sure?</h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete this item from your dashboard.
            </p>
          </div>
          <div className="mt-2 flex w-full items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={loading} className="flex-1">
              {loading ? "Deleting..." : "Delete Content"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
