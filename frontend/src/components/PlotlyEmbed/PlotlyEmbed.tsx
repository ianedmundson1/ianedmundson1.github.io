import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import type { Layout, Config } from 'plotly.js';
import { useTheme } from '@/context/ThemeContext';
import { usePlotlyFigure, type Figure } from '@/api/plots';
import { PLOTLY_THEME_TOKENS } from '@/theme/plotlyTokens';
import styles from './PlotlyEmbed.module.css';

const loadPlot = async () => {
  const [{ default: createPlotlyComponent }, plotlyMod] = await Promise.all([
    import('react-plotly.js/factory'),
    import('plotly.js-dist-min'),
  ]);
  return createPlotlyComponent(plotlyMod.default);
};
// Only attach a Sentry span if the SDK is already on the page. The deferred
// init in sentry.ts may not have run yet; pulling @sentry/react here purely
// to record a span would inflate the critical path.
const loadPlotWithSentry = async () => {
  const sentryReady =
    typeof window !== 'undefined' &&
    (window as unknown as { __SENTRY__?: unknown }).__SENTRY__ !== undefined;
  if (!sentryReady) return loadPlot(); 
  const Sentry = await import('@sentry/react').catch(() => null);
  if (!Sentry) return loadPlot();
  return Sentry.startSpan(
    { name: 'plotly.lazy-import', op: 'resource.script', forceTransaction: true },
    loadPlot,
  );
};

const Plot = lazy(async () => ({ default: await loadPlotWithSentry() }));

const FILL: React.CSSProperties = { width: '100%', height: '100%' };

type Poster = string | { light: string; dark: string };

type CommonProps = {
  ariaLabel: string;
  height?: number;
  mobileHeight?: number;
  poster?: Poster;
};

const resolvePoster = (poster: Poster | undefined, theme: 'light' | 'dark') => {
  if (!poster) return null;
  return typeof poster === 'string' ? poster : poster[theme];
};

type PlotlyEmbedProps = CommonProps &
  ({ src: string; figure?: never } | { figure: Figure; src?: never });

const baseConfig: Partial<Config> = {
  displaylogo: false,
  displayModeBar: false,
  responsive: true,
};

const themedLayout = (
  layout: Partial<Layout>,
  theme: 'light' | 'dark',
): Partial<Layout> => {
  const t = PLOTLY_THEME_TOKENS[theme];
  const axisOverrides = {
    backgroundcolor: 'rgba(0,0,0,0)',
    gridcolor: t.grid,
    linecolor: t.line,
    zerolinecolor: t.line,
    color: t.fontColor,
    showbackground: false,
  };
  const scene = layout.scene as Record<string, unknown> | undefined;
  const sceneAxis = (key: 'xaxis' | 'yaxis' | 'zaxis'): Record<string, unknown> => {
    const v = scene?.[key];
    return typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : {};
  };
  return {
    ...layout,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { ...(layout.font ?? {}), color: t.fontColor },
    scene: {
      ...(scene ?? {}),
      xaxis: { ...sceneAxis('xaxis'), ...axisOverrides },
      yaxis: { ...sceneAxis('yaxis'), ...axisOverrides },
      zaxis: { ...sceneAxis('zaxis'), ...axisOverrides },
    },
  };
};

const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;


const PlotlyEmbed = ({
  src,
  figure: providedFigure,
  ariaLabel,
  height = 600,
  mobileHeight = 360,
  poster,
}: PlotlyEmbedProps) => {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Coarse-pointer (touch) devices wait for an explicit tap before fetching the
  // figure JSON or loading the Plotly bundle. Desktop activates immediately.
  const [activated, setActivated] = useState(() => !isCoarsePointer());

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const shouldFetch = !providedFigure && inView && activated;
  const query = usePlotlyFigure(shouldFetch ? src ?? null : null);
  const source = providedFigure ?? query.data ?? null;
  const errorMessage = providedFigure ? null : query.error?.message ?? null;

  // react-plotly.js mutates the data and layout objects it is handed in response
  // to user interaction (documented upstream). Hand it a private copy so
  // rotating a scene does not write back into the react-query cache entry.
  const figure = useMemo(() => (source ? structuredClone(source) : null), [source]);
  
  const layout = useMemo(
    () => (figure ? themedLayout(figure.layout, theme) : null),
    [figure, theme],
  );

  const cssVars = {
    ['--plot-h' as string]: `${height}px`,
    ['--plot-h-mobile' as string]: `${mobileHeight}px`,
  } as React.CSSProperties;

  const posterSrc = resolvePoster(poster, theme);
  const placeholder = posterSrc ? (
    <img
      src={posterSrc}
      alt=""
      className={styles.poster}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  ) : (
    <div className={styles.skeleton} />
  );

  const plot =
    activated && inView && figure && layout ? (
      <Suspense fallback={placeholder}>
        <Plot data={figure.data} layout={layout} config={baseConfig} style={FILL} />
      </Suspense>
    ) : null;

  return (
    <div
      ref={wrapperRef}
      className={styles.wrap}
      style={cssVars}
      role="group"
      aria-label={ariaLabel}
      aria-busy={activated && !errorMessage && !plot ? true : undefined}
    >
      {errorMessage ? (
        <div className={styles.message} role="alert">
          Could not load plot: {errorMessage}
        </div>
      ) : (
        plot ?? (
          <>
            {placeholder}
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
          </>
        )
      )}
    </div>
  );
};

export default PlotlyEmbed;
