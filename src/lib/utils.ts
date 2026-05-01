import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHashtag(tag: string) {
  if (!tag) return "";
  // Ensure we don't double prefix # if it already exists
  const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
  return "#" + cleanTag.replaceAll("_", "");
}
