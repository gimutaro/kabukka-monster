'use client'

import { useState } from 'react'
import { STOCKS, EVENT_CARDS } from '@/lib/data'
import type { Stock, EventCard } from '@/lib/types'

interface DeckSelectScreenProps {
  readonly selectedStocks: readonly Stock[]
  readonly selectedEvent: EventCard | null
  readonly onToggleStock: (stock: Stock) => void
  readonly onSelectEvent: (card: EventCard) => void
  readonly onStartBattle: () => void
}

export default function DeckSelectScreen({
  selectedStocks,
  selectedEvent,
  onToggleStock,
  onSelectEvent,
  onStartBattle,
}: DeckSelectScreenProps) {
  const [showStory, setShowStory] = useState(true)
  const [hoveredStockId, setHoveredStockId] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  return (
    <div className="deck-screen">
      {showStory && (
        <div className="story-overlay" onClick={() => setShowStory(false)}>
          <div className="story-modal" onClick={e => e.stopPropagation()}>
            <div className="story-eyebrow">STORY</div>
            <div className="story-body">
              <p>At a company dinner, your coworker &mdash; &quot;Soma Kanzaki&quot; &mdash; said with a smug grin:</p>
              <p className="story-quote">&quot;Wait, you&apos;re still just saving money? I already made more than my salary from stock trading.&quot;</p>
              <p>You went home and started investing in stocks.</p>
              <p>You&apos;ll out-earn him and make sure you never have to see that smug face again!</p>
            </div>
            <button className="story-close" onClick={() => setShowStory(false)}>Build Your Deck</button>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 32 }}>
        <div className="section-label">STEP 1 -- Pick 3 stocks ({selectedStocks.length}/3)</div>
        <div className="stock-grid">
          {STOCKS.map(s => (
            <div
              key={s.id}
              className={`stock-pick${selectedStocks.find(p => p.id === s.id) ? ' active' : ''}`}
              onClick={() => onToggleStock(s)}
              onMouseEnter={e => {
                const r = e.currentTarget.getBoundingClientRect()
                setHoveredStockId(s.id)
                setTooltipPos({ x: r.left + r.width / 2, y: r.top - 12 })
              }}
              onMouseLeave={() => setHoveredStockId(null)}
            >
              {selectedStocks.find(p => p.id === s.id) && (
                <div className="sp-check">{'\u2713'}</div>
              )}
              <div className="sp-ticker">{s.ticker}</div>
              <div className="sp-name">{s.name}</div>
              <div className="sp-sector">{s.sector}</div>
              <div className="sp-price">{s.price.toLocaleString()} JPY</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div className="section-label">STEP 2 -- Pick 1 event card</div>
        <div className="event-grid">
          {EVENT_CARDS.map(c => (
            <div
              key={c.id}
              className={`event-pick${selectedEvent?.id === c.id ? ' active' : ''}`}
              onClick={() => onSelectEvent(c)}
            >
              <div className={`ep-tag ${c.type}`}>
                {c.type === 'good' ? '\u25B2 BULLISH' : c.type === 'bad' ? '\u25BC BEARISH' : '\u25C6 NEUTRAL'}
              </div>
              <div className="ep-name">{c.name}</div>
              <div className="ep-desc">{c.headline}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-battle"
        disabled={selectedStocks.length !== 3 || !selectedEvent}
        onClick={onStartBattle}
      >
        START BATTLE
      </button>

      {hoveredStockId && (() => {
        const stock = STOCKS.find(s => s.id === hoveredStockId)
        if (!stock) return null
        return (
          <div
            className="tooltip-box visible"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translateX(-50%) translateY(-100%)',
            }}
          >
            {stock.desc}
          </div>
        )
      })()}
    </div>
  )
}
