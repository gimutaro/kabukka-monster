'use client'

interface TitleScreenProps {
  readonly onStart: () => void
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-eyebrow">KABUKKA MONSTER</div>
      <h1 className="title-h1">KABUKKA MONSTER</h1>
      <p className="title-sub">Raise your stocks. Conquer the market.</p>
      <button className="btn-start" onClick={onStart}>Build Your Deck</button>
    </div>
  )
}
