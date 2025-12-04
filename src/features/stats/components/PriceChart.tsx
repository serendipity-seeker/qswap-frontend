import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const PriceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState("24H");
  const timeframes = ["1H", "24H", "7D", "30D", "1Y"];

  // Mock data points for the chart
  const dataPoints = [
    30, 35, 32, 45, 42, 50, 48, 55, 52, 58, 62, 60, 65, 70, 68, 75, 72, 78, 82, 80,
  ];

  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);

  return (
    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">QUBIC/USDT</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">$0.152</span>
            <span className="text-success-40 flex items-center gap-1 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf
                  ? "bg-primary-40 text-white"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Simple SVG Chart */}
      <div className="relative h-64 bg-muted/20 rounded-xl p-4">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={`${(i * 100) / 4}%`}
              x2="100%"
              y2={`${(i * 100) / 4}%`}
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
            points={dataPoints
              .map((value, index) => {
                const x = (index / (dataPoints.length - 1)) * 100;
                const y = ((maxValue - value) / (maxValue - minValue)) * 100;
                return `${x}%,${y}%`;
              })
              .join(" ")}
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
            points={`0%,100% ${dataPoints
              .map((value, index) => {
                const x = (index / (dataPoints.length - 1)) * 100;
                const y = ((maxValue - value) / (maxValue - minValue)) * 100;
                return `${x}%,${y}%`;
              })
              .join(" ")} 100%,100%`}
            fill="url(#areaGradient)"
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <div className="text-xs text-muted-foreground mb-1">24h High</div>
          <div className="font-bold text-success-40">$0.158</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">24h Low</div>
          <div className="font-bold text-error-40">$0.145</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
          <div className="font-bold">$1.2M</div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;

