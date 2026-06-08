import { cn } from "~/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};


const colorPalette = [
  "bg-indigo-500", "bg-violet-500", "bg-pink-500",
  "bg-rose-500",   "bg-orange-500", "bg-amber-500",
  "bg-emerald-500","bg-teal-500",   "bg-cyan-500",  "bg-sky-500",
];

function pickColor(name: string): string {
  const index = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % colorPalette.length;
  return colorPalette[index];
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none",
        pickColor(name),
        sizeStyles[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
