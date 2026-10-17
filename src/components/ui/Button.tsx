import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  primary: "border border-syn-green/60 bg-syn-green/15 text-syn-green hover:bg-syn-green/25",
  secondary: "border border-border bg-card text-foreground hover:border-muted",
  danger: "border border-syn-red/50 text-syn-red hover:bg-syn-red/10",
  ghost: "text-muted hover:text-foreground",
};

const SIZES = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5",
  icon: "grid h-11 w-11 shrink-0 place-items-center",
};

type ButtonStyleProps = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
};

// Also used by links
export function buttonStyles({ variant = "primary", size = "md", className }: ButtonStyleProps = {}) {
  return cn(
    "rounded-md text-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & ButtonStyleProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}
