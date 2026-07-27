/**
 * className utility combining clsx and tailwind-merge.
 * Allows conditional classNames without duplicates or conflicts.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "text-white")
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
