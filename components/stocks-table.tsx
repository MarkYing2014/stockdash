"use client"

interface StockData {
  date: string
  open: number | string | null
  high: number | string | null
  low: number | string | null
  close: number | string | null
  value: number | string | null
}

interface StocksTableProps {
  data: StockData[]
}

export function StocksTable({ data }: StocksTableProps) {
  const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return 'N/A'
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return 'N/A'
    
    return numPrice.toFixed(2)
  }

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Open
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              High
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Low
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Close
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((stock, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(stock.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatPrice(stock.open)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatPrice(stock.high)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatPrice(stock.low)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatPrice(stock.close)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

