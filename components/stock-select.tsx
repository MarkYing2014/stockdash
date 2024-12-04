"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const commonStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "DIS", name: "The Walt Disney Co." },
  { symbol: "NFLX", name: "Netflix Inc." }
].sort((a, b) => a.symbol.localeCompare(b.symbol))

export function StockSelect({ onValueChange }: { onValueChange: (value: string) => void }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a stock" />
      </SelectTrigger>
      <SelectContent>
        {commonStocks.map((stock) => (
          <SelectItem key={stock.symbol} value={stock.symbol}>
            {stock.symbol} - {stock.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 