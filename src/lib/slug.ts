/**
 * Turns a display string into a URL-safe slug.
 * Strips accents (Hermès → hermes), lowercases, and hyphenates.
 * Shared by the seed script and the admin product create/edit path.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
