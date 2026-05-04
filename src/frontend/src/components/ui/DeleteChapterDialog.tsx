import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chapterTitle: string;
  isDeleting: boolean;
}

export function DeleteChapterDialog({
  isOpen,
  onClose,
  onConfirm,
  chapterTitle,
  isDeleting,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isDeleting && onClose()}
    >
      <DialogContent
        className="rounded-3xl max-w-sm modal-glass"
        data-ocid="delete_chapter.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-destructive/15 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-display font-bold text-foreground">
              Delete Chapter
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{chapterTitle}&rdquo;
            </span>
            ? This action cannot be undone and all associated images will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
            disabled={isDeleting}
            data-ocid="delete_chapter.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1 rounded-xl gap-2 font-semibold"
            onClick={onConfirm}
            disabled={isDeleting}
            data-ocid="delete_chapter.confirm_button"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete Chapter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
