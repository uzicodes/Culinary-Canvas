import { customAlphabet } from 'nanoid';

// Create a custom nanoid with uppercase alphanumeric characters (0-9, A-Z)
// Excluding similar looking characters (0, O, I, L, 1) for better readability
const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 5);

/**
 * Generates a professional, human-readable, collision-resistant Order ID
 * Format: CC-YYYY-XXXXX (e.g., CC-2026-X8B2L)
 * 
 * - CC: Culinary Canvas prefix
 * - YYYY: Current year for chronological context
 * - XXXXX: 5-character alphanumeric entropy (30 chars alphabet, ~24M combinations)
 * 
 * @returns {string} A unique order ID in uppercase, URL-friendly format
 */
export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const entropy = nanoid();
  return `CC-${year}-${entropy}`;
}

/**
 * Validates if a string matches the expected Order ID format
 * @param orderId - The order ID to validate
 * @returns {boolean} True if valid format
 */
export function isValidOrderId(orderId: string): boolean {
  const pattern = /^CC-\d{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/;
  return pattern.test(orderId);
}
