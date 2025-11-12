import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Fungsi ini menggabungkan beberapa className Tailwind secara aman
export function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs))
}
