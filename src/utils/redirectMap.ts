// Redirect mapping from old URL slugs to new column IDs
// Format: old-slug -> new-column-id
export const columnRedirectMap: Record<string, number> = {
  'furugi': 82,
  'kaitorieigyo_skill': 39,
  'column202312': 43,
  'hibrand-work': 84,
  'brandkanteishi202404': 47,
  'kouri_tenshoku': 106,
  'anthi-ku-work': 107,
  'watch_recruit': 108,
  'vintage': 111,
  'column202401': 115,
  'brand-authenticator': 120,
  'column20231116': 145,
  'auction': 146,
  'chanel-work': 147,
  'gucci_work': 148,
  'card': 149,
  'sneaker': 150,
  'iphone': 151,
  'jewelry_recruit': 152,
  'ermes-work': 153,
  'gold_jewelry': 154,
  'supreme_recruit': 155,
  'saitamakaitori': 156,
  '越境ec市場の規模や地域特性今後の見通しについて': 157,
  '世界の環境問題から、リサイクル・リユース業界': 158,
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
