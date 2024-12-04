"use client"

import { useState, useEffect } from "react"
import { StockCard } from "./components/stock-card"
import { StockChart } from "./components/stock-chart"
import { PeriodMetrics } from "./components/period-metrics"
import { StocksTable } from "./components/stocks-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const [stocks, setStocks] = useState([])
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchStockData()
    fetchChartData(selectedStock)
    const interval = setInterval(fetchStockData, 5000)
    return () => clearInterval(interval)
  }, [selectedStock])

  const fetchStockData = async () => {
    const response = await fetch('http://localhost:8000/api/stocks')
    const data = await response.json()
    setStocks(data)
  }

  const fetchChartData = async (ticker) => {
    const response = await fetch(`http://localhost:8000/api/stock/${ticker}/history`)
    const data = await response.json()
    setChartData(data.dates.map((date, index) => ({
      date,
      price: data.prices[index],
      volume: data.volumes[index]
    })))
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      <h1 className="text-4xl font-bold text-red-500">Stocks Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            currentValue={stock.currentValue}
            changePercent={stock.changePercent}
            chartData={[/* This should be populated with actual data */]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a stock" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <StockChart data={chartData} />
        </div>
        <div>
          <PeriodMetrics
            lowestVolume={37425513}
            highestVolume={136682597}
            lowestPrice={165.00}
            highestPrice={195.18}
            averageVolume={61605709}
            marketCap={2547910200000}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 overflow-x-auto">
          <StocksTable data={stocks} />
        </div>
      </div>
    </div>
  )
}

