"use client"

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Rectangle,
  Legend,
} from 'recharts'

interface StockData {
  date: string
  open: number | string | null
  high: number | string | null
  low: number | string | null
  close: number | string | null
  value: number | string | null
}

interface StockChartProps {
  data: StockData[]
}

const CandlestickBar = (props: any) => {
  if (!props || !props.x || !props.y) return null;

  const { x, y, width, height, low, high, open, close, value } = props
  
  // Convert all values to numbers and validate
  const numOpen = Number(open)
  const numClose = Number(close)
  const numHigh = Number(high)
  const numLow = Number(low)

  // Check if any values are invalid
  if (isNaN(numOpen) || isNaN(numClose) || isNaN(numHigh) || isNaN(numLow)) {
    return null
  }

  const isGrowing = numClose > numOpen
  const candleWidth = width * 0.7
  const xCenter = x + (width - candleWidth) / 2

  return (
    <g>
      <line
        x1={xCenter + candleWidth / 2}
        y1={numLow}
        x2={xCenter + candleWidth / 2}
        y2={numHigh}
        stroke={isGrowing ? "#22c55e" : "#ef4444"}
        strokeWidth={1.5}
      />
      <Rectangle
        x={xCenter}
        y={isGrowing ? numClose : numOpen}
        width={candleWidth}
        height={Math.max(Math.abs(numOpen - numClose), 0.5)}
        fill={isGrowing ? "#22c55e" : "#ef4444"}
        fillOpacity={0.9}
        stroke={isGrowing ? "#22c55e" : "#ef4444"}
        strokeWidth={1}
      />
    </g>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length || !payload[0].payload) {
    return null;
  }

  const data = payload[0].payload;
  const formatValue = (val: any) => {
    if (val === null || val === undefined) return 'N/A';
    const num = Number(val);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  const priceChange = Number(data.close) - Number(data.open);
  const priceChangePercent = (priceChange / Number(data.open)) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white p-3 border rounded shadow">
      <p className="font-semibold mb-2">{new Date(data.date).toLocaleDateString()}</p>
      <div className="space-y-1">
        <p>Open: ${formatValue(data.open)}</p>
        <p>High: ${formatValue(data.high)}</p>
        <p>Low: ${formatValue(data.low)}</p>
        <p>Close: ${formatValue(data.close)}</p>
        <p className={`mt-2 pt-2 border-t ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          Change: {isPositive ? '+' : ''}{formatValue(priceChange)} ({isPositive ? '+' : ''}{formatValue(priceChangePercent)}%)
        </p>
      </div>
    </div>
  )
}

export function StockChart({ data }: StockChartProps) {
  // Validate and transform data
  const chartData = data
    .filter(item => {
      // Ensure all required values exist and are valid numbers
      const values = [item.open, item.high, item.low, item.close, item.value];
      return values.every(val => 
        val !== null && 
        val !== undefined && 
        !isNaN(Number(val))
      );
    })
    .map(item => ({
      date: item.date,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      value: Number(item.value)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!chartData.length) {
    return (
      <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow flex items-center justify-center">
        <p className="text-gray-500">No valid OHLC data available for this stock</p>
      </div>
    )
  }

  const allPrices = chartData.flatMap(item => [item.high, item.low])
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice
  const yAxisMin = minPrice - (priceRange * 0.05)
  const yAxisMax = maxPrice + (priceRange * 0.05)

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Stock Price Trends</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            interval="preserveStartEnd"
            padding={{ left: 0, right: 0 }}
          />
          <YAxis
            domain={[yAxisMin, yAxisMax]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            width={65}
            tickCount={8}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
          />
          <Bar
            dataKey="high"
            fill="transparent"
            shape={<CandlestickBar />}
            name="OHLC"
            barSize={25}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            dot={false}
            name="Price Trend"
            strokeWidth={1.5}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

