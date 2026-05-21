import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

export interface Fire911Metadata {
  table: string;
  rowCount: number;
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

export const useFire911Metadata = () =>
  useQuery({
    queryKey: ['analytics', 'seattle-fire-911', 'metadata'],
    queryFn: ({ signal }) => fetchFire911Metadata(signal),
    // Backend caches for 15 minutes; client can keep results fresh that long too.
    // Retry policy is inherited from the QueryClient default in main.tsx.
    staleTime: 15 * 60 * 1000,
  });
