/**
 * Converts a string into a URL-friendly slug.
 * @param str The string to convert.
 * @returns The slugified string.
 */
export function toSlug(str: string): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/[^\w-]+/g, ''); // Remove all non-word chars
}