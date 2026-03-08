import { useMemo } from 'react';

export default function SparklineChart({ data, color = 'var(--accent-cyan)', height = 50 }) {
  const svgContent = useMemo(() => {
    if (!data || data.length < 2) return null;

    const width = 200;
    const padding = 2;
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;

    const points = data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (val - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;
    const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;

    return { linePath, areaPath, gradientId, width };
  }, [data, height]);

  if (!svgContent) {
    return <div style={{ height, background: 'var(--bg-secondary)', borderRadius: 8 }} />;
  }

  return (
    <svg
      viewBox={`0 0 ${svgContent.width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={svgContent.gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={svgContent.areaPath} fill={`url(#${svgContent.gradientId})`} />
      <path d={svgContent.linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
