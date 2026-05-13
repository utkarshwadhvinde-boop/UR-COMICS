import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error | string | null;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  error,
  message = "Something went wrong.",
  onRetry,
}: ErrorFallbackProps) {
  const detail =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center"
      role="alert"
      data-ocid="error.error_state"
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-body text-foreground font-medium">
          {message}
        </p>
        {detail && (
          <p className="text-sm text-muted-foreground font-mono max-w-md break-words">
            {detail}
          </p>
        )}
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2"
          data-ocid="error.retry_button"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
