import json
import sys
import yfinance as yf

TICKERS = {
    "4478.T": 1,   # Freee
    "3994.T": 2,   # MoneyForward
    "6526.T": 3,   # Socionext
    "9166.T": 4,   # GENDA
    "4480.T": 5,   # Medley
    "4483.T": 6,   # JMDC
    "4435.T": 7,   # Kaonavi
    "4180.T": 8,   # Appier
    "4375.T": 9,   # Safie
    "4442.T": 10,  # VALTES
}

result = {}
for symbol, stock_id in TICKERS.items():
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5d")
        if not hist.empty:
            close = hist["Close"].iloc[-1]
            result[str(stock_id)] = int(round(float(close)))
    except Exception:
        pass

print(json.dumps(result))
