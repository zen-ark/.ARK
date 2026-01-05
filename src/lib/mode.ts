/**
 * Mode detection utilities for Agency/Hiring mode switching
 */

export type Mode = 'agency' | 'hiring';

const STORAGE_KEY = 'ark_mode';

/**
 * Normalize a pathname by stripping trailing slashes and removing query/hash
 */
export function normalizePath(pathname: string): string {
  // Remove query params and hash
  const pathOnly = pathname.split('?')[0].split('#')[0];
  // Strip trailing slash (but keep root as '/')
  return pathOnly === '/' ? '/' : pathOnly.replace(/\/$/, '');
}

/**
 * Get the current mode from a pathname
 * Paths ending in /portfolio → hiring, else agency
 */
export function getMode(pathname: string): Mode {
  const normalized = normalizePath(pathname);
  return normalized.endsWith('/portfolio') ? 'hiring' : 'agency';
}

/**
 * Check if a pathname is one of the four homepage routes
 */
export function isHomepageRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return normalized === '/' || normalized === '/portfolio' || normalized === '/de' || normalized === '/de/portfolio';
}

/**
 * Get the stored mode preference from localStorage
 */
export function getModeFromStorage(): Mode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'agency' || stored === 'hiring') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/**
 * Store the mode preference in localStorage
 */
export function setModeInStorage(mode: Mode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage may be unavailable
  }
}

