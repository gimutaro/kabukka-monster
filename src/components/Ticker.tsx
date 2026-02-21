'use client'

import { STOCKS } from '@/lib/data'

export default function Ticker() {
  const tickerItems = [...STOCKS, ...STOCKS]

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {tickerItems.map((s, i) => {
          const up = (s.id + i) % 3 !== 0
          const pct = ((s.id * 7 + i * 3) % 41 / 10).toFixed(1)
          return (
            <span key={`${s.id}-${i}`} className="ticker-item">
              {s.ticker}
              <span className={up ? 'ticker-up' : 'ticker-dn'}>
                {up ? '\u25B2' : '\u25BC'}{pct}%
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
