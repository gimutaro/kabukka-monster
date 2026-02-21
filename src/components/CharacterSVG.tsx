'use client'

import Image from 'next/image'

interface CharacterSVGProps {
  readonly image: string
  readonly name: string
  readonly flip?: boolean
  readonly size?: number
}

export default function CharacterSVG({ image, name, flip = false, size = 86 }: CharacterSVGProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        transform: flip ? 'scaleX(-1)' : undefined,
        flexShrink: 0,
      }}
    >
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </div>
  )
}
