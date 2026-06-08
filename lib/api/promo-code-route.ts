export function getPromoCodeIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const promoIndex = segments.indexOf("promo-codes");
  return promoIndex >= 0 ? (segments[promoIndex + 1] ?? "") : "";
}
