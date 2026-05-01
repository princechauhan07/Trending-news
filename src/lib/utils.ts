import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHashtag(tag: string) {
  if (!tag) return "";
  // Remove spaces and underscores, then prefix with #
  const cleanTag = tag.replace(/[#_\s]/g, "");
  return "#" + cleanTag;
}
