'use client'

import { useState, useEffect, useCallback } from 'react'
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

export default function StockBattle() {
  const [phase, setPhase] = useState<GamePhase>('title')
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
        setEventOverlay({ card: t.card!, actor: t.actor })
        setArenaAnim({ attacker: null, sell: null, event: true })
        setTimeout(() => setEventOverlay(null), 2800)
        setTimeout(() => setArenaAnim({ attacker: null, sell: null, event: false }), 2800)
      } else {
        setArenaAnim({ attacker: null, sell: { actor: t.actor, stockId: t.stock!.id }, event: false })
        setTimeout(() => setArenaAnim({ attacker: null, sell: null, event: false }), 800)
      }

      setTimeout(() => {
        setVisibleTurns(prev => [t, ...prev])
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

    const cpuDeck = shuffle(STOCKS.filter(s => !selectedStocks.find(p => p.id === s.id))).slice(0, 3)
    const result = simulateBattle(selectedStocks, cpuDeck, selectedEvent)

    let commentary: Commentary = { turns: result.turns.map(t => ({ turn: t.turn, comment: '' })), final: '' }
    try {
      commentary = await generateBattleCommentary(result)
    } catch {
      commentary = {
        turns: result.turns.map(t => ({ turn: t.turn, comment: '' })),
        final: '市場が激しく動いた今日のバトル。両者の戦略が激突し、最後まで目が離せない展開となった。',
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
  }, [selectedStocks, selectedEvent])

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
