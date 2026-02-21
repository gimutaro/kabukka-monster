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

const MAX_BAR_PX = 100
const PROFIT_SCALE = 8

function barHeight(profit: number): number {
  return Math.min(Math.abs(profit) / PROFIT_SCALE, MAX_BAR_PX)
}

function renderTeam(
  stocks: readonly BattleStock[],
  side: 'player' | 'cpu',
  arenaAnim: ArenaAnim,
) {
  return stocks.map(s => {
    const isActive = !s.sold && !stocks.slice(0, stocks.indexOf(s)).some(x => !x.sold)
    const isSelling = arenaAnim.sell?.actor === side && arenaAnim.sell?.stockId === s.id
    const profit = s.currentPrice - s.price
    const szPx = isActive ? 120 : 80
    const showBar = s.sold && !isSelling
    const height = barHeight(profit)

    return (
      <div key={s.id} className={[
        'char-unit',
        side === 'cpu' ? 'side-right-unit' : '',
        isActive ? 'cu-active' : '',
        s.sold && !isSelling ? 'cu-sold' : '',
        isSelling ? 'cu-selling' : '',
        arenaAnim.event && !s.sold ? 'cu-event' : '',
      ].filter(Boolean).join(' ')} style={{ position: 'relative' }}>
        <div className="cu-bar-area cu-bar-up">
          {showBar && profit > 0 && (
            <>
              <div className="cu-bar-label" style={{ color: 'var(--green)' }}>
                +{profit.toLocaleString()}
              </div>
              <div
                className="cu-bar cu-bar-profit"
                style={{ height }}
              />
            </>
          )}
        </div>

        <div className="cu-svg">
          <CharacterSVG
            image={s.image}
            name={s.name}
            flip={side === 'cpu'}
            size={szPx}
          />
        </div>
        <div className={`cu-name${isActive ? ' cu-active-label' : s.sold ? ' cu-sold-label' : ''}`}>
          {s.name}
        </div>

        <div className="cu-bar-area cu-bar-down">
          {showBar && profit < 0 && (
            <>
              <div
                className="cu-bar cu-bar-loss"
                style={{ height }}
              />
              <div className="cu-bar-label" style={{ color: 'var(--red)' }}>
                {profit.toLocaleString()}
              </div>
            </>
          )}
        </div>

        {isSelling && (
          <div className="cu-profit-burst" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {profit >= 0 ? '+' : ''}{profit.toLocaleString()} JPY
          </div>
        )}
      </div>
    )
  })
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
  const chatRef = useRef<HTMLDivElement>(null)
  const bgmRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = bgmRef.current
    if (!audio) return
    audio.volume = 0.5
    audio.play().catch(() => {})
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleTurns])

  return (
    <div className="battle-screen">
      <audio ref={bgmRef} src="/audio/battle-bgm.mp3" loop preload="auto" />
      {eventOverlay && (
        <div className="event-overlay">
          <div className="event-overlay-card">
            <div className="eoc-inner">
              <div className="eoc-eyebrow">EVENT CARD ACTIVATED</div>
              <div className="eoc-name">{eventOverlay.card.name}</div>
              <div className="eoc-divider"/>
              <div className="eoc-headline">{eventOverlay.card.headline}</div>
              <div className="eoc-actor" style={{ color: eventOverlay.actor === 'player' ? 'var(--green)' : 'var(--red)' }}>
                {eventOverlay.actor === 'player' ? 'PLAYER' : 'CPU'} activated
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="yt-layout">
        <div className="yt-main">
          <div className="yt-video-area">
            <div className="profit-race">
              <div className="race-bar-player">
                <span className="race-label" style={{ color: pCurrent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {pCurrent >= 0 ? '+' : ''}{pCurrent.toLocaleString()} JPY
                </span>
              </div>
              <div className="race-center">PROFIT RACE</div>
              <div className="race-bar-cpu">
                <span className="race-label" style={{ color: cCurrent >= 0 ? 'var(--red)' : 'var(--green)' }}>
                  {cCurrent >= 0 ? '+' : ''}{cCurrent.toLocaleString()} JPY
                </span>
              </div>
            </div>

            <div className="char-arena">
              <div className="ca-glow-l"/>
              <div className="ca-glow-r"/>

              <div className="char-team side-left">
                {renderTeam(currentPStocks, 'player', arenaAnim)}
              </div>

              <div className="char-center-col">
                <div className="char-turn-badge">TURN</div>
                <div className="char-turn-badge" style={{ fontSize: 32, color: 'var(--dim)' }}>
                  {visibleTurns.length + 1}
                </div>
                <div className="char-center-label">OF 8</div>
              </div>

              <div className="char-team side-right">
                {renderTeam(currentCStocks, 'cpu', arenaAnim)}
              </div>
            </div>

            <div className="yt-video-bar">
              <div className="yt-live-dot"/>
              <span className="yt-live-label">LIVE</span>
              <span className="yt-video-title">KABUKKA MONSTER -- Stock Battle</span>
            </div>
          </div>
        </div>

        <div className="yt-chat">
          <div className="yt-chat-header">
            <div className="yt-chat-header-dot"/>
            <span>LIVE COMMENTARY</span>
          </div>
          <div className="yt-chat-feed" ref={chatRef}>
            {visibleTurns.length === 0 && (
              <div className="yt-chat-waiting">
                Waiting for battle to start...
              </div>
            )}
            {visibleTurns.map((t, i) => {
              const isEvent = t.type === 'event'
              return (
                <div key={i} className={`yt-chat-msg ${t.actor}${isEvent ? ' event' : ''}`}>
                  <div className={`yt-chat-avatar ${t.actor}`}>
                    {isEvent ? 'EV' : t.actor === 'player' ? 'P' : 'C'}
                  </div>
                  <div className="yt-chat-body">
                    <div className="yt-chat-meta">
                      <span className={`yt-chat-author ${t.actor}`}>
                        {t.actor === 'player' ? 'PLAYER' : 'CPU'}{isEvent ? ' -- EVENT' : ''}
                      </span>
                      <span className="yt-chat-turn">T{t.turn}</span>
                    </div>
                    <div className="yt-chat-text">{t.action}</div>
                    {!isEvent && (
                      <div className="yt-chat-profit" style={{ color: (t.profit ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {(t.profit ?? 0) >= 0 ? '+' : ''}{(t.profit ?? 0).toLocaleString()} JPY
                      </div>
                    )}
                    {t.comment && (
                      <div className="yt-chat-comment">{t.comment}</div>
                    )}
                  </div>
                </div>
              )
            })}
            {currentComment && visibleTurns.length === 0 && (
              <div className="yt-chat-msg commentator">
                <div className="yt-chat-avatar commentator">AI</div>
                <div className="yt-chat-body">
                  <div className="yt-chat-meta">
                    <span className="yt-chat-author commentator">COMMENTATOR</span>
                  </div>
                  <div className="yt-chat-comment">{currentComment}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
