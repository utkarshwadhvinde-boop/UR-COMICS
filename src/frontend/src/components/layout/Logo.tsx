import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export function Logo({ size = "md", className, animate = false }: LogoProps) {
  const sizes = {
    sm: { ur: "text-2xl", comics: "text-xs tracking-[0.25em]", gap: "gap-0.5" },
    md: { ur: "text-3xl", comics: "text-sm tracking-[0.3em]", gap: "gap-1" },
    lg: { ur: "text-6xl", comics: "text-lg tracking-[0.4em]", gap: "gap-2" },
  };
  const s = sizes[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center select-none transition-transform duration-300 hover:scale-105",
        animate && "animate-fade-in-up",
        className,
      )}
    >
      <span
        className={cn("font-display font-bold leading-none", s.ur)}
        style={{
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        UR
      </span>
      <span
        className={cn(
          "font-display font-semibold text-foreground leading-none",
          s.comics,
        )}
      >
        COMICS
      </span>
    </div>
  );
}
