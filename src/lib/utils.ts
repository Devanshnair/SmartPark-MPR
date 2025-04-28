import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCreditCardNumber(value: string): string {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, '')
  
  // Limit to 16 digits
  const truncated = digitsOnly.slice(0, 16)
  
  // Add spaces every 4 digits
  const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ')
  
  return formatted
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(value: string): string {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, '')
  
  // Limit to 4 digits
  const truncated = digitsOnly.slice(0, 4)
  
  // Format as MM/YY if we have at least 3 digits
  if (truncated.length >= 3) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2)}`
  } else if (truncated.length === 2) {
    return `${truncated}/`
  }
  
  return truncated
}