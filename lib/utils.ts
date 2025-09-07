import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | Date) {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}
