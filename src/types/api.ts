export interface PaginationMeta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  next: string | null;
  prev: string | null;
}

export interface DomainUsageStat {
  domain: string;
  category?: string;
  total_seconds: number;
}

export interface AnalyticsUsageResponse {
  code: string;
  message: string;
  from_date: string;
  to_date: string;
  pagination: PaginationMeta;
  data: DomainUsageStat[];
}

