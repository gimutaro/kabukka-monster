'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Stock, EventCard, BattleResult, BattleStock, Turn, GamePhase, ArenaAnim, Commentary } from '@/lib/types'
import { STOCKS } from '@/lib/data'
import { shuffle, simulateBattle } from '@/lib/game'
import { generateBattleCommentary } from '@/lib/commentary'
import Ticker from './Ticker'
import Header from './Header'
import TitleScreen from './TitleScreen'
import DeckSelectScreen from './DeckSelectScreen'
import LoadingScreen from './LoadingScreen'
import BattleScreen from './BattleScreen'
import ResultScreen from './ResultScreen'

async function fetchRealPrices(): Promise<Record<string, number>> {
  const res = await fetch('/api/prices')
  if (!res.ok) return {}
  return res.json()
}

function applyRealPrices(stocks: readonly Stock[], prices: Record<string, number>): Stock[] {
  return stocks.map(s => {
    const realPrice = prices[String(s.id)]
    if (realPrice) return { ...s, price: realPrice }
    return { ...s }
  })
}

export default function StockBattle() {
  const [phase, setPhase] = useState<GamePhase>('title')
  const [liveStocks, setLiveStocks] = useState<Stock[]>([...STOCKS])
  const [pricesLoaded, setPricesLoaded] = useState(false)
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null)
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [recap, setRecap] = useState('')
  const [visibleTurns, setVisibleTurns] = useState<Turn[]>([])
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0)
  const [currentPStocks, setCurrentPStocks] = useState<BattleStock[]>([])
  const [currentCStocks, setCurrentCStocks] = useState<BattleStock[]>([])
  const [arenaAnim, setArenaAnim] = useState<ArenaAnim>({ attacker: null, sell: null, event: false })
  const [eventOverlay, setEventOverlay] = useState<{ card: EventCard; actor: 'player' | 'cpu' } | null>(null)
  const [currentComment, setCurrentComment] = useState('')
  const menuBgmRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('/audio/menu-bgm.mp3')
    audio.loop = true
    audio.volume = 0.4
    menuBgmRef.current = audio
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    const audio = menuBgmRef.current
    if (!audio) return
    if (phase === 'title' || phase === 'select') {
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [phase])

  useEffect(() => {
    fetchRealPrices().then(prices => {
      if (Object.keys(prices).length > 0) {
        setLiveStocks(applyRealPrices(STOCKS, prices))
      }
      setPricesLoaded(true)
    }).catch(() => {
      setPricesLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (phase !== 'battle' || !battleResult) return
    if (currentTurnIdx >= battleResult.turns.length) {
      const timer = setTimeout(() => setPhase('result'), 2000)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => {
      const t = battleResult.turns[currentTurnIdx]
      setCurrentComment(t.comment || '')

      if (t.type === 'event') {
        const se = new Audio('/audio/event-se.mp3')
        se.volume = 0.6
        se.play().catch(() => {})
        setEventOverlay({ card: t.card!, actor: t.actor })
        setArenaAnim({ attacker: null, sell: null, event: true })
        setTimeout(() => setEventOverlay(null), 2800)
        setTimeout(() => setArenaAnim({ attacker: null, sell: null, event: false }), 2800)
      } else {
        setArenaAnim({ attacker: null, sell: { actor: t.actor, stockId: t.stock!.id }, event: false })
        setTimeout(() => setArenaAnim({ attacker: null, sell: null, event: false }), 800)
      }

      setTimeout(() => {
        setVisibleTurns(prev => [...prev, t])
        setCurrentPStocks([...t.pStocks])
        setCurrentCStocks([...t.cStocks])
        setCurrentTurnIdx(i => i + 1)
      }, 500)
    }, currentTurnIdx === 0 ? 1200 : 3200)
    return () => clearTimeout(timer)
  }, [phase, currentTurnIdx, battleResult])

  const toggleStock = useCallback((stock: Stock) => {
    setSelectedStocks(prev => {
      if (prev.find(s => s.id === stock.id)) return prev.filter(s => s.id !== stock.id)
      if (prev.length >= 3) return prev
      return [...prev, stock]
    })
  }, [])

  const startBattle = useCallback(async () => {
    if (selectedStocks.length !== 3 || !selectedEvent) return
    setPhase('loading')

    const cpuDeck = shuffle(liveStocks.filter(s => !selectedStocks.find(p => p.id === s.id))).slice(0, 3)
    const result = simulateBattle(selectedStocks, cpuDeck, selectedEvent)

    let commentary: Commentary = { turns: result.turns.map(t => ({ turn: t.turn, comment: '' })), final: '' }
    try {
      commentary = await generateBattleCommentary(result)
    } catch {
      commentary = {
        turns: result.turns.map(t => ({ turn: t.turn, comment: '' })),
        final: 'An intense battle unfolded today. Both strategies clashed head-on, keeping everyone on the edge of their seats until the very end.',
      }
    }

    const enrichedTurns = result.turns.map(t => ({
      ...t,
      comment: (commentary.turns.find(c => c.turn === t.turn) || { comment: '' }).comment,
    }))
    const enrichedResult: BattleResult = { ...result, turns: enrichedTurns }

    setBattleResult(enrichedResult)
    setRecap(commentary.final)
    setVisibleTurns([])
    setCurrentTurnIdx(0)
    setCurrentPStocks(selectedStocks.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 })))
    setCurrentCStocks(cpuDeck.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 })))
    setPhase('battle')
  }, [selectedStocks, selectedEvent, liveStocks])

  const reset = useCallback(() => {
    setSelectedStocks([])
    setSelectedEvent(null)
    setBattleResult(null)
    setRecap('')
    setVisibleTurns([])
    setCurrentTurnIdx(0)
    setPhase('title')
  }, [])

  const pCurrent = battleResult
    ? battleResult.turns.slice(0, currentTurnIdx).filter(t => t.type === 'sell' && t.actor === 'player').reduce((sum, t) => sum + (t.profit ?? 0), 0)
    : 0
  const cCurrent = battleResult
    ? battleResult.turns.slice(0, currentTurnIdx).filter(t => t.type === 'sell' && t.actor === 'cpu').reduce((sum, t) => sum + (t.profit ?? 0), 0)
    : 0

  return (
    <div className="sb-root">
      <div className="sb-inner">
        <Ticker />
        <Header />

        {phase === 'title' && (
          <TitleScreen onStart={() => setPhase('select')} />
        )}

        {phase === 'select' && (
          <DeckSelectScreen
            stocks={liveStocks}
            pricesLoaded={pricesLoaded}
            selectedStocks={selectedStocks}
            selectedEvent={selectedEvent}
            onToggleStock={toggleStock}
            onSelectEvent={setSelectedEvent}
            onStartBattle={startBattle}
          />
        )}

        {phase === 'loading' && <LoadingScreen />}

        {phase === 'battle' && battleResult && (
          <BattleScreen
            battleResult={battleResult}
            visibleTurns={visibleTurns}
            currentPStocks={currentPStocks}
            currentCStocks={currentCStocks}
            arenaAnim={arenaAnim}
            eventOverlay={eventOverlay}
            currentComment={currentComment}
            pCurrent={pCurrent}
            cCurrent={cCurrent}
          />
        )}

        {phase === 'result' && battleResult && (
          <ResultScreen
            battleResult={battleResult}
            recap={recap}
            onReset={reset}
          />
        )}
      </div>
    </div>
  )
}
