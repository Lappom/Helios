export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "find",
  "coaches",
  "coach",
  "public",
  "settings",
  "sign-in",
  "sign-up",
  "checkout",
  "new",
  "edit",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
