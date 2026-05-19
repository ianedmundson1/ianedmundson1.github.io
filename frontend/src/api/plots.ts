import { useQuery } from '@tanstack/react-query';
import type { Data, Layout } from 'plotly.js';
import { apiFetch } from './client';

export type Figure = { data: Data[]; layout: Partial<Layout> };

export const usePlotlyFigure = (url: string | null) => {
  return useQuery({
    queryKey: ['plotly-figure', url],
    queryFn: async ({ signal }) => {
      const result = await apiFetch<Figure>(url as string, { signal });
      if (!result) throw new Error(`Empty response from ${url}`);
      return result;
    },
    enabled: !!url,
    staleTime: Infinity,
    retry: 1,
  });
};
