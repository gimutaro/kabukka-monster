import type { BattleResult, Commentary, Turn } from './types'

function buildPrompt(result: BattleResult): string {
  const { turns, pTotal, cTotal, playerEvent, cpuEvent } = result
  const winnerLabel = result.winner === 'player' ? 'Player' : result.winner === 'cpu' ? 'CPU' : 'Draw'

  const turnSummary = turns.map(t =>
    t.type === 'event'
      ? `Turn ${t.turn} (${t.actor === 'player' ? 'Player' : 'CPU'}): Event "${t.card?.name}" activated`
      : `Turn ${t.turn} (${t.actor === 'player' ? 'Player' : 'CPU'}): Sold ${t.stock?.name} at ${t.sellPrice?.toLocaleString()} JPY, P&L: ${(t.profit ?? 0) >= 0 ? '+' : ''}${t.profit} JPY`
  ).join('\n')

  return `You are an excited stock market battle commentator. Based on the battle data below, generate a play-by-play commentary for each turn and a final summary in JSON format. Write everything in English.

[Battle Data]
Player's Event: ${playerEvent.name} (${playerEvent.headline})
CPU's Event: ${cpuEvent.name} (${cpuEvent.headline})
${turnSummary}
Player Total P&L: ${pTotal >= 0 ? '+' : ''}${pTotal} JPY
CPU Total P&L: ${cTotal >= 0 ? '+' : ''}${cTotal} JPY
Winner: ${winnerLabel}

Return ONLY the following JSON (no preamble, no code blocks):
{
  "turns": [
    {"turn": 1, "comment": "Exciting commentary for turn 1 (20-40 words)"},
    ...for all turns
  ],
  "final": "Final summary declaring the winner (about 50 words, exciting closing)"
}`
}

function fallbackCommentary(turns: readonly Turn[]): Commentary {
  return {
    turns: turns.map(t => ({ turn: t.turn, comment: '' })),
    final: 'An intense battle unfolded today. Both strategies clashed head-on, keeping everyone on the edge of their seats until the very end.',
  }
}

export async function generateBattleCommentary(result: BattleResult): Promise<Commentary> {
  const prompt = buildPrompt(result)

  try {
    const res = await fetch('/api/commentary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    if (!res.ok) {
      return fallbackCommentary(result.turns)
    }

    const data = await res.json()
    const text: string = data.text || '{}'
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim()) as Commentary

    return parsed
  } catch {
    return fallbackCommentary(result.turns)
  }
}
