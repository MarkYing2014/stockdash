import yfinance as yf
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TICKERS = ["HII", "GD", "TXT", "LDOS", "KTOS", "MRCY", "CW", "HEI", "RCAT", "PLTR"]

@app.get("/api/stocks")
async def get_stocks():
    stock_data = []
    
    for ticker in TICKERS:
        stock = yf.Ticker(ticker)
        info = stock.info
        history = stock.history(period="1d")
        
        stock_data.append({
            "symbol": ticker,
            "name": info.get("longName", ""),
            "lastPrice": history["Close"][-1],
            "previousPrice": info.get("previousClose", 0),
            "change": history["Close"][-1] - info.get("previousClose", 0),
            "changePct": ((history["Close"][-1] - info.get("previousClose", 0)) / info.get("previousClose", 0)) * 100,
            "volume": info.get("volume", 0),
            "volumeAvg": info.get("averageVolume", 0),
            "marketCap": info.get("marketCap", 0),
            "peRatio": info.get("forwardPE", 0),
            "eps": info.get("forwardEps", 0)
        })
    
    return stock_data

@app.get("/api/stock/{ticker}/history")
async def get_stock_history(ticker: str):
    stock = yf.Ticker(ticker)
    history = stock.history(period="1mo")
    
    return {
        "dates": history.index.strftime('%Y-%m-%d').tolist(),
        "prices": history["Close"].tolist(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

