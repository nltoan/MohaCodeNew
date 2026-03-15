/**
 * Extracts the ID from a URL slug.
 * @param {string} slug - The input string (e.g., chuc-nang-nhiem-vu---id46287)
 * @returns {string|null} - Returns the extracted ID or null if not found
 */
export function getIdFromSlug(slug: string, prefix: string = "id") {
  if (!slug) return null;

  // Regex explanation:
  // id    : Matches the characters "id" literally
  // (\d+) : Captures a group of one or more digits
  // $     : Anchors the match to the end of the string
  const match = slug.match(`${prefix}(\\d+)$`);

  // match[1] contains the first captured group (the numbers)
  return match ? match[1] : null;
}

function convertToSlug(str: string) {
  if (!str) return '';

  str = str.toLowerCase();

  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  str = str.replace(/[đĐ]/g, 'd');

  str = str.replace(/([^0-9a-z-\s])/g, '');

  str = str.replace(/(\s+)/g, '-');

  str = str.replace(/-+/g, '-');

  str = str.replace(/^-+|-+$/g, '');

  return str;
}

export function getNewURL(path: string, title: string, slug: string | number) {
  return `/${path}/${convertToSlug(title)}---id${slug}`;
}
