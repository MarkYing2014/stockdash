import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 3600 })

yahooFinance.suppressNotices(['yahooSurvey', 'ripHistorical'])

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      console.log('Symbol is required')
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
    }

    console.log(`Fetching data for symbol: ${symbol}`)

    const cachedData = cache.get(symbol)
    if (cachedData) {
      console.log('Returning cached data')
      return NextResponse.json(cachedData)
    }

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    console.log(`Fetching data from ${startDate.toISOString()} to ${endDate.toISOString()}`)

    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: '1d',
      includeAdjustedClose: true
    }

    const result = await yahooFinance.chart(symbol, queryOptions)
    
    if (!result || !result.quotes) {
      console.log('No result or quotes from Yahoo Finance')
      throw new Error('No data available from Yahoo Finance')
    }

    console.log(`Received ${result.quotes.length} quotes from Yahoo Finance`)

    if (result.quotes.length === 0) {
      console.log('Empty quotes array from Yahoo Finance')
      throw new Error('No historical data available')
    }

    const chartData = result.quotes
      .filter(quote => {
        const isValid = quote &&
               typeof quote.date === 'object' &&
               typeof quote.open === 'number' &&
               typeof quote.high === 'number' &&
               typeof quote.low === 'number' &&
               typeof quote.close === 'number'

        if (!isValid) {
          console.log('Invalid quote:', quote)
        }
        return isValid
      })
      .map(quote => {
        try {
          const close = quote.close
          const adjClose = quote.adjClose ?? quote.close
          const adjustmentRatio = adjClose / close

          const formatNumber = (num: number) => {
            const rounded = Number(num.toFixed(2))
            return rounded
          }

          return {
            date: new Date(quote.date).toISOString().split('T')[0],
            open: formatNumber(quote.open * adjustmentRatio),
            high: formatNumber(quote.high * adjustmentRatio),
            low: formatNumber(quote.low * adjustmentRatio),
            close: formatNumber(adjClose),
            value: formatNumber(adjClose)
          }
        } catch (error) {
          console.error('Error processing quote:', error)
          return null
        }
      })
      .filter(quote => quote !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (chartData.length === 0) {
      throw new Error('No valid data available after processing')
    }

    // Store data in cache
    cache.set(symbol, chartData)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error fetching stock history' 
    }, { status: 500 })
  }
}

