export type PlaceholderSize = "md" | "lg" | "xl";

/** Returns the local mockup placeholder image path. */
export function seededPlaceholder(slug: string, size: PlaceholderSize): string {
  // Use local mockup image for all sizes
  return "/images/placeholders/mockup.png";
}


