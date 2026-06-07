export type PaginationParams = {
  page: number;
  limit: number;
  offset: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(
  searchParams: URLSearchParams,
): PaginationParams {
  const rawPage = Number.parseInt(searchParams.get("page") ?? "", 10);
  const rawLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

export function withTotalCountHeaders(
  headers: HeadersInit | undefined,
  total: number,
): Headers {
  const merged = new Headers(headers);
  merged.set("X-Total-Count", String(total));
  return merged;
}
