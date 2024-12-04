"use client"

interface StockData {
  date: string
  open: number | string | null
  high: number | string | null
  low: number | string | null
  close: number | string | null
  value: number | string | null
}

interface PeriodMetricsProps {
  data: StockData[]
}

export function PeriodMetrics({ data }: PeriodMetricsProps) {
  const formatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  const calculateMetrics = () => {
    if (!data || data.length === 0) return null;

    // Convert and validate close prices
    const validPrices = data
      .map(item => Number(item.close))
      .filter(price => !isNaN(price));

    if (validPrices.length === 0) return null;

    const latestPrice = validPrices[validPrices.length - 1];
    const oldestPrice = validPrices[0];

    // Calculate period change
    const absoluteChange = latestPrice - oldestPrice;
    const percentageChange = ((absoluteChange / oldestPrice) * 100);

    // Calculate high and low from valid numbers only
    const validHighs = data
      .map(item => Number(item.high))
      .filter(price => !isNaN(price));
    const validLows = data
      .map(item => Number(item.low))
      .filter(price => !isNaN(price));

    const high = Math.max(...validHighs);
    const low = Math.min(...validLows);

    // Calculate average closing price
    const average = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;

    return {
      change: absoluteChange,
      percentChange: percentageChange,
      high: high,
      low: low,
      average: average
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">No data available</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Period Change</h3>
        <p className={`mt-1 text-lg font-semibold ${Number(metrics.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${formatNumber(metrics.change)} ({formatNumber(metrics.percentChange)}%)
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Period High</h3>
        <p className="mt-1 text-lg font-semibold">${formatNumber(metrics.high)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Period Low</h3>
        <p className="mt-1 text-lg font-semibold">${formatNumber(metrics.low)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Period Average</h3>
        <p className="mt-1 text-lg font-semibold">${formatNumber(metrics.average)}</p>
      </div>
    </div>
  );
}

