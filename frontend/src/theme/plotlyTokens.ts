export const PLOTLY_THEME_TOKENS = {
  light: {
    fontColor: '#1c1917',
    grid: 'rgba(28, 25, 23, 0.18)',
    line: 'rgba(28, 25, 23, 0.45)',
  },
  dark: {
    fontColor: '#d6d3d1',
    grid: 'rgba(255, 255, 255, 0.12)',
    line: 'rgba(255, 255, 255, 0.25)',
  },
} as const;

export type PlotlyTheme = keyof typeof PLOTLY_THEME_TOKENS;
