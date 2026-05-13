import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  /** Countdown seconds before confirm becomes active (default: 3) */
  countdown?: number;
}

export function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
  countdown = 3,
}: ConfirmModalProps) {
  const [remaining, setRemaining] = useState(countdown);

  useEffect(() => {
    if (!open) {
      setRemaining(countdown);
      return;
    }
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, remaining, countdown]);

  const canConfirm = remaining <= 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="confirm.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            {destructive && (
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
            )}
            <DialogTitle className="text-foreground font-body">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground font-body">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            data-ocid="confirm.cancel_button"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={!canConfirm}
            className={
              destructive
                ? ""
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            }
            data-ocid="confirm.confirm_button"
          >
            {canConfirm ? confirmLabel : `${confirmLabel} (${remaining})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
