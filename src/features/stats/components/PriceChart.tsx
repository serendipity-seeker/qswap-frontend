import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineStyle } from "lightweight-charts";
import { TrendingUp } from "lucide-react";

const PriceChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState("24H");
  const timeframes = ["1H", "24H", "7D", "30D", "1Y"];

  // Generate mock candlestick data
  const generateData = () => {
    const data = [];
    let basePrice = 0.145;
    const now = Math.floor(Date.now() / 1000);
    const interval = 3600; // 1 hour in seconds

    for (let i = 0; i < 24; i++) {
      const time = now - (24 - i) * interval;
      const volatility = 0.002;
      const change = (Math.random() - 0.5) * volatility;
      basePrice = Math.max(0.14, basePrice + change);
      
      data.push({
        time: time,
        value: basePrice,
      });
    }

    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9e9e9e",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 256,
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: "#1adef5",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#1adef5",
        },
        horzLine: {
          color: "#1adef5",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#1adef5",
        },
      },
    });

    // Create area series - use addSeries with type specification for v5
    const areaSeries = chart.addSeries({
      type: 'Area',
      lineColor: "#1adef5",
      topColor: "rgba(26, 222, 245, 0.4)",
      bottomColor: "rgba(26, 222, 245, 0.0)",
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    } as any);

    // Set data
    const data = generateData();
    chart.setData(data);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [timeframe]);

  return (
    <div className="glass-effect rounded-xl p-4 shadow-2xl sm:p-5">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-lg font-bold sm:text-xl">QCAP/QUBIC</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl font-bold sm:text-2xl">$0.152</span>
            <span className="text-success-40 flex items-center gap-1 text-sm font-medium">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              +12.5%
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-lg px-2 py-1 text-xs font-medium transition-all sm:px-3 sm:py-1.5 sm:text-sm ${
                timeframe === tf ? "bg-primary text-white" : "bg-muted/50 hover:bg-muted"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* TradingView Lightweight Chart */}
      <div 
        ref={chartContainerRef} 
        className="bg-muted/20 relative rounded-xl overflow-hidden"
        style={{ height: "256px" }}
      />

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">24h High</div>
          <div className="text-success-40 text-sm font-bold sm:text-base">$0.158</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">24h Low</div>
          <div className="text-error-40 text-sm font-bold sm:text-base">$0.145</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-[10px] sm:text-xs">24h Volume</div>
          <div className="text-sm font-bold sm:text-base">$1.2M</div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
