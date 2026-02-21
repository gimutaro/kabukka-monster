'use client'

import { useRef, useEffect } from 'react'
import type { BattleResult, BattleStock, Turn, ArenaAnim, EventCard } from '@/lib/types'
import CharacterSVG from './CharacterSVG'

interface BattleScreenProps {
  readonly battleResult: BattleResult
  readonly visibleTurns: readonly Turn[]
  readonly currentPStocks: readonly BattleStock[]
  readonly currentCStocks: readonly BattleStock[]
  readonly arenaAnim: ArenaAnim
  readonly eventOverlay: { readonly card: EventCard; readonly actor: 'player' | 'cpu' } | null
  readonly currentComment: string
  readonly pCurrent: number
  readonly cCurrent: number
}

export default function BattleScreen({
  visibleTurns,
  currentPStocks,
  currentCStocks,
  arenaAnim,
  eventOverlay,
  currentComment,
  pCurrent,
  cCurrent,
}: BattleScreenProps) {
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0
  }, [visibleTurns])

  return (
    <div className="battle-screen">
      {eventOverlay && (
        <div className="event-overlay">
          <div className="event-overlay-card">
            <div className="eoc-inner">
              <div className="eoc-eyebrow">EVENT CARD ACTIVATED</div>
              <div className="eoc-name">{eventOverlay.card.name}</div>
              <div className="eoc-divider"/>
              <div className="eoc-headline">{eventOverlay.card.headline}</div>
              <div className="eoc-actor" style={{ color: eventOverlay.actor === 'player' ? 'var(--green)' : 'var(--red)' }}>
                {eventOverlay.actor === 'player' ? 'PLAYER' : 'CPU'} が発動
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="profit-race">
        <div className="race-bar-player">
          <span className="race-label" style={{ color: pCurrent >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {pCurrent >= 0 ? '+' : ''}{pCurrent.toLocaleString()}円
          </span>
        </div>
        <div className="race-center">PROFIT RACE</div>
        <div className="race-bar-cpu">
          <span className="race-label" style={{ color: cCurrent >= 0 ? 'var(--red)' : 'var(--green)' }}>
            {cCurrent >= 0 ? '+' : ''}{cCurrent.toLocaleString()}円
          </span>
        </div>
      </div>

      <div className="char-arena">
        <div className="ca-glow-l"/>
        <div className="ca-glow-r"/>

        <div className="char-team side-left">
          {currentPStocks.map(s => {
            const isActive = !s.sold && !currentPStocks.slice(0, currentPStocks.indexOf(s)).some(x => !x.sold)
            const isSelling = arenaAnim.sell?.actor === 'player' && arenaAnim.sell?.stockId === s.id
            const profit = s.currentPrice - s.price
            const szPx = isActive ? 86 : 58
            return (
              <div key={s.id} className={[
                'char-unit',
                isActive ? 'cu-active' : '',
                s.sold && !isSelling ? 'cu-sold' : '',
                isSelling ? 'cu-selling' : '',
                arenaAnim.event && !s.sold ? 'cu-event' : '',
              ].filter(Boolean).join(' ')} style={{ position: 'relative' }}>
                <div className="cu-svg">
                  <CharacterSVG sector={s.sector} size={szPx}/>
                </div>
                <div className={`cu-name${isActive ? ' cu-active-label' : s.sold ? ' cu-sold-label' : ''}`}>
                  {s.name}
                </div>
                {isSelling && (
                  <div className="cu-profit-burst" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {profit >= 0 ? '+' : ''}{profit.toLocaleString()}円
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="char-center-col">
          <div className="char-turn-badge">TURN</div>
          <div className="char-turn-badge" style={{ fontSize: 32, color: 'var(--dim)' }}>
            {visibleTurns.length + 1}
          </div>
          <div className="char-center-label">OF 8</div>
        </div>

        <div className="char-team side-right">
          {currentCStocks.map(s => {
            const isActive = !s.sold && !currentCStocks.slice(0, currentCStocks.indexOf(s)).some(x => !x.sold)
            const isSelling = arenaAnim.sell?.actor === 'cpu' && arenaAnim.sell?.stockId === s.id
            const profit = s.currentPrice - s.price
            const szPx = isActive ? 86 : 58
            return (
              <div key={s.id} className={[
                'char-unit',
                'side-right-unit',
                isActive ? 'cu-active' : '',
                s.sold && !isSelling ? 'cu-sold' : '',
                isSelling ? 'cu-selling' : '',
                arenaAnim.event && !s.sold ? 'cu-event' : '',
              ].filter(Boolean).join(' ')} style={{ position: 'relative' }}>
                <div className="cu-svg">
                  <CharacterSVG sector={s.sector} flip size={szPx}/>
                </div>
                <div className={`cu-name${isActive ? ' cu-active-label' : s.sold ? ' cu-sold-label' : ''}`}>
                  {s.name}
                </div>
                {isSelling && (
                  <div className="cu-profit-burst" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {profit >= 0 ? '+' : ''}{profit.toLocaleString()}円
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="commentary-bar">
        {currentComment ? (
          <>
            <div className="cb-label">COMMENTATOR</div>
            <div className="cb-text">{currentComment}</div>
          </>
        ) : (
          <div className="cb-label" style={{ opacity: .4, animation: 'pulse 1.5s infinite' }}>BATTLE STARTING...</div>
        )}
      </div>

      <div className="section-label">BATTLE LOG</div>
      <div className="turn-feed" ref={feedRef}>
        {visibleTurns.map((t, i) => {
          const isEvent = t.type === 'event'
          const cls = isEvent
            ? (t.actor === 'player' ? 'event-player' : 'event-cpu')
            : t.actor
          return (
            <div key={i} className={`turn-item ${cls}`}>
              <div className="ti-header">
                <span className="ti-actor" style={{ color: t.actor === 'player' ? 'var(--green)' : 'var(--red)' }}>
                  {t.actor === 'player' ? 'PLAYER' : 'CPU'}{isEvent ? ' -- EVENT' : ''}
                </span>
                <span className="ti-turn">TURN {t.turn}</span>
              </div>
              <div className="ti-action">{t.action}</div>
              {!isEvent && (
                <div className="ti-profit" style={{ color: (t.profit ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {(t.profit ?? 0) >= 0 ? '+' : ''}{(t.profit ?? 0).toLocaleString()}円
                </div>
              )}
            </div>
          )
        })}
        {visibleTurns.length === 0 && (
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)', animation: 'pulse 1s infinite' }}>
            -- バトル開始待機中 --
          </div>
        )}
      </div>
    </div>
  )
}
