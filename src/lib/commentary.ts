import type { BattleResult, Commentary, Turn } from './types'

function buildPrompt(result: BattleResult): string {
  const { turns, pTotal, cTotal, playerEvent, cpuEvent } = result
  const winnerLabel = result.winner === 'player' ? 'プレイヤー' : result.winner === 'cpu' ? 'CPU' : '引き分け'

  const turnSummary = turns.map(t =>
    t.type === 'event'
      ? `ターン${t.turn}(${t.actor === 'player' ? 'プレイヤー' : 'CPU'}): イベント「${t.card?.name}」発動`
      : `ターン${t.turn}(${t.actor === 'player' ? 'プレイヤー' : 'CPU'}): ${t.stock?.name}を${t.sellPrice?.toLocaleString()}円で売却 損益${(t.profit ?? 0) >= 0 ? '+' : ''}${t.profit}円`
  ).join('\n')

  return `あなたは日本の株式市場の熱血実況アナウンサーです。以下のバトルデータを元に、各ターンの実況コメントと最終総括をJSON形式で生成してください。

【バトルデータ】
プレイヤーのイベント：${playerEvent.name}（${playerEvent.headline}）
CPUのイベント：${cpuEvent.name}（${cpuEvent.headline}）
${turnSummary}
プレイヤー合計損益：${pTotal >= 0 ? '+' : ''}${pTotal}円
CPU合計損益：${cTotal >= 0 ? '+' : ''}${cTotal}円
勝者：${winnerLabel}

以下のJSONのみを返してください（前置き不要、コードブロック不要）:
{
  "turns": [
    {"turn": 1, "comment": "ターン1の臨場感ある実況（30〜50字）"},
    ...全ターン分
  ],
  "final": "最終総括（勝者宣言を含む100字程度の熱い締めくくり）"
}`
}

function fallbackCommentary(turns: readonly Turn[]): Commentary {
  return {
    turns: turns.map(t => ({ turn: t.turn, comment: '' })),
    final: '激しいバトルが展開された。両者の戦略が激突し、最後まで目が離せない展開となった。',
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
