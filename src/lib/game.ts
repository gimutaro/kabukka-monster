import type { Stock, EventCard, BattleStock, Turn, BattleResult } from './types'
import { EVENT_CARDS } from './data'

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function fmt(n: number): string {
  const sign = n >= 0 ? '+' : ''
  return sign + n.toLocaleString('en-US') + ' JPY'
}

export function applyEvent(stocks: readonly BattleStock[], eventCard: EventCard): BattleStock[] {
  return stocks.map(s => {
    const mult = eventCard.effect[s.sector] || 0
    if (mult === 0) return s
    return { ...s, currentPrice: Math.round(s.currentPrice * (1 + mult)) }
  })
}

export function hpColor(ratio: number): string {
  if (ratio > 0.6) return '#00e5a0'
  if (ratio > 0.3) return '#f5c542'
  return '#ff3d5a'
}

export function simulateBattle(
  playerDeck: readonly Stock[],
  cpuDeck: readonly Stock[],
  playerEvent: EventCard
): Omit<BattleResult, 'turns'> & { turns: Turn[] } {
  const turns: Turn[] = []

  let pStocks: BattleStock[] = playerDeck.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 }))
  let cStocks: BattleStock[] = cpuDeck.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 }))

  const cpuEvent = shuffle(EVENT_CARDS.filter(e => e.id !== playerEvent.id))[0]

  // Turn 1: Player event
  pStocks = applyEvent(pStocks, playerEvent)
  cStocks = applyEvent(cStocks, playerEvent)
  turns.push({
    turn: 1,
    type: 'event',
    actor: 'player',
    card: playerEvent,
    pStocks: pStocks.map(s => ({ ...s })),
    cStocks: cStocks.map(s => ({ ...s })),
    action: `[${playerEvent.name}] activated — ${playerEvent.headline}`,
  })

  // Turn 2: CPU event
  pStocks = applyEvent(pStocks, cpuEvent)
  cStocks = applyEvent(cStocks, cpuEvent)
  turns.push({
    turn: 2,
    type: 'event',
    actor: 'cpu',
    card: cpuEvent,
    pStocks: pStocks.map(s => ({ ...s })),
    cStocks: cStocks.map(s => ({ ...s })),
    action: `CPU [${cpuEvent.name}] activated — ${cpuEvent.headline}`,
  })

  // Turn 3+: Sell phase
  let turnNum = 3
  const pOrder = [...pStocks].sort((a, b) => (b.currentPrice - b.price) - (a.currentPrice - a.price))
  const cOrder = [...cStocks].sort((a, b) => (b.currentPrice - b.price) - (a.currentPrice - a.price))

  for (let i = 0; i < Math.max(pOrder.length, cOrder.length); i++) {
    if (pOrder[i]) {
      const s = pOrder[i]
      const profit = s.currentPrice - s.price
      pStocks = pStocks.map(st => st.id === s.id ? { ...st, sold: true, profit } : st)
      turns.push({
        turn: turnNum++,
        type: 'sell',
        actor: 'player',
        stock: s,
        sellPrice: s.currentPrice,
        profit,
        pStocks: pStocks.map(st => ({ ...st })),
        cStocks: cStocks.map(st => ({ ...st })),
        action: `Sold ${s.name} at ${s.currentPrice.toLocaleString()} JPY`,
      })
    }
    if (cOrder[i]) {
      const s = cOrder[i]
      const profit = s.currentPrice - s.price
      cStocks = cStocks.map(st => st.id === s.id ? { ...st, sold: true, profit } : st)
      turns.push({
        turn: turnNum++,
        type: 'sell',
        actor: 'cpu',
        stock: s,
        sellPrice: s.currentPrice,
        profit,
        pStocks: pStocks.map(st => ({ ...st })),
        cStocks: cStocks.map(st => ({ ...st })),
        action: `CPU sold ${s.name} at ${s.currentPrice.toLocaleString()} JPY`,
      })
    }
  }

  const pTotal = pStocks.reduce((sum, s) => sum + s.profit, 0)
  const cTotal = cStocks.reduce((sum, s) => sum + s.profit, 0)
  const winner = pTotal > cTotal ? 'player' as const : pTotal < cTotal ? 'cpu' as const : 'draw' as const

  return { turns, pFinal: pStocks, cFinal: cStocks, pTotal, cTotal, winner, playerEvent, cpuEvent }
}
