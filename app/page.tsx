"use client"

import { useState, useEffect } from "react"
import { StockSelect } from "@/components/stock-select"
import { StockCard } from "@/components/stock-card"
import { StockChart } from "@/components/stock-chart"
import { PeriodMetrics } from "@/components/period-metrics"
import { StocksTable } from "@/components/stocks-table"

interface StockInfo {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface StockHistoryData {
  date: string
  open: number
  high: number
  low: number
  close: number
  value: number
}

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState<string>("AAPL")
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [stockHistory, setStockHistory] = useState<StockHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStockData = async (symbol: string) => {
    if (!symbol) return;
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch stock info
      const infoResponse = await fetch(`/api/stock/info?symbol=${symbol}`)
      if (!infoResponse.ok) {
        throw new Error('Failed to fetch stock info')
      }
      const infoData = await infoResponse.json()
      if (infoData.error) {
        throw new Error(infoData.error)
      }
      setStockInfo(infoData)

      // Fetch stock history
      const historyResponse = await fetch(`/api/stock/history?symbol=${symbol}`)
      if (!historyResponse.ok) {
        throw new Error('Failed to fetch stock history')
      }
      const historyData = await historyResponse.json()
      if (historyData.error) {
        throw new Error(historyData.error)
      }
      
      // Validate history data
      if (!Array.isArray(historyData) || historyData.length === 0) {
        throw new Error('No historical data available')
      }
      
      setStockHistory(historyData)
    } catch (error) {
      console.error('Error fetching stock data:', error)
      setError(error instanceof Error ? error.message : 'Error fetching stock data')
      setStockHistory([])
      setStockInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData(selectedStock)
  }, [selectedStock])

  const handleStockChange = (value: string) => {
    if (value) {
      setSelectedStock(value)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <StockSelect onValueChange={handleStockChange} />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading stock data...</p>
          </div>
        ) : (
          <>
            {stockInfo && (
              <StockCard
                symbol={stockInfo.symbol}
                name={stockInfo.name}
                price={stockInfo.price}
                change={stockInfo.change}
                changePercent={stockInfo.changePercent}
              />
            )}

            {stockHistory.length > 0 && (
              <>
                <div className="space-y-6">
                  <StockChart data={stockHistory} />
                  <PeriodMetrics data={stockHistory} />
                  <StocksTable data={stockHistory} />
                </div>
              </>
            )}

            {!stockInfo && !error && (
              <div className="text-center py-4 text-gray-500">
                No stock data available
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

