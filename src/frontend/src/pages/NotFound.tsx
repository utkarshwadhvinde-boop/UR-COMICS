import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      data-ocid="not_found.page"
    >
      <p className="text-8xl mb-6">📭</p>
      <h1 className="text-4xl font-display font-bold text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button
          className="gradient-primary text-primary-foreground border-0 rounded-xl px-8"
          data-ocid="not_found.home_link"
        >
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
