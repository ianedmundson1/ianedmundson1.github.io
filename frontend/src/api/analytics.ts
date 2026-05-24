import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

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

export interface  Fire911RecentCallsResponse {
    table: string;
    calls: Fire911RecentCall[];
    fetchedAt: string;
}
    
export interface  Fire911CategoryBucket {
    type: string;
    count: number;
}

export interface  Fire911Last24hByCategoryResponse {
    table: string;
    windowEnd: string;
    buckets: Fire911CategoryBucket[];
    fetchedAt: string;
}

const fetchFire911Metadata = async (signal?: AbortSignal): Promise<Fire911Metadata> => {
  const json = await apiFetch<Fire911Metadata>(
    '/api/analytics/seattle-fire-911/metadata',
    { signal },
  );
  if (!json) throw new Error('Empty response from /api/analytics/seattle-fire-911/metadata');
  return json;
};

const fetchFire911RecentCalls = async (signal?: AbortSignal): Promise<Fire911RecentCallsResponse> => {
  const json = await apiFetch<Fire911RecentCallsResponse>(
    '/api/analytics/seattle-fire-911/recent-calls',
    { signal },
  );
  if (!json) throw new Error('Empty response from /api/analytics/seattle-fire-911/recent-calls');
  return json;
};

const fetchFire911Last24hByCategory = async (signal?: AbortSignal): Promise<Fire911Last24hByCategoryResponse> => {
  const json = await apiFetch<Fire911Last24hByCategoryResponse>(
    '/api/analytics/seattle-fire-911/last-24h-by-category',
    { signal },
  );
  if (!json) throw new Error('Empty response from /api/analytics/seattle-fire-911/last-24h-by-category');
  return json;
};

export const useFire911Metadata = () =>
  useQuery({
    queryKey: ['analytics', 'seattle-fire-911', 'metadata'],
    queryFn: ({ signal }) => fetchFire911Metadata(signal),
    // Backend caches for 15 minutes; client can keep results fresh that long too.
    // Retry policy is inherited from the QueryClient default in main.tsx.
    staleTime: 15 * 60 * 1000,
});

export const useFire911RecentCalls = () =>
  useQuery({
    queryKey: ['analytics', 'seattle-fire-911', 'recent-calls'],
    queryFn: ({ signal }) => fetchFire911RecentCalls(signal),
    // Backend caches for 15 minutes; client can keep results fresh that long too.
    // Retry policy is inherited from the QueryClient default in main.tsx.
    staleTime: 15 * 60 * 1000,
});


export const useFire911Last24hByCategory = () =>
  useQuery({
    queryKey: ['analytics', 'seattle-fire-911', 'last-24h-by-category'],
    queryFn: ({ signal }) => fetchFire911Last24hByCategory(signal),
    // Backend caches for 15 minutes; client can keep results fresh that long too.
    // Retry policy is inherited from the QueryClient default in main.tsx.
    staleTime: 15 * 60 * 1000,
});

