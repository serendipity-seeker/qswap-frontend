import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const PriceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState("24H");
  const timeframes = ["1H", "24H", "7D", "30D", "1Y"];

  // Mock data points for the chart
  const dataPoints = [30, 35, 32, 45, 42, 50, 48, 55, 52, 58, 62, 60, 65, 70, 68, 75, 72, 78, 82, 80];

  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);

  // Chart size in px
  const width = 400;
  const height = 256;
  // NOTE: UI svg uses width="100%" and height="100%", which scales relatively, but for our point
  // calculations, we need px to generate proper SVG "points" attribute (not with %).

  // Get polyline points as "x,y x,y ..." in px, not using '%'
  const getPolylinePoints = (points: number[]) => {
    const stepX = width / (points.length - 1);
    return points
      .map((value, index) => {
        const x = index * stepX;
        // Flip y axis - lower values higher on SVG
        const y = ((maxValue - value) / (maxValue - minValue)) * height;
        return `${x},${y}`;
      })
      .join(" ");
  };

  // For area, we need to close the path: start at (0, height), draw data points, end at (width, height)
  const getPolygonPoints = (points: number[]) => {
    const stepX = width / (points.length - 1);
    let coord = points
      .map((value, index) => {
        const x = index * stepX;
        const y = ((maxValue - value) / (maxValue - minValue)) * height;
        return `${x},${y}`;
      })
      .join(" ");
    return `0,${height} ${coord} ${width},${height}`;
  };

  return (
    <div className="glass-effect rounded-2xl p-4 shadow-2xl sm:p-5 md:rounded-3xl md:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <div>
          <h2 className="mb-1 text-xl font-bold sm:text-2xl">QUBIC/USDT</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl font-bold sm:text-3xl">$0.152</span>
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
                timeframe === tf ? "bg-primary-40 text-white" : "bg-muted/50 hover:bg-muted"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Simple SVG Chart */}
      <div className="bg-muted/20 relative h-48 rounded-xl p-3 sm:h-56 sm:p-4 md:h-64">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={0}
              y1={((i * height) / 4).toFixed(2)}
              x2={width}
              y2={((i * height) / 4).toFixed(2)}
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
          ))}

          {/* Price line */}
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            points={getPolylinePoints(dataPoints)}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary-40)" />
              <stop offset="100%" stopColor="var(--primary-60)" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-40)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary-40)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under the line */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            points={getPolygonPoints(dataPoints)}
            fill="url(#areaGradient)"
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 md:mt-6">
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
