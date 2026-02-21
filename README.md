# KABUKKA MONSTER

**Raise your stocks. Conquer the market.**

A stock battle game powered by real market data and AI. Build a deck from real Japanese growth stocks, play event cards to shift the market, and watch AI narrate every move live.

---

## Features

- **Real-time stock prices** -- Fetched from Yahoo Finance via yfinance. Every session uses today's actual market prices
- **AI live commentary** -- Gemini 2.0 Flash generates unique turn-by-turn play-by-play and post-battle analysis for every match
- **Deck building** -- Pick 3 stocks from 10 real companies across 6 sectors (SaaS, Semiconductor, Gaming, Healthcare, AI/IT, IT)
- **Event cards** -- 5 market events (Bullish / Bearish / Neutral) that shift stock prices by sector
- **YouTube Live-style UI** -- Battle arena on the left, live chat commentary feed on the right. Profit/loss bars grow from characters after each sell

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Gemini API key

### Setup

```bash
# Install Node dependencies
npm install

# Create Python virtual environment and install yfinance
python3 -m venv .venv
source .venv/bin/activate
pip install yfinance

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

### Run

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for AI commentary |

Create a `.env.local` file in the project root. This file is gitignored and will not be pushed to remote repositories.

---

## How It Works

```
Browser (React)
  |
  +-- /api/prices ---- Python (yfinance) ----> Yahoo Finance
  |
  +-- /api/commentary ---- Gemini 2.0 Flash API
```

- **Stock prices**: A Next.js API route executes a Python script that fetches live prices from Yahoo Finance. Falls back to default prices if unavailable
- **AI commentary**: Battle results are sent to Gemini 2.0 Flash, which returns context-aware commentary in JSON. Falls back to generic text if the API is unreachable
- **API security**: All external API calls happen server-side. No keys are exposed to the client

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| AI | Google Gemini 2.0 Flash |
| Market Data | yfinance (Yahoo Finance) |
| Validation | Zod |
