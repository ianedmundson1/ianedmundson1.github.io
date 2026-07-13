import { useQuery } from '@tanstack/react-query';
import { apiFetchRequired } from './client';

export interface Fire911Metadata {
  table: string;
  rowCount: number;
  fetchedAt: string;
}

export interface Fire911RecentCall {
  incidentNumber: string;
  datetime: string;
  type: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
}

export interface Fire911RecentCallsResponse {
  table: string;
  calls: Fire911RecentCall[];
  fetchedAt: string;
}

export interface Fire911CategoryBucket {
  type: string;
  count: number;
}

export interface Fire911Last24hByCategoryResponse {
  table: string;
  windowEnd: string;
  buckets: Fire911CategoryBucket[];
  fetchedAt: string;
}

const fire911QueryOptions = <T>(segment: string) => ({
  queryKey: ['analytics', 'seattle-fire-911', segment],
  queryFn: ({ signal }: { signal?: AbortSignal }) =>
    apiFetchRequired<T>(`/api/analytics/seattle-fire-911/${segment}`, { signal }),
  // Backend caches for 15 minutes; client can keep results fresh that long too.
  // Retry policy is inherited from the QueryClient default in main.tsx.
  staleTime: 15 * 60 * 1000,
});

export const useFire911Metadata = () =>
  useQuery(fire911QueryOptions<Fire911Metadata>('metadata'));

export const useFire911RecentCalls = () =>
  useQuery(fire911QueryOptions<Fire911RecentCallsResponse>('recent-calls'));

export const useFire911Last24hByCategory = () =>
  useQuery(fire911QueryOptions<Fire911Last24hByCategoryResponse>('last-24h-by-category'));
