import { Server } from 'ws'
import { createServer } from 'http'
import axios from 'axios'

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY
const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB']

const server = createServer()
const wss = new Server({ server })

wss.on('connection', (ws) => {
  console.log('Client connected')

  const sendStockUpdates = async () => {
    for (const symbol of SYMBOLS) {
      try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol,
            apikey: ALPHA_VANTAGE_API_KEY
          }
        })

        const data = response.data['Global Quote']
        const stockData = {
          symbol: data['01. symbol'],
          price: parseFloat(data['05. price']),
          change: parseFloat(data['09. change']),
          changePercent: parseFloat(data['10. change percent'].replace('%', '')),
        }

        ws.send(JSON.stringify(stockData))
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error)
      }
    }
  }

  // Send initial stock data
  sendStockUpdates()

  // Update stock data every 5 minutes (Alpha Vantage free tier limit)
  const intervalId = setInterval(sendStockUpdates, 5 * 60 * 1000)

  ws.on('close', () => {
    console.log('Client disconnected')
    clearInterval(intervalId)
  })
})

export default server

