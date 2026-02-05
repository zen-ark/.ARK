import React from 'react';

/**
 * Checks if a node is a valid React node and NOT an error object.
 * This is useful for guarding against Astro MDX rendering errors where an Error object
 * might be passed as children instead of valid content.
 */
export function isValidReactNode(node: React.ReactNode): boolean {
  if (node instanceof Error) return false;
  
  // Check for error-like objects (duck typing)
  if (node && typeof node === 'object' && 'message' in node && 'stack' in node) {
    // It looks like an error, treat it as invalid
    return false;
  }
  
  return true;
}
