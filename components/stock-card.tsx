"use client"

interface StockCardProps {
  symbol?: string
  name?: string
  price?: number | null
  change?: number | null
  changePercent?: number | null
}

export function StockCard({ symbol, name, price, change, changePercent }: StockCardProps) {
  const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return 'N/A'
    }
    return Number(value).toFixed(decimals)
  }

  const isPositiveChange = (change ?? 0) >= 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{symbol || 'N/A'}</h2>
          {name && <p className="text-gray-600">{name}</p>}
          <p className="text-4xl font-bold mt-2">
            ${formatNumber(price)}
          </p>
        </div>
        <div className={`text-right ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
          <p className="text-lg font-semibold">
            {isPositiveChange ? '+' : ''}{formatNumber(change)}
          </p>
          <p className="text-sm">
            ({isPositiveChange ? '+' : ''}{formatNumber(changePercent)}%)
          </p>
        </div>
      </div>
    </div>
  )
}

