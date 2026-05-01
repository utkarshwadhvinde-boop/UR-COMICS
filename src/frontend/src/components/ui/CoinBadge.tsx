import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

interface CoinBadgeProps {
  amount: number;
  size?: "sm" | "md";
  className?: string;
}

export function CoinBadge({ amount, size = "md", className }: CoinBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl font-semibold bg-primary/10 text-primary border border-primary/20",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className,
      )}
    >
      <Coins className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      {amount}
    </span>
  );
}
