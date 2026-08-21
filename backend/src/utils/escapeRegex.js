/**
 * Escapes special regex characters so user-controlled search input
 * can be safely used inside a MongoDB $regex query without risking
 * ReDoS or unintended pattern matching.
 */
export const escapeRegex = (str = '') => {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
