'use client'

import type { BattleResult } from '@/lib/types'

interface ResultScreenProps {
  readonly battleResult: BattleResult
  readonly recap: string
  readonly onReset: () => void
}

export default function ResultScreen({ battleResult, recap, onReset }: ResultScreenProps) {
  return (
    <div className="result-screen">
      <div className="result-verdict">
        <div className="verdict-eyebrow">BATTLE RESULT</div>
        <div className={`verdict-title ${battleResult.winner === 'player' ? 'verdict-win' : battleResult.winner === 'cpu' ? 'verdict-lose' : 'verdict-draw'}`}>
          {battleResult.winner === 'player' ? 'YOU WIN' : battleResult.winner === 'cpu' ? 'YOU LOSE' : 'DRAW'}
        </div>
      </div>

      <div className="result-scores">
        {[
          { label: 'PLAYER', stocks: battleResult.pFinal, total: battleResult.pTotal, win: battleResult.winner === 'player' },
          { label: 'CPU', stocks: battleResult.cFinal, total: battleResult.cTotal, win: battleResult.winner === 'cpu' },
        ].map(side => (
          <div key={side.label} className={`rs-card${side.win ? ' winner' : ''}`}>
            <div className="rs-label">{side.label}</div>
            {side.stocks.map(s => (
              <div key={s.id} className="rs-row">
                <span>{s.name}</span>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 13,
                  color: s.profit >= 0 ? 'var(--green)' : 'var(--red)'
                }}>
                  {s.profit >= 0 ? '+' : ''}{s.profit.toLocaleString()}円
                </span>
              </div>
            ))}
            <div className="rs-total">
              <span>合計損益</span>
              <span className="rs-profit" style={{ color: side.total >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {side.total >= 0 ? '+' : ''}{side.total.toLocaleString()}円
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="recap-box">
        <div className="recap-header">
          <div className="recap-dot" />
          <div className="recap-eyebrow">AI LIVE COMMENTARY</div>
        </div>
        {recap
          ? <p className="recap-text">{recap}</p>
          : <p className="recap-loading">実況テキストを読み込み中...</p>
        }
      </div>

      <button className="btn-retry" onClick={onReset}>もう一度バトル</button>
    </div>
  )
}
