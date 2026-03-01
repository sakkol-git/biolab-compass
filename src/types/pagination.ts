// ═══════════════════════════════════════════════════════════════════════════
// Pagination — Laravel paginated response wrapper
// ═══════════════════════════════════════════════════════════════════════════

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
