import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import type { Data, Layout, Config } from 'plotly.js';
import { useTheme } from '../../context/ThemeContext';
import styles from './PlotlyEmbed.module.css';

const Plot = lazy(async () => {
  const [{ default: createPlotlyComponent }, plotlyMod] = await Promise.all([
    import('react-plotly.js/factory'),
    import('plotly.js-dist-min'),
  ]);
  return { default: createPlotlyComponent(plotlyMod.default) };
});

type Figure = { data: Data[]; layout: Partial<Layout> };

type PlotlyEmbedProps = {
  src: string;
  ariaLabel: string;
  height?: number;
  mobileHeight?: number;
};

const baseConfig: Partial<Config> = {
  displaylogo: false,
  displayModeBar: false,
  responsive: true,
};

const THEME_TOKENS = {
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

const themedLayout = (
  layout: Partial<Layout>,
  theme: 'light' | 'dark',
): Partial<Layout> => {
  const t = THEME_TOKENS[theme];
  const axisOverrides = {
    backgroundcolor: 'rgba(0,0,0,0)',
    gridcolor: t.grid,
    linecolor: t.line,
    zerolinecolor: t.line,
    color: t.fontColor,
    showbackground: false,
  };
  const scene = layout.scene as Record<string, unknown> | undefined;
  return {
    ...layout,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { ...(layout.font ?? {}), color: t.fontColor },
    scene: {
      ...(scene ?? {}),
      xaxis: { ...((scene?.xaxis as object) ?? {}), ...axisOverrides },
      yaxis: { ...((scene?.yaxis as object) ?? {}), ...axisOverrides },
      zaxis: { ...((scene?.zaxis as object) ?? {}), ...axisOverrides },
    },
  };
};

const PlotlyEmbed = ({ src, ariaLabel, height = 600, mobileHeight = 360 }: PlotlyEmbedProps) => {
  const { theme } = useTheme();
  const [figure, setFigure] = useState<Figure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(src, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: Figure) => setFigure(j))
      .catch((e: Error) => {
        if (!ctrl.signal.aborted) setError(e.message);
      });
    return () => ctrl.abort();
  }, [src]);

  const layout = useMemo(
    () => (figure ? themedLayout(figure.layout, theme) : null),
    [figure, theme],
  );

  const cssVars = {
    ['--plot-h' as string]: `${height}px`,
    ['--plot-h-mobile' as string]: `${mobileHeight}px`,
  } as React.CSSProperties;

  if (error) {
    return (
      <div className={styles.wrap} style={cssVars} role="alert">
        <div className={styles.message}>Could not load plot: {error}</div>
      </div>
    );
  }

  if (!figure || !layout) {
    return (
      <div className={styles.wrap} style={cssVars} aria-busy="true" aria-label={`Loading ${ariaLabel}`}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  return (
    <div className={styles.wrap} style={cssVars}>
      <Suspense fallback={<div className={styles.skeleton} aria-busy="true" />}>
        <Plot
          data={figure.data}
          layout={layout}
          config={baseConfig}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          aria-label={ariaLabel}
        />
      </Suspense>
      {!activated && (
        <button
          type="button"
          className={styles.scrim}
          onClick={() => setActivated(true)}
          aria-label={`Activate interactive controls for ${ariaLabel}`}
        >
          <span className={styles.scrimLabel}>Tap to interact</span>
        </button>
      )}
    </div>
  );
};

export default PlotlyEmbed;
