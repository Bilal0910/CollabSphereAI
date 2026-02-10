// This file contains utility functions that are used across the application.
// --------------------------------------------------------------------------

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


// The cn function is a utility function that combines class names using clsx and twMerge.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The combinedSlug function is a utility function that combines a name and email to create a slug.
export const combinedSlug = (name: string, maxLen = 80): string => {
  const base = name;
  if (!base) return "untitled";
  let s = base
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/\+/g, "")
    .replace(/[^a-z0-9]/g, "-");

  if (!s) s = "untitled";
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
};
