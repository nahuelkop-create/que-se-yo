import { useEffect, useRef, useMemo, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';
import { calcSMA } from '../utils/analysis';

export default function CandlestickChart({ data, period, height = 300 }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [ohlcInfo, setOhlcInfo] = useState(null);

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

  // Check if we have volume data
  const hasVolume = useMemo(() => {
    return data?.some(d => d.volume && d.volume > 0);
  }, [data]);

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chartHeight = hasVolume ? height + 80 : height;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: chartHeight,
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
        scaleMargins: hasVolume
          ? { top: 0.05, bottom: 0.25 }
          : { top: 0.1, bottom: 0.1 },
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

    // Volume histogram (below the candles)
    if (hasVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      // Configure volume price scale
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
        borderVisible: false,
      });

      const volumeData = data
        .filter(d => d.volume && d.volume > 0)
        .map(d => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open
            ? 'rgba(16, 185, 129, 0.35)'
            : 'rgba(239, 68, 68, 0.35)',
        }));

      volumeSeries.setData(volumeData);
    }

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

    // Crosshair move handler for OHLC info
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time) {
        setOhlcInfo(null);
        return;
      }

      const candle = param.seriesData?.get(candleSeries);
      if (candle) {
        // Format the time/date for display
        let dateStr;
        if (typeof param.time === 'number') {
          // Unix timestamp
          const d = new Date(param.time * 1000);
          dateStr = d.toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });
        } else if (typeof param.time === 'string') {
          const d = new Date(param.time + 'T12:00:00');
          dateStr = d.toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
          });
        } else {
          dateStr = `${param.time.day}/${param.time.month}/${param.time.year}`;
        }

        // Find the original data point for volume
        const originalPoint = data.find(d => {
          if (typeof d.time === typeof param.time) return d.time === param.time;
          return String(d.time) === String(param.time);
        });

        setOhlcInfo({
          date: dateStr,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: originalPoint?.volume || null,
          isUp: candle.close >= candle.open,
        });
      } else {
        setOhlcInfo(null);
      }
    });

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
  }, [data, period, height, smaData, hasVolume]);

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

  /**
   * Format price for display
   */
  const fmtPrice = (v) => {
    if (v >= 1000) return `$${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (v >= 1) return `$${v.toFixed(2)}`;
    return `$${v.toFixed(4)}`;
  };

  const fmtVol = (v) => {
    if (!v) return null;
    if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
    return v.toFixed(0);
  };

  return (
    <div className="candlestick-wrapper">
      {/* OHLC Info bar */}
      {ohlcInfo && (
        <div className="ohlc-bar">
          <span className="ohlc-date">{ohlcInfo.date}</span>
          <span className="ohlc-item">
            <span className="ohlc-label">O</span>
            <span className={ohlcInfo.isUp ? 'price-up' : 'price-down'}>{fmtPrice(ohlcInfo.open)}</span>
          </span>
          <span className="ohlc-item">
            <span className="ohlc-label">H</span>
            <span className="price-up">{fmtPrice(ohlcInfo.high)}</span>
          </span>
          <span className="ohlc-item">
            <span className="ohlc-label">L</span>
            <span className="price-down">{fmtPrice(ohlcInfo.low)}</span>
          </span>
          <span className="ohlc-item">
            <span className="ohlc-label">C</span>
            <span className={ohlcInfo.isUp ? 'price-up' : 'price-down'}>{fmtPrice(ohlcInfo.close)}</span>
          </span>
          {ohlcInfo.volume && (
            <span className="ohlc-item">
              <span className="ohlc-label">Vol</span>
              <span style={{ color: 'var(--text-secondary)' }}>{fmtVol(ohlcInfo.volume)}</span>
            </span>
          )}
        </div>
      )}

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
        {hasVolume && (
          <span className="legend-item">
            <span className="legend-dot" style={{ background: 'rgba(100, 116, 139, 0.5)', width: 10, height: 6, borderRadius: 2 }} /> Volumen
          </span>
        )}
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

        .ohlc-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.62rem;
          font-family: 'Inter', monospace;
          min-height: 28px;
        }

        .ohlc-date {
          color: var(--text-muted);
          font-weight: 500;
          margin-right: 4px;
        }

        .ohlc-item {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .ohlc-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.58rem;
          text-transform: uppercase;
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
