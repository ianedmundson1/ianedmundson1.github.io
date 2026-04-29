import React from 'react';

interface SparklineProps {
  data: readonly number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  ariaLabel?: string;
  className?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 96,
  height = 24,
  strokeWidth = 1.5,
  fill = true,
  ariaLabel,
  className,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((value, i) => {
    const x = i * stepX;
    const y = height - ((value - min) / range) * (height - strokeWidth) - strokeWidth / 2;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');

  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {fill && <path d={areaPath} fill="currentColor" opacity={0.12} />}
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;