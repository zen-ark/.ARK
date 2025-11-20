export function getSeededPlaceholder(slug: string) {
  // Use local mockup image for all sizes
  const localMockup = "/images/placeholders/mockup.png";
  return {
    md: localMockup,
    lg: localMockup,
    xl: localMockup,
  };
}


