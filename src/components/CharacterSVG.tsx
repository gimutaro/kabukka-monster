'use client'

import type { Sector } from '@/lib/types'

interface CharacterSVGProps {
  readonly sector: Sector
  readonly flip?: boolean
  readonly size?: number
}

export default function CharacterSVG({ sector, flip = false, size = 120 }: CharacterSVGProps) {
  const scale = size / 120
  const transform = flip ? `scale(${scale}) translate(120,0) scale(-1,1)` : `scale(${scale})`

  const characters: Record<string, React.ReactNode> = {
    'SaaS': (
      <g>
        <ellipse cx="60" cy="48" rx="28" ry="20" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1.5"/>
        <ellipse cx="44" cy="54" rx="12" ry="9" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <ellipse cx="76" cy="54" rx="12" ry="9" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <ellipse cx="60" cy="58" rx="22" ry="16" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1.5"/>
        <rect x="44" y="66" width="32" height="36" rx="6" fill="#0d1929" stroke="#00e5a0" strokeWidth="1.5"/>
        <rect x="50" y="73" width="8" height="6" rx="2" fill="#00e5a0"/>
        <rect x="62" y="73" width="8" height="6" rx="2" fill="#00e5a0"/>
        <rect x="50" y="86" width="20" height="3" rx="1" fill="#00e5a0" opacity=".6"/>
        <rect x="46" y="104" width="28" height="24" rx="4" fill="#0d1929" stroke="#00e5a0" strokeWidth="1.5"/>
        <rect x="52" y="109" width="16" height="9" rx="2" fill="#00e5a0" opacity=".2"/>
        <circle cx="57" cy="113" r="2" fill="#00e5a0"/>
        <circle cx="63" cy="113" r="2" fill="#00e5a0"/>
        <rect x="28" y="106" width="16" height="8" rx="4" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <rect x="76" y="106" width="16" height="8" rx="4" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <rect x="48" y="128" width="10" height="12" rx="3" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <rect x="62" y="128" width="10" height="12" rx="3" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
      </g>
    ),
    '半導体': (
      <g>
        <rect x="34" y="30" width="52" height="52" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="2"/>
        <rect x="40" y="36" width="40" height="40" rx="2" fill="#0d0d1a" stroke="#f5c542" strokeWidth="1"/>
        <rect x="46" y="44" width="12" height="10" rx="2" fill="#f5c542"/>
        <rect x="62" y="44" width="12" height="10" rx="2" fill="#f5c542"/>
        <rect x="50" y="62" width="20" height="3" rx="1" fill="#f5c542" opacity=".7"/>
        <rect x="46" y="22" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="56" y="22" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="66" y="22" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="46" y="80" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="56" y="80" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="66" y="80" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="22" y="42" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="22" y="52" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="22" y="62" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="88" y="42" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="88" y="52" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="88" y="62" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="36" y="92" width="48" height="32" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1.5"/>
        <rect x="20" y="94" width="14" height="8" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
        <rect x="86" y="94" width="14" height="8" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
        <rect x="44" y="124" width="10" height="12" rx="3" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
        <rect x="66" y="124" width="10" height="12" rx="3" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
      </g>
    ),
    'ゲーム': (
      <g>
        <ellipse cx="60" cy="55" rx="36" ry="26" fill="#16213e" stroke="#9b59b6" strokeWidth="2"/>
        <ellipse cx="60" cy="55" rx="30" ry="20" fill="#0d1929" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="34" y="50" width="6" height="10" rx="1" fill="#9b59b6"/>
        <rect x="30" y="54" width="14" height="6" rx="1" fill="#9b59b6"/>
        <circle cx="76" cy="52" r="3" fill="#e74c3c"/>
        <circle cx="82" cy="56" r="3" fill="#f5c542"/>
        <circle cx="76" cy="60" r="3" fill="#2ecc71"/>
        <circle cx="70" cy="56" r="3" fill="#3498db"/>
        <rect x="52" y="48" width="16" height="10" rx="2" fill="#0a0a1a" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="54" y="50" width="5" height="6" rx="1" fill="#9b59b6" opacity=".8"/>
        <rect x="61" y="50" width="5" height="6" rx="1" fill="#9b59b6" opacity=".8"/>
        <rect x="36" y="82" width="48" height="34" rx="6" fill="#16213e" stroke="#9b59b6" strokeWidth="1.5"/>
        <circle cx="60" cy="99" r="8" fill="#0d1929" stroke="#9b59b6" strokeWidth="1"/>
        <circle cx="60" cy="99" r="4" fill="#9b59b6" opacity=".6"/>
        <rect x="20" y="84" width="14" height="8" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="86" y="84" width="14" height="8" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="42" y="116" width="12" height="14" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="66" y="116" width="12" height="14" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
      </g>
    ),
    'ヘルスケア': (
      <g>
        <ellipse cx="60" cy="50" rx="26" ry="26" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="2"/>
        <rect x="55" y="36" width="10" height="28" rx="2" fill="#2ecc71"/>
        <rect x="47" y="44" width="26" height="10" rx="2" fill="#2ecc71"/>
        <circle cx="52" cy="48" r="4" fill="#0d1929" stroke="#2ecc71" strokeWidth="1"/>
        <circle cx="68" cy="48" r="4" fill="#0d1929" stroke="#2ecc71" strokeWidth="1"/>
        <circle cx="52" cy="48" r="2" fill="#2ecc71"/>
        <circle cx="68" cy="48" r="2" fill="#2ecc71"/>
        <rect x="38" y="78" width="44" height="38" rx="6" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1.5"/>
        <rect x="46" y="85" width="28" height="12" rx="2" fill="#0d1929" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="50" y="88" width="8" height="6" rx="1" fill="#2ecc71"/>
        <rect x="62" y="88" width="8" height="6" rx="1" fill="#2ecc71" opacity=".5"/>
        <circle cx="60" cy="108" r="4" fill="#2ecc71" opacity=".3"/>
        <rect x="22" y="80" width="14" height="8" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="84" y="80" width="14" height="8" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="44" y="116" width="10" height="14" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="66" y="116" width="10" height="14" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
      </g>
    ),
    'AI/IT': (
      <g>
        <ellipse cx="60" cy="46" rx="30" ry="28" fill="#1a1a3e" stroke="#3498db" strokeWidth="2"/>
        <path d="M40 40 Q50 32 60 40 Q70 32 80 40" stroke="#3498db" strokeWidth="1.5" fill="none" opacity=".6"/>
        <path d="M34 52 Q44 46 54 52" stroke="#3498db" strokeWidth="1.5" fill="none" opacity=".6"/>
        <path d="M66 52 Q76 46 86 52" stroke="#3498db" strokeWidth="1.5" fill="none" opacity=".6"/>
        <circle cx="50" cy="48" r="7" fill="#0a0a2a" stroke="#3498db" strokeWidth="1.5"/>
        <circle cx="70" cy="48" r="7" fill="#0a0a2a" stroke="#3498db" strokeWidth="1.5"/>
        <circle cx="50" cy="48" r="3" fill="#3498db"/>
        <circle cx="70" cy="48" r="3" fill="#3498db"/>
        <circle cx="52" cy="46" r="1" fill="white"/>
        <circle cx="72" cy="46" r="1" fill="white"/>
        <path d="M50 62 Q60 68 70 62" stroke="#3498db" strokeWidth="1.5" fill="none"/>
        <rect x="36" y="76" width="48" height="36" rx="6" fill="#1a1a3e" stroke="#3498db" strokeWidth="1.5"/>
        <line x1="44" y1="86" x2="76" y2="86" stroke="#3498db" strokeWidth="1" opacity=".5"/>
        <line x1="44" y1="94" x2="60" y2="94" stroke="#3498db" strokeWidth="1" opacity=".5"/>
        <line x1="60" y1="94" x2="60" y2="102" stroke="#3498db" strokeWidth="1" opacity=".5"/>
        <circle cx="60" cy="94" r="2" fill="#3498db"/>
        <circle cx="44" cy="86" r="2" fill="#3498db"/>
        <circle cx="76" cy="86" r="2" fill="#3498db"/>
        <rect x="20" y="78" width="14" height="8" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
        <rect x="86" y="78" width="14" height="8" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
        <rect x="42" y="112" width="12" height="14" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
        <rect x="66" y="112" width="12" height="14" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
      </g>
    ),
    'IT': (
      <g>
        <rect x="24" y="28" width="72" height="54" rx="6" fill="#0a1628" stroke="#e67e22" strokeWidth="2"/>
        <rect x="28" y="32" width="64" height="46" rx="3" fill="#050d1a"/>
        <text x="34" y="46" fontFamily="monospace" fontSize="7" fill="#e67e22" opacity=".9">{'>'} init()</text>
        <text x="34" y="56" fontFamily="monospace" fontSize="7" fill="#2ecc71" opacity=".8">OK: loaded</text>
        <text x="34" y="66" fontFamily="monospace" fontSize="7" fill="#e67e22">{'>'} battle_</text>
        <rect x="64" y="61" width="1" height="7" fill="#e67e22">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="52" y="82" width="16" height="10" rx="2" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1"/>
        <rect x="32" y="92" width="56" height="8" rx="3" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1.5"/>
        <path d="M24 50 Q12 50 10 64 Q10 80 24 80" stroke="#e67e22" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="10" cy="72" r="5" fill="#e67e22" opacity=".5"/>
        <path d="M96 50 Q108 50 110 64 Q110 80 96 80" stroke="#e67e22" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="110" cy="72" r="5" fill="#e67e22" opacity=".5"/>
        <rect x="36" y="100" width="12" height="14" rx="4" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1"/>
        <rect x="72" y="100" width="12" height="14" rx="4" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1"/>
      </g>
    ),
  }

  const char = characters[sector] || characters['IT']
  return (
    <svg
      width={size}
      height={Math.round(size * 1.17)}
      viewBox="0 0 120 140"
      style={{ overflow: 'visible' }}
    >
      <g transform={transform}>
        {char}
      </g>
    </svg>
  )
}
