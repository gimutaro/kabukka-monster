# KABUKKA MONSTER

**Raise your stocks. Conquer the market.**

A real-time stock battle game where players build decks from real Japanese growth stocks, play event cards, and let AI narrate the action live.

---

## What is it?

Pick 3 real stocks. Choose an event card. Battle the CPU. The twist: stock prices are pulled live from the market, and every battle is narrated in real-time by AI -- like a sports commentator calling a championship match.

---

## AI Integration

### 1. AI Live Commentary (Gemini 2.0 Flash)

Every battle generates unique, context-aware commentary. The AI receives the full battle data -- which stocks were sold, at what price, the profit/loss, and what event cards were played -- and produces:

- **Turn-by-turn commentary** (8 turns, 20-40 words each): reacting to sells, event impacts, and momentum shifts
- **Final recap** (~50 words): summarizing the battle outcome like a post-game analyst

The commentary is generated during the loading screen so the battle plays out seamlessly with narration synced to each turn.

### 2. Real-Time Stock Prices (yfinance API)

The game fetches live closing prices for all 10 stocks from Yahoo Finance via yfinance. When you pick Freee or Socionext, you're playing with today's actual market price -- not a hardcoded number. This means every session reflects real market conditions.

Stocks that can't be fetched gracefully fall back to default prices, so the game always works.

---

## Game Mechanics

- **Deck Building**: Choose 3 stocks from 10 real Japanese growth companies across 6 sectors (SaaS, Semiconductor, Gaming, Healthcare, AI/IT, IT)
- **Event Cards**: Pick 1 of 5 market event cards (Bullish / Bearish / Neutral). Events shift stock prices by sector -- "AI Demand Explosion" boosts SaaS +25%, while "Chip Shortage Crisis" tanks Semiconductors -22%
- **Battle Simulation**: 8-turn battle. Events fire first, then stocks are sold in optimal order. Winner is determined by total P&L
- **Strategy**: Align your stock sectors with your event card to maximize gains. The CPU gets a random event card -- can you outplay the market?

---

## UI / UX Highlights

- **YouTube Live-style layout**: Main battle arena on the left, live chat-style commentary feed on the right
- **Profit bar graphs**: After each stock is sold, a green bar (profit) or red bar (loss) grows from the character, visualizing performance at a glance
- **Real company images**: Each stock is represented by its actual company visual
- **LIVE indicator**: Shows when real-time market prices are active
- **Event card cinematics**: Full-screen overlay animation when event cards activate

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| AI | Google Gemini 2.0 Flash |
| Market Data | yfinance (Yahoo Finance) |
| API Security | Server-side API routes (keys never exposed to client) |
| Validation | Zod |

---

## Architecture

```
Browser (React)
  |
  +-- /api/prices ---- Python (yfinance) ----> Yahoo Finance
  |
  +-- /api/commentary ---- Gemini 2.0 Flash API
```

All API keys and external calls are handled server-side through Next.js API routes. The game works offline with fallback data -- AI commentary defaults to a generic summary, and stock prices fall back to stored values.

---

## Why KABUKKA MONSTER?

- **Real data meets real AI**: Not a demo with mock data. Live stock prices and generative AI commentary make every battle unique
- **Accessible strategy**: Simple pick-3-stocks mechanic, but sector/event synergy creates depth
- **Spectator-ready**: The YouTube Live layout and AI commentary make battles fun to watch, not just play
