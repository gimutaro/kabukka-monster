export type Sector = 'SaaS' | 'Semiconductor' | 'Gaming' | 'Healthcare' | 'AI/IT' | 'IT'

export type EventType = 'good' | 'bad' | 'neutral'

export interface Stock {
  readonly id: number
  readonly name: string
  readonly ticker: string
  readonly sector: Sector
  readonly price: number
  readonly desc: string
  readonly image: string
}

export interface EventCard {
  readonly id: number
  readonly name: string
  readonly headline: string
  readonly effect: Readonly<Partial<Record<Sector, number>>>
  readonly type: EventType
}

export interface BattleStock extends Stock {
  readonly currentPrice: number
  readonly sold: boolean
  readonly profit: number
}

export interface Turn {
  readonly turn: number
  readonly type: 'event' | 'sell'
  readonly actor: 'player' | 'cpu'
  readonly card?: EventCard
  readonly stock?: Stock
  readonly sellPrice?: number
  readonly profit?: number
  readonly pStocks: readonly BattleStock[]
  readonly cStocks: readonly BattleStock[]
  readonly action: string
  readonly comment?: string
}

export interface BattleResult {
  readonly turns: readonly Turn[]
  readonly pFinal: readonly BattleStock[]
  readonly cFinal: readonly BattleStock[]
  readonly pTotal: number
  readonly cTotal: number
  readonly winner: 'player' | 'cpu' | 'draw'
  readonly playerEvent: EventCard
  readonly cpuEvent: EventCard
}

export interface Commentary {
  readonly turns: readonly { readonly turn: number; readonly comment: string }[]
  readonly final: string
}

export type GamePhase = 'title' | 'select' | 'loading' | 'battle' | 'result'

export interface ArenaAnim {
  readonly attacker: null
  readonly sell: { readonly actor: 'player' | 'cpu'; readonly stockId: number } | null
  readonly event: boolean
}
