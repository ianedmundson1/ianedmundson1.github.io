import { useQuery } from '@tanstack/react-query';
import type { Data, Layout } from 'plotly.js';

export type Figure = { data: Data[]; layout: Partial<Layout> };

export const usePlotlyFigure = (url: string | null) => {
  return useQuery({
    queryKey: ['plotly-figure', url],
    queryFn: async ({ signal }) => {
      const res = await fetch(url as string, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as Figure;
    },
    enabled: !!url,
    staleTime: Infinity,
    retry: 1,
  });
};
