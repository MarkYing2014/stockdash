import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 300 }) // Cache for 5 minutes

// Suppress notices (correct spelling)
yahooFinance.suppressNotices(['yahooSurvey'])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
  }

  // Check if data is in cache
  const cachedData = cache.get(`info-${symbol}`)
  if (cachedData) {
    return NextResponse.json(cachedData)
  }

  try {
    const quote = await yahooFinance.quote(symbol)
    
    if (!quote) {
      throw new Error('No quote data available')
    }

    const stockInfo = {
      symbol: quote.symbol || symbol,
      name: quote.longName || quote.shortName || symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      open: quote.regularMarketOpen || 0,
      dayHigh: quote.regularMarketDayHigh || 0,
      dayLow: quote.regularMarketDayLow || 0,
      volume: quote.regularMarketVolume || 0,
    }

    // Store data in cache
    cache.set(`info-${symbol}`, stockInfo)

    return NextResponse.json(stockInfo)
  } catch (error) {
    console.error('Error fetching stock info:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error fetching stock info' 
    }, { status: 500 })
  }
} 