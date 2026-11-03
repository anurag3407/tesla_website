/**
 * Safely escapes user input for RegExp patterns to prevent regex injection,
 * unhandled syntax errors, and ReDoS vulnerabilities in MongoDB $regex queries.
 */
export function escapeRegex(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validates whether a value is a standard 24-character hex MongoDB ObjectId.
 */
export function isValidObjectId(id: unknown): id is string {
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}
