import { useEffect, useRef, useMemo } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { calcSMA } from '../utils/analysis';

export default function CandlestickChart({ data, period, height = 300 }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  // Compute SMA series from data
  const smaData = useMemo(() => {
    if (!data || data.length < 20) return { sma20: [], sma50: [] };

    const sma20 = [];
    const sma50 = [];

    for (let i = 0; i < data.length; i++) {
      if (i >= 19) {
        const slice = data.slice(0, i + 1);
        const val = calcSMA(slice, 20);
        if (val) sma20.push({ time: data[i].time, value: val });
      }
      if (i >= 49) {
        const slice = data.slice(0, i + 1);
        const val = calcSMA(slice, 50);
        if (val) sma50.push({ time: data[i].time, value: val });
      }
    }

    return { sma20, sma50 };
  }, [data]);

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      crosshair: {
        mode: 0, // Normal
        vertLine: {
          color: 'rgba(99, 102, 241, 0.4)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#6366f1',
        },
        horzLine: {
          color: 'rgba(99, 102, 241, 0.4)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#6366f1',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        timeVisible: period === '1D',
        secondsVisible: false,
        barSpacing: period === '1D' ? 6 : period === '1W' ? 8 : 10,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    chartRef.current = chart;

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candleSeries.setData(data);

    // SMA 20
    if (smaData.sma20.length > 0) {
      const sma20Series = chart.addSeries(LineSeries, {
        color: '#8b5cf6',
        lineWidth: 1.5,
        lineStyle: 2, // dashed
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      sma20Series.setData(smaData.sma20);
    }

    // SMA 50
    if (smaData.sma50.length > 0) {
      const sma50Series = chart.addSeries(LineSeries, {
        color: '#f59e0b',
        lineWidth: 1.5,
        lineStyle: 2,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      sma50Series.setData(smaData.sma50);
    }

    // Fit content
    chart.timeScale().fitContent();

    // Resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, period, height, smaData]);

  if (!data || data.length === 0) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}>
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="candlestick-wrapper">
      <div ref={containerRef} className="candlestick-container" />
      <div className="candle-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }} /> Alcista
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#ef4444' }} /> Bajista
        </span>
        <span className="legend-item">
          <span className="legend-line" style={{ borderColor: '#8b5cf6' }} /> SMA 20
        </span>
        <span className="legend-item">
          <span className="legend-line" style={{ borderColor: '#f59e0b' }} /> SMA 50
        </span>
      </div>

      <style>{`
        .candlestick-wrapper {
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
        }

        .candlestick-container {
          width: 100%;
        }

        .candle-legend {
          display: flex;
          justify-content: center;
          gap: 14px;
          padding: 8px 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .candle-legend .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .candle-legend .legend-line {
          width: 12px;
          height: 0;
          border-top: 2px dashed;
        }
      `}</style>
    </div>
  );
}
