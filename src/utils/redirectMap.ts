// Redirect mapping from old URL slugs to new column IDs
// Format: old-slug -> new-column-id
export const columnRedirectMap: Record<string, number> = {
  'furugi': 45,
  // Add more mappings here as needed
  // Example: 'another-slug': 123,
};

// Helper function to get redirect destination
export const getColumnRedirectDestination = (slug: string): string | null => {
  const columnId = columnRedirectMap[slug];
  if (columnId) {
    return `/column/column-${columnId}`;
  }
  return null;
};

// Helper function to check if slug exists in redirect map
export const hasColumnRedirect = (slug: string): boolean => {
  return slug in columnRedirectMap;
};
