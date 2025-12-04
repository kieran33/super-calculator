"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";

export const description = "An area chart with gradient fill";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export function ChartAreaGradient() {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold" }}>
        Area Chart - Gradient
      </h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Showing total visitors for the last 6 months
      </p>

      <AreaChart
        width={600}
        height={300}
        data={chartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <Tooltip />

        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>

          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="mobile"
          type="natural"
          fill="url(#fillMobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>

      <div style={{ marginTop: 20, fontSize: 14 }}>
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Trending up by 5.2% this month <TrendingUp size={16} />
        </div>
        <div style={{ color: "#777" }}>January - June 2024</div>
      </div>
    </div>
  );
}
export default ChartAreaGradient;
