import { customAlphabet } from 'nanoid';

// Create a custom nanoid with uppercase alphanumeric characters (0-9, A-Z)
// Excluding similar looking characters (0, O, I, L, 1) 
const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 5);

/**
 * Order ID
 * Format: CC-YYYY-XXXXX (e.g., CC-2026-X8B2L)
 * @returns {string} Generated Order ID
 */
export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const entropy = nanoid();
  return `CC-${year}-${entropy}`;
}

/**
 * Order ID Validation
 * @param orderId 
 * @returns {boolean} T/F
 */
export function isValidOrderId(orderId: string): boolean {
  const pattern = /^CC-\d{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/;
  return pattern.test(orderId);
}
