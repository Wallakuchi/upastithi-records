import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWithError(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
