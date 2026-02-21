import { useState, useEffect, useRef } from "react";

// ── データ ──────────────────────────────────────────────────
const STOCKS = [
  { id: 1, name: 'フリー', ticker: '4478', sector: 'SaaS', price: 1450, desc: '中小企業向けクラウド会計・人事労務SaaS。国内シェアNo.1。バックオフィス業務のDXを推進し急成長中のプラットフォーム企業。' },
  { id: 2, name: 'マネーフォワード', ticker: '3994', sector: 'SaaS', price: 3180, desc: '個人向け家計簿アプリから法人向け経費精算・会計SaaSまで展開。FinTech×SaaSの代表格で累計ユーザー数1,200万超。' },
  { id: 3, name: 'ソシオネクスト', ticker: '6526', sector: '半導体', price: 2750, desc: '富士通・パナソニックのSoC部門が統合した半導体設計専門会社。自社工場を持たないファブレスモデルで高い利益率を誇る。' },
  { id: 4, name: 'GENDA', ticker: '9166', sector: 'ゲーム', price: 1230, desc: 'ゲームセンターなどアミューズメント施設をM&Aで急拡大するエンタメ企業。国内外のUFOキャッチャー市場をリードする。' },
  { id: 5, name: 'メドレー', ticker: '4480', sector: 'ヘルスケア', price: 2080, desc: 'オンライン診療・医療機関向けクラウド・医療人材紹介を展開する医療DX企業。病院のIT化を総合的に支援する。' },
  { id: 6, name: 'JMDC', ticker: '4483', sector: 'ヘルスケア', price: 2540, desc: '保険組合の健康・医療ビッグデータを分析・提供するヘルスケアデータ企業。製薬会社や保険会社に高付加価値の分析を提供。' },
  { id: 7, name: 'カオナビ', ticker: '4435', sector: 'SaaS', price: 890, desc: '顔写真で社員を一覧管理する人材マネジメントSaaS。タレントマネジメント市場に特化し大企業への導入実績が豊富。' },
  { id: 8, name: 'Appier', ticker: '4180', sector: 'AI/IT', price: 1670, desc: 'AIを使ったマーケティング自動化SaaSを提供する台湾発のAI企業。アジア太平洋地域で急成長中のデジタル広告テック。' },
  { id: 9, name: 'セーフィー', ticker: '4375', sector: 'AI/IT', price: 650, desc: 'クラウド録画型の映像管理プラットフォーム。店舗・工場の防犯カメラ映像をクラウドに集約しAI分析で業務改善を支援。' },
  { id: 10, name: 'バルテス', ticker: '4442', sector: 'IT', price: 780, desc: 'ソフトウェアのテスト・品質保証に特化したITサービス企業。DX推進に伴いシステム品質へのニーズが高まる中で安定成長。' },
];

const EVENT_CARDS = [
  { id: 1, name: '半導体不足深刻化', headline: 'メモリ価格高騰で半導体・IT銘柄が急落', effect: { '半導体': -0.22, 'IT': -0.12, 'AI/IT': -0.10 }, type: 'bad' },
  { id: 2, name: 'AI需要爆発', headline: '生成AI需要急増でSaaS・AI関連が急騰', effect: { 'SaaS': +0.25, 'AI/IT': +0.22 }, type: 'good' },
  { id: 3, name: '医療DX法案可決', headline: '医療DX推進法が国会で可決、ヘルスケア株急伸', effect: { 'ヘルスケア': +0.22 }, type: 'good' },
  { id: 4, name: '円安加速', headline: '1ドル160円突破。輸出恩恵・内需に逆風', effect: { '半導体': +0.15, 'SaaS': -0.08, 'ヘルスケア': -0.06 }, type: 'neutral' },
  { id: 5, name: 'スタートアップ増税', headline: 'グロース株増税議論が浮上、市場全体に売り圧力', effect: { 'SaaS': -0.15, 'AI/IT': -0.15, 'IT': -0.15, 'ゲーム': -0.12, 'ヘルスケア': -0.10 }, type: 'bad' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n) {
  const sign = n >= 0 ? '+' : '';
  return sign + n.toLocaleString('ja-JP') + '円';
}

function applyEvent(stocks, eventCard) {
  return stocks.map(s => {
    const mult = eventCard.effect[s.sector] || 0;
    if (mult === 0) return s;
    return { ...s, currentPrice: Math.round(s.currentPrice * (1 + mult)) };
  });
}

// ── 全バトル計算（開始時に一括） ──────────────────────────
function simulateBattle(playerDeck, cpuDeck, playerEvent) {
  const turns = [];

  let pStocks = playerDeck.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 }));
  let cStocks = cpuDeck.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 }));

  // CPU用イベントカード（ランダム1枚）
  const cpuEvent = shuffle(EVENT_CARDS.filter(e => e.id !== playerEvent.id))[0];

  // ターン1: プレイヤーのイベント発動
  pStocks = applyEvent(pStocks, playerEvent);
  cStocks = applyEvent(cStocks, playerEvent);
  turns.push({
    turn: 1,
    type: 'event',
    actor: 'player',
    card: playerEvent,
    pStocks: pStocks.map(s => ({ ...s })),
    cStocks: cStocks.map(s => ({ ...s })),
    action: `【${playerEvent.name}】発動 — ${playerEvent.headline}`,
  });

  // ターン2: CPUのイベント発動
  pStocks = applyEvent(pStocks, cpuEvent);
  cStocks = applyEvent(cStocks, cpuEvent);
  turns.push({
    turn: 2,
    type: 'event',
    actor: 'cpu',
    card: cpuEvent,
    pStocks: pStocks.map(s => ({ ...s })),
    cStocks: cStocks.map(s => ({ ...s })),
    action: `CPU【${cpuEvent.name}】発動 — ${cpuEvent.headline}`,
  });

  // ターン3〜: 売却フェーズ
  let turnNum = 3;
  const pOrder = [...pStocks].sort((a, b) => (b.currentPrice - b.price) - (a.currentPrice - a.price));
  const cOrder = [...cStocks].sort((a, b) => (b.currentPrice - b.price) - (a.currentPrice - a.price));

  for (let i = 0; i < Math.max(pOrder.length, cOrder.length); i++) {
    if (pOrder[i]) {
      const s = pOrder[i];
      const profit = s.currentPrice - s.price;
      pStocks = pStocks.map(st => st.id === s.id ? { ...st, sold: true, profit } : st);
      turns.push({
        turn: turnNum++,
        type: 'sell',
        actor: 'player',
        stock: s,
        sellPrice: s.currentPrice,
        profit,
        pStocks: pStocks.map(st => ({ ...st })),
        cStocks: cStocks.map(st => ({ ...st })),
        action: `${s.name}を${s.currentPrice.toLocaleString()}円で売却`,
      });
    }
    if (cOrder[i]) {
      const s = cOrder[i];
      const profit = s.currentPrice - s.price;
      cStocks = cStocks.map(st => st.id === s.id ? { ...st, sold: true, profit } : st);
      turns.push({
        turn: turnNum++,
        type: 'sell',
        actor: 'cpu',
        stock: s,
        sellPrice: s.currentPrice,
        profit,
        pStocks: pStocks.map(st => ({ ...st })),
        cStocks: cStocks.map(st => ({ ...st })),
        action: `CPU ${s.name}を${s.currentPrice.toLocaleString()}円で売却`,
      });
    }
  }

  const pTotal = pStocks.reduce((sum, s) => sum + s.profit, 0);
  const cTotal = cStocks.reduce((sum, s) => sum + s.profit, 0);
  const winner = pTotal > cTotal ? 'player' : pTotal < cTotal ? 'cpu' : 'draw';

  return { turns, pFinal: pStocks, cFinal: cStocks, pTotal, cTotal, winner, playerEvent, cpuEvent };
}

// ── AI実況生成 ────────────────────────────────────────────
async function generateBattleCommentary(result) {
  const { turns, pFinal, cFinal, pTotal, cTotal, winner, playerEvent, cpuEvent } = result;
  const winnerLabel = winner === 'player' ? 'プレイヤー' : winner === 'cpu' ? 'CPU' : '引き分け';

  const turnSummary = turns.map((t, i) =>
    t.type === 'event'
      ? `ターン${t.turn}(${t.actor === 'player' ? 'プレイヤー' : 'CPU'}): イベント「${t.card.name}」発動`
      : `ターン${t.turn}(${t.actor === 'player' ? 'プレイヤー' : 'CPU'}): ${t.stock.name}を${t.sellPrice.toLocaleString()}円で売却 損益${t.profit >= 0 ? '+' : ''}${t.profit}円`
  ).join('\n');

  const prompt = `あなたは日本の株式市場の熱血実況アナウンサーです。以下のバトルデータを元に、各ターンの実況コメントと最終総括をJSON形式で生成してください。

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
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return parsed;
  } catch(e) {
    // fallback
    return {
      turns: turns.map(t => ({ turn: t.turn, comment: '' })),
      final: '激しいバトルが展開された。両者の戦略が激突し、最後まで目が離せない展開となった。'
    };
  }
}

// ── スタイル ──────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #07080f;
    --surface: #0e1117;
    --border: #1c2232;
    --green: #00e5a0;
    --red: #ff3d5a;
    --yellow: #f5c542;
    --dim: #3a4560;
    --text: #d4daf0;
    --muted: #5a6480;
  }

  body { background: var(--bg); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 8px rgba(0,229,160,.15); }
    50%       { box-shadow: 0 0 22px rgba(0,229,160,.4); }
  }
  @keyframes blink { 50% { opacity: 0; } }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.4; }
  }

  .sb-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Noto Sans JP', sans-serif;
    color: var(--text);
    overflow-x: hidden;
  }

  /* GRID BG */
  .sb-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,229,160,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,160,.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .sb-inner { position: relative; z-index: 1; }

  /* TICKER */
  .ticker-wrap {
    overflow: hidden;
    background: #0a0d14;
    border-bottom: 1px solid var(--border);
    padding: 7px 0;
  }
  .ticker-track {
    display: flex;
    gap: 56px;
    white-space: nowrap;
    animation: ticker 30s linear infinite;
    width: max-content;
  }
  .ticker-item {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
  }
  .ticker-item span { margin-left: 6px; }
  .ticker-up { color: var(--green); }
  .ticker-dn { color: var(--red); }

  /* HEADER */
  .sb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    background: rgba(14,17,23,.8);
    backdrop-filter: blur(8px);
  }
  .sb-logo {
    font-family: 'Bebas Neue', cursive;
    font-size: 26px;
    letter-spacing: 3px;
    color: var(--green);
  }
  .sb-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 2px;
  }

  /* TITLE SCREEN */
  .title-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    padding: 40px 20px;
    animation: fadeUp .6s ease;
  }
  .title-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--green);
    margin-bottom: 16px;
    animation: pulse 2s infinite;
  }
  .title-h1 {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(64px, 10vw, 120px);
    letter-spacing: 4px;
    line-height: 1;
    background: linear-gradient(135deg, #fff 40%, var(--green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
  }
  .title-sub {
    font-size: 14px;
    color: var(--muted);
    letter-spacing: 3px;
    margin-bottom: 48px;
  }
  .btn-start {
    background: var(--green);
    color: #07080f;
    border: none;
    padding: 16px 52px;
    font-size: 16px;
    font-weight: 900;
    font-family: 'Noto Sans JP', sans-serif;
    letter-spacing: 2px;
    border-radius: 3px;
    cursor: pointer;
    transition: all .2s;
  }
  .btn-start:hover { transform: scale(1.04); box-shadow: 0 0 32px rgba(0,229,160,.4); }

  /* DECK SELECT */
  .deck-screen {
    max-width: 860px;
    margin: 0 auto;
    padding: 32px 20px;
    animation: fadeUp .5s ease;
  }
  .section-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--muted);
    margin-bottom: 14px;
    text-transform: uppercase;
  }
  .stock-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    margin-bottom: 32px;
  }
  .stock-pick {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px;
    cursor: pointer;
    transition: all .18s;
    position: relative;
    overflow: hidden;
  }
  .stock-pick::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,229,160,.04), transparent);
    opacity: 0;
    transition: opacity .2s;
  }
  .stock-pick:hover { border-color: var(--dim); transform: translateY(-2px); }
  .stock-pick:hover::after { opacity: 1; }
  .stock-pick.active {
    border-color: var(--green);
    animation: glow 2s infinite;
  }
  .stock-pick.active::after { opacity: 1; }
  .sp-ticker {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .sp-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .sp-sector {
    font-size: 10px;
    color: var(--muted);
    background: #13181f;
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    margin-bottom: 8px;
  }
  .sp-price {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }
  .sp-check {
    position: absolute;
    top: 10px; right: 10px;
    width: 18px; height: 18px;
    background: var(--green);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: #07080f; font-weight: 900;
  }

  /* TOOLTIP */
  .tooltip-box {
    position: fixed;
    width: 220px;
    background: #161d2e;
    border: 1px solid var(--green);
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.7;
    color: #c0cce8;
    pointer-events: none;
    opacity: 0;
    transition: opacity .18s ease, transform .18s ease;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,.8);
    white-space: normal;
    transform: translateY(4px);
  }
  .tooltip-box.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .tooltip-box::after {
    content: '';
    position: absolute;
    top: 100%; left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--green);
  }

  .event-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 32px;
  }
  .event-pick {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px;
    cursor: pointer;
    transition: all .18s;
  }
  .event-pick:hover { border-color: var(--dim); }
  .event-pick.active { border-color: var(--yellow); box-shadow: 0 0 16px rgba(245,197,66,.15); }
  .ep-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    margin-bottom: 6px;
  }
  .ep-tag.good { color: var(--green); }
  .ep-tag.bad { color: var(--red); }
  .ep-tag.neutral { color: var(--yellow); }
  .ep-name { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .ep-desc { font-size: 11px; color: var(--muted); line-height: 1.6; }

  .btn-battle {
    display: block;
    width: 100%;
    background: var(--green);
    color: #07080f;
    border: none;
    padding: 18px;
    font-size: 17px;
    font-weight: 900;
    font-family: 'Noto Sans JP', sans-serif;
    letter-spacing: 3px;
    border-radius: 3px;
    cursor: pointer;
    transition: all .2s;
  }
  .btn-battle:disabled { opacity: .35; cursor: not-allowed; }
  .btn-battle:not(:disabled):hover { box-shadow: 0 0 32px rgba(0,229,160,.35); }

  /* LOADING SCREEN */
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    gap: 20px;
  }
  .loader-ring {
    width: 56px; height: 56px;
    border: 3px solid var(--border);
    border-top-color: var(--green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  .loader-text {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 3px;
    animation: pulse 1.5s infinite;
  }

  /* BATTLE SCREEN */
  .battle-screen {
    max-width: 860px;
    margin: 0 auto;
    padding: 24px 20px;
  }

  .score-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 12px;
    align-items: center;
    margin-bottom: 28px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
  }
  .score-player { text-align: left; }
  .score-cpu { text-align: right; }
  .score-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 2px;
    margin-bottom: 4px;
  }
  .score-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 22px;
    font-weight: 700;
  }
  .score-vs {
    font-family: 'Bebas Neue', cursive;
    font-size: 28px;
    color: var(--dim);
    text-align: center;
  }

  .turn-feed {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }
  .turn-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    animation: slideIn .4s ease;
  }
  .turn-item.player { border-left-color: var(--green); }
  .turn-item.cpu { border-left-color: var(--red); }
  .turn-item.event-player { border-left-color: var(--yellow); }
  .turn-item.event-cpu { border-left-color: var(--dim); }
  .ti-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  .ti-actor {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  .ti-turn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--muted);
  }
  .ti-action { font-size: 13px; color: var(--text); }
  .ti-profit {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    margin-top: 4px;
  }
  .ti-comment {
    font-size: 13px;
    color: #8a9ab8;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
    line-height: 1.7;
    font-style: italic;
  }

  .portfolio-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  .port-side { }
  .port-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    transition: opacity .3s;
  }
  .port-card.sold { opacity: .4; }
  .pc-name { font-size: 12px; font-weight: 700; }
  .pc-sector { font-size: 10px; color: var(--muted); }
  .pc-price {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    text-align: right;
  }
  .pc-profit {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    text-align: right;
  }

  /* RESULT SCREEN */
  .result-screen {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 20px;
    animation: fadeUp .5s ease;
  }
  .result-verdict {
    text-align: center;
    margin-bottom: 32px;
  }
  .verdict-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .verdict-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(56px, 10vw, 96px);
    letter-spacing: 4px;
    line-height: 1;
  }
  .verdict-win { color: var(--green); }
  .verdict-lose { color: var(--red); }
  .verdict-draw { color: var(--yellow); }

  .result-scores {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  .rs-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
  }
  .rs-card.winner { border-color: var(--green); }
  .rs-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .rs-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .rs-total {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    font-weight: 700;
    font-size: 15px;
  }
  .rs-profit {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 18px;
    font-weight: 700;
  }

  .recap-box {
    background: var(--surface);
    border: 1px solid var(--green);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }
  .recap-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--green), transparent);
  }
  .recap-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .recap-dot {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse 1s infinite;
  }
  .recap-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--green);
  }
  .recap-text {
    font-size: 15px;
    line-height: 2;
    color: #c0cce8;
  }
  .recap-loading {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    animation: pulse 1s infinite;
  }

  .btn-retry {
    display: block;
    width: 100%;
    background: transparent;
    border: 1px solid var(--green);
    color: var(--green);
    padding: 16px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Noto Sans JP', sans-serif;
    letter-spacing: 2px;
    border-radius: 3px;
    cursor: pointer;
    transition: all .2s;
  }
  .btn-retry:hover { background: rgba(0,229,160,.08); }

  /* ── PORTFOLIO BATTLE ── */
  @keyframes cashOut {
    0%   { transform: translateY(0) scale(1); filter: brightness(1); }
    20%  { transform: translateY(-14px) scale(1.12); filter: brightness(2.5); }
    60%  { transform: translateY(-8px) scale(1.06); filter: brightness(1.5); }
    100% { transform: translateY(0) scale(1); filter: brightness(1); }
  }
  @keyframes profitFloat {
    0%   { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-40px); }
  }
  @keyframes eventPulse {
    0%,100% { filter: brightness(1); }
    50%     { filter: brightness(1.6) saturate(1.4); }
  }
  @keyframes cardReveal {
    0%   { opacity: 0; transform: translate(-50%,-50%) scale(.7); }
    15%  { opacity: 1; transform: translate(-50%,-50%) scale(1.04); }
    75%  { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%,-50%) scale(.95); }
  }
  @keyframes idleFloat {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-4px); }
  }

  /* ── Event card overlay ── */
  .event-overlay {
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(4,8,20,.7);
    backdrop-filter: blur(4px);
    pointer-events: none;
  }
  .event-overlay-card {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: min(420px, 88vw);
    animation: cardReveal 2.8s ease forwards;
    border-radius: 16px;
    overflow: hidden;
  }
  .eoc-inner {
    background: linear-gradient(145deg, #0d1929, #111e38);
    border: 2px solid var(--yellow);
    border-radius: 16px;
    padding: 32px 28px;
    box-shadow: 0 0 60px rgba(245,197,66,.35), 0 0 120px rgba(245,197,66,.1);
    text-align: center;
  }
  .eoc-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 5px;
    color: var(--yellow);
    margin-bottom: 16px;
  }
  .eoc-name {
    font-family: 'Bebas Neue', cursive;
    font-size: 42px;
    letter-spacing: 2px;
    color: #fff;
    margin-bottom: 12px;
    line-height: 1;
  }
  .eoc-divider {
    width: 60px; height: 2px;
    background: var(--yellow);
    margin: 0 auto 16px;
    border-radius: 1px;
  }
  .eoc-headline {
    font-size: 15px;
    color: #b0c0e0;
    line-height: 1.7;
  }
  .eoc-actor {
    margin-top: 20px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
  }

  /* ── Character Arena Row ── */
  @keyframes sellCelebrate {
    0%   { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }
    15%  { transform: translateY(-22px) scale(1.18) rotate(-6deg); filter: brightness(2.2); }
    35%  { transform: translateY(-28px) scale(1.22) rotate(4deg); filter: brightness(2.5); }
    60%  { transform: translateY(-10px) scale(1.1) rotate(-2deg); filter: brightness(1.5); }
    100% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }
  }
  @keyframes soldFade {
    from { opacity: 1; filter: grayscale(0); }
    to   { opacity: .28; filter: grayscale(1); }
  }
  @keyframes charIdle {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-5px); }
  }
  @keyframes charEventShine {
    0%,100% { filter: brightness(1) saturate(1); }
    40%     { filter: brightness(2) saturate(1.6) hue-rotate(20deg); }
  }

  .char-arena {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    background: radial-gradient(ellipse at 50% 100%, #0c1830 0%, #060b14 65%);
    border: 1px solid #1a2540;
    border-radius: 16px 16px 0 0;
    padding: 20px 8px 0;
    position: relative;
    overflow: hidden;
    min-height: 180px;
  }
  .char-arena::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,229,160,.25) 30%, rgba(0,229,160,.5) 50%, rgba(0,229,160,.25) 70%, transparent);
  }
  /* floor glow spots */
  .ca-glow-l {
    position: absolute;
    bottom: 0; left: 15%;
    width: 180px; height: 120px;
    background: radial-gradient(ellipse at bottom, rgba(0,229,160,.09) 0%, transparent 70%);
    pointer-events: none;
  }
  .ca-glow-r {
    position: absolute;
    bottom: 0; right: 15%;
    width: 180px; height: 120px;
    background: radial-gradient(ellipse at bottom, rgba(255,61,90,.09) 0%, transparent 70%);
    pointer-events: none;
  }

  .char-team {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    padding-bottom: 0;
  }
  .char-team.side-left  { flex-direction: row; }
  .char-team.side-right { flex-direction: row-reverse; }

  .char-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .char-unit .cu-svg {
    transition: filter .4s ease;
  }
  /* active: idle float */
  .char-unit.cu-active .cu-svg {
    animation: charIdle 2.8s ease-in-out infinite;
    filter: drop-shadow(0 6px 14px rgba(0,229,160,.35));
  }
  .char-unit.cu-active.side-right-unit .cu-svg {
    filter: drop-shadow(0 6px 14px rgba(255,61,90,.35));
  }
  /* sell: celebrate */
  .char-unit.cu-selling .cu-svg {
    animation: sellCelebrate .75s ease forwards;
    filter: drop-shadow(0 0 20px rgba(245,197,66,.8)) !important;
  }
  /* sold: grey out */
  .char-unit.cu-sold .cu-svg {
    animation: soldFade .5s ease forwards;
    opacity: .28;
    filter: grayscale(1) brightness(.5);
  }
  /* event: shine */
  .char-unit.cu-event .cu-svg {
    animation: charEventShine .65s ease 2;
  }

  .cu-name {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    text-align: center;
    max-width: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 6px;
  }
  .cu-name.cu-active-label { color: var(--text); font-weight: 700; }
  .cu-name.cu-sold-label   { text-decoration: line-through; opacity: .4; }

  /* profit burst above character */
  .cu-profit-burst {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    pointer-events: none;
    animation: profitFloat 1.1s ease forwards;
  }

  .char-center-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 20px;
    gap: 4px;
    padding-left: 4px;
    padding-right: 4px;
  }
  .char-center-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8px;
    color: var(--muted);
    letter-spacing: 3px;
  }
  .char-turn-badge {
    font-family: 'Bebas Neue', cursive;
    font-size: 24px;
    color: #1e2d4a;
    line-height: 1;
    letter-spacing: 2px;
  }

  /* ── Portfolio panels ── */
  .portfolio-battle {
    display: grid;
    grid-template-columns: 1fr 2px 1fr;
    gap: 0;
    background: #080d1a;
    border: 1px solid #1a2540;
    border-top: none;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    margin-bottom: 16px;
    position: relative;
  }
  .portfolio-battle::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 100%, rgba(0,229,160,.04) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(255,61,90,.04) 0%, transparent 50%);
    pointer-events: none;
  }
  .portfolio-divider {
    background: linear-gradient(180deg, transparent, #1e2d4a 20%, #2a3d60 50%, #1e2d4a 80%, transparent);
    position: relative;
    z-index: 1;
  }
  .portfolio-side {
    padding: 16px 12px 12px;
    position: relative;
    z-index: 1;
  }
  .ps-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1a2540;
  }
  .ps-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--muted);
  }
  .ps-total {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 17px;
    font-weight: 700;
  }
  .stock-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 6px;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: background .3s;
    position: relative;
  }
  .stock-row.is-selling {
    animation: cashOut .7s ease;
  }
  .stock-row.is-sold {
    opacity: .35;
    background: transparent !important;
  }
  .stock-row.event-pulse {
    animation: eventPulse .8s ease 2;
  }
  .stock-char {
    flex-shrink: 0;
    animation: idleFloat 3s ease-in-out infinite;
  }
  .stock-char.is-selling {
    animation: cashOut .7s ease;
  }
  .stock-row-info {
    flex: 1;
    min-width: 0;
  }
  .sri-name {
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .sri-ticker {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--muted);
  }
  .stock-row-stats {
    text-align: right;
    flex-shrink: 0;
  }
  .srs-price {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 2px;
  }
  .srs-profit {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 700;
  }
  .profit-pop {
    position: absolute;
    right: 8px;
    top: 0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    pointer-events: none;
    animation: profitFloat .9s ease forwards;
    white-space: nowrap;
  }
  .stock-hp-bar {
    width: 100%;
    height: 2px;
    background: #1a2540;
    border-radius: 1px;
    margin-top: 4px;
    overflow: hidden;
  }
  .stock-hp-fill {
    height: 100%;
    border-radius: 1px;
    transition: width .8s ease, background .8s ease;
  }
  .sold-stamp {
    position: absolute;
    right: 8px; top: 50%;
    transform: translateY(-50%) rotate(-12deg);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    border: 1px solid #2a3040;
    padding: 1px 5px;
    border-radius: 2px;
    letter-spacing: 2px;
  }

  /* ── Commentary ── */
  .commentary-bar {
    background: #07080f;
    border: 1px solid #1a2540;
    border-left: 3px solid var(--green);
    border-radius: 0 8px 8px 0;
    padding: 10px 16px;
    min-height: 52px;
    margin-bottom: 16px;
  }
  .cb-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--green);
    letter-spacing: 3px;
    margin-bottom: 4px;
  }
  .cb-text {
    font-size: 13px;
    color: #a0b0cc;
    line-height: 1.7;
    font-style: italic;
    animation: fadeUp .3s ease;
  }

  /* ── Profit race bar ── */
  .profit-race {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0;
    margin-bottom: 12px;
    height: 36px;
  }
  .race-bar-player {
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,229,160,.15));
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
  }
  .race-bar-cpu {
    height: 100%;
    background: linear-gradient(90deg, rgba(255,61,90,.15), transparent);
    border-radius: 0 8px 8px 0;
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
  .race-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 700;
  }
  .race-center {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 2px;
    text-align: center;
    padding: 0 10px;
    white-space: nowrap;
  }
`;


// ── SVGキャラクター（業種別・後でpngに差し替え可能） ────────────
function CharacterSVG({ sector, flip = false, size = 120 }) {
  const scale = size / 120;
  const transform = flip ? `scale(${scale}) translate(120,0) scale(-1,1)` : `scale(${scale})`;

  const characters = {
    'SaaS': (
      <g>
        {/* クラウドロボット */}
        <ellipse cx="60" cy="48" rx="28" ry="20" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1.5"/>
        <ellipse cx="44" cy="54" rx="12" ry="9" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <ellipse cx="76" cy="54" rx="12" ry="9" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <ellipse cx="60" cy="58" rx="22" ry="16" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1.5"/>
        {/* 顔 */}
        <rect x="44" y="66" width="32" height="36" rx="6" fill="#0d1929" stroke="#00e5a0" strokeWidth="1.5"/>
        <rect x="50" y="73" width="8" height="6" rx="2" fill="#00e5a0"/>
        <rect x="62" y="73" width="8" height="6" rx="2" fill="#00e5a0"/>
        <rect x="50" y="86" width="20" height="3" rx="1" fill="#00e5a0" opacity=".6"/>
        {/* 体 */}
        <rect x="46" y="104" width="28" height="24" rx="4" fill="#0d1929" stroke="#00e5a0" strokeWidth="1.5"/>
        <rect x="52" y="109" width="16" height="9" rx="2" fill="#00e5a0" opacity=".2"/>
        <circle cx="57" cy="113" r="2" fill="#00e5a0"/>
        <circle cx="63" cy="113" r="2" fill="#00e5a0"/>
        {/* 腕 */}
        <rect x="28" y="106" width="16" height="8" rx="4" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <rect x="76" y="106" width="16" height="8" rx="4" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        {/* 足 */}
        <rect x="48" y="128" width="10" height="12" rx="3" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
        <rect x="62" y="128" width="10" height="12" rx="3" fill="#1a2a4a" stroke="#00e5a0" strokeWidth="1"/>
      </g>
    ),
    '半導体': (
      <g>
        {/* チップモンスター */}
        <rect x="34" y="30" width="52" height="52" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="2"/>
        <rect x="40" y="36" width="40" height="40" rx="2" fill="#0d0d1a" stroke="#f5c542" strokeWidth="1"/>
        {/* 回路目 */}
        <rect x="46" y="44" width="12" height="10" rx="2" fill="#f5c542"/>
        <rect x="62" y="44" width="12" height="10" rx="2" fill="#f5c542"/>
        <rect x="50" y="62" width="20" height="3" rx="1" fill="#f5c542" opacity=".7"/>
        {/* ピン（足）上 */}
        <rect x="46" y="22" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="56" y="22" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="66" y="22" width="5" height="10" rx="1" fill="#f5c542"/>
        {/* ピン（足）下 */}
        <rect x="46" y="80" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="56" y="80" width="5" height="10" rx="1" fill="#f5c542"/>
        <rect x="66" y="80" width="5" height="10" rx="1" fill="#f5c542"/>
        {/* ピン（足）左 */}
        <rect x="22" y="42" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="22" y="52" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="22" y="62" width="10" height="5" rx="1" fill="#f5c542"/>
        {/* ピン（足）右 */}
        <rect x="88" y="42" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="88" y="52" width="10" height="5" rx="1" fill="#f5c542"/>
        <rect x="88" y="62" width="10" height="5" rx="1" fill="#f5c542"/>
        {/* 腕・体 */}
        <rect x="36" y="92" width="48" height="32" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1.5"/>
        <rect x="20" y="94" width="14" height="8" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
        <rect x="86" y="94" width="14" height="8" rx="4" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
        <rect x="44" y="124" width="10" height="12" rx="3" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
        <rect x="66" y="124" width="10" height="12" rx="3" fill="#1a1a2e" stroke="#f5c542" strokeWidth="1"/>
      </g>
    ),
    'ゲーム': (
      <g>
        {/* コントローラーキャラ */}
        <ellipse cx="60" cy="55" rx="36" ry="26" fill="#16213e" stroke="#9b59b6" strokeWidth="2"/>
        <ellipse cx="60" cy="55" rx="30" ry="20" fill="#0d1929" stroke="#9b59b6" strokeWidth="1"/>
        {/* 方向キー */}
        <rect x="34" y="50" width="6" height="10" rx="1" fill="#9b59b6"/>
        <rect x="30" y="54" width="14" height="6" rx="1" fill="#9b59b6"/>
        {/* ABXYボタン */}
        <circle cx="76" cy="52" r="3" fill="#e74c3c"/>
        <circle cx="82" cy="56" r="3" fill="#f5c542"/>
        <circle cx="76" cy="60" r="3" fill="#2ecc71"/>
        <circle cx="70" cy="56" r="3" fill="#3498db"/>
        {/* 目（スクリーン） */}
        <rect x="52" y="48" width="16" height="10" rx="2" fill="#0a0a1a" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="54" y="50" width="5" height="6" rx="1" fill="#9b59b6" opacity=".8"/>
        <rect x="61" y="50" width="5" height="6" rx="1" fill="#9b59b6" opacity=".8"/>
        {/* 体 */}
        <rect x="36" y="82" width="48" height="34" rx="6" fill="#16213e" stroke="#9b59b6" strokeWidth="1.5"/>
        <circle cx="60" cy="99" r="8" fill="#0d1929" stroke="#9b59b6" strokeWidth="1"/>
        <circle cx="60" cy="99" r="4" fill="#9b59b6" opacity=".6"/>
        {/* 腕 */}
        <rect x="20" y="84" width="14" height="8" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="86" y="84" width="14" height="8" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
        {/* 足 */}
        <rect x="42" y="116" width="12" height="14" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="66" y="116" width="12" height="14" rx="4" fill="#16213e" stroke="#9b59b6" strokeWidth="1"/>
      </g>
    ),
    'ヘルスケア': (
      <g>
        {/* 医療ロボット */}
        <ellipse cx="60" cy="50" rx="26" ry="26" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="2"/>
        {/* 十字マーク */}
        <rect x="55" y="36" width="10" height="28" rx="2" fill="#2ecc71"/>
        <rect x="47" y="44" width="26" height="10" rx="2" fill="#2ecc71"/>
        {/* 目 */}
        <circle cx="52" cy="48" r="4" fill="#0d1929" stroke="#2ecc71" strokeWidth="1"/>
        <circle cx="68" cy="48" r="4" fill="#0d1929" stroke="#2ecc71" strokeWidth="1"/>
        <circle cx="52" cy="48" r="2" fill="#2ecc71"/>
        <circle cx="68" cy="48" r="2" fill="#2ecc71"/>
        {/* 体 */}
        <rect x="38" y="78" width="44" height="38" rx="6" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1.5"/>
        <rect x="46" y="85" width="28" height="12" rx="2" fill="#0d1929" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="50" y="88" width="8" height="6" rx="1" fill="#2ecc71"/>
        <rect x="62" y="88" width="8" height="6" rx="1" fill="#2ecc71" opacity=".5"/>
        <circle cx="60" cy="108" r="4" fill="#2ecc71" opacity=".3"/>
        {/* 腕 */}
        <rect x="22" y="80" width="14" height="8" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="84" y="80" width="14" height="8" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
        {/* 足 */}
        <rect x="44" y="116" width="10" height="14" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
        <rect x="66" y="116" width="10" height="14" rx="4" fill="#1a2a2a" stroke="#2ecc71" strokeWidth="1"/>
      </g>
    ),
    'AI/IT': (
      <g>
        {/* AI脳キャラ */}
        <ellipse cx="60" cy="46" rx="30" ry="28" fill="#1a1a3e" stroke="#3498db" strokeWidth="2"/>
        {/* 脳の溝 */}
        <path d="M40 40 Q50 32 60 40 Q70 32 80 40" stroke="#3498db" strokeWidth="1.5" fill="none" opacity=".6"/>
        <path d="M34 52 Q44 46 54 52" stroke="#3498db" strokeWidth="1.5" fill="none" opacity=".6"/>
        <path d="M66 52 Q76 46 86 52" stroke="#3498db" strokeWidth="1.5" fill="none" opacity=".6"/>
        {/* 目 */}
        <circle cx="50" cy="48" r="7" fill="#0a0a2a" stroke="#3498db" strokeWidth="1.5"/>
        <circle cx="70" cy="48" r="7" fill="#0a0a2a" stroke="#3498db" strokeWidth="1.5"/>
        <circle cx="50" cy="48" r="3" fill="#3498db"/>
        <circle cx="70" cy="48" r="3" fill="#3498db"/>
        <circle cx="52" cy="46" r="1" fill="white"/>
        <circle cx="72" cy="46" r="1" fill="white"/>
        {/* 口 */}
        <path d="M50 62 Q60 68 70 62" stroke="#3498db" strokeWidth="1.5" fill="none"/>
        {/* 体 */}
        <rect x="36" y="76" width="48" height="36" rx="6" fill="#1a1a3e" stroke="#3498db" strokeWidth="1.5"/>
        {/* 回路 */}
        <line x1="44" y1="86" x2="76" y2="86" stroke="#3498db" strokeWidth="1" opacity=".5"/>
        <line x1="44" y1="94" x2="60" y2="94" stroke="#3498db" strokeWidth="1" opacity=".5"/>
        <line x1="60" y1="94" x2="60" y2="102" stroke="#3498db" strokeWidth="1" opacity=".5"/>
        <circle cx="60" cy="94" r="2" fill="#3498db"/>
        <circle cx="44" cy="86" r="2" fill="#3498db"/>
        <circle cx="76" cy="86" r="2" fill="#3498db"/>
        {/* 腕 */}
        <rect x="20" y="78" width="14" height="8" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
        <rect x="86" y="78" width="14" height="8" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
        {/* 足 */}
        <rect x="42" y="112" width="12" height="14" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
        <rect x="66" y="112" width="12" height="14" rx="4" fill="#1a1a3e" stroke="#3498db" strokeWidth="1"/>
      </g>
    ),
    'IT': (
      <g>
        {/* ターミナルキャラ */}
        <rect x="24" y="28" width="72" height="54" rx="6" fill="#0a1628" stroke="#e67e22" strokeWidth="2"/>
        <rect x="28" y="32" width="64" height="46" rx="3" fill="#050d1a"/>
        {/* コード行 */}
        <text x="34" y="46" fontFamily="monospace" fontSize="7" fill="#e67e22" opacity=".9">{'>'} init()</text>
        <text x="34" y="56" fontFamily="monospace" fontSize="7" fill="#2ecc71" opacity=".8">OK: loaded</text>
        <text x="34" y="66" fontFamily="monospace" fontSize="7" fill="#e67e22">{'>'} battle_</text>
        <rect x="64" y="61" width="1" height="7" fill="#e67e22">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        {/* 足・スタンド */}
        <rect x="52" y="82" width="16" height="10" rx="2" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1"/>
        <rect x="32" y="92" width="56" height="8" rx="3" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1.5"/>
        {/* 腕（ケーブル） */}
        <path d="M24 50 Q12 50 10 64 Q10 80 24 80" stroke="#e67e22" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="10" cy="72" r="5" fill="#e67e22" opacity=".5"/>
        <path d="M96 50 Q108 50 110 64 Q110 80 96 80" stroke="#e67e22" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="110" cy="72" r="5" fill="#e67e22" opacity=".5"/>
        {/* 足 */}
        <rect x="36" y="100" width="12" height="14" rx="4" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1"/>
        <rect x="72" y="100" width="12" height="14" rx="4" fill="#1a2a3a" stroke="#e67e22" strokeWidth="1"/>
      </g>
    ),
  };

  const char = characters[sector] || characters['IT'];
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
  );
}

// HPカラーを返す
function hpColor(ratio) {
  if (ratio > 0.6) return '#00e5a0';
  if (ratio > 0.3) return '#f5c542';
  return '#ff3d5a';
}

// ── メインコンポーネント ─────────────────────────────────────
export default function StockBattle() {
  const [phase, setPhase] = useState('title'); // title | select | loading | battle | result
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [recap, setRecap] = useState('');
  const [visibleTurns, setVisibleTurns] = useState([]);
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [currentPStocks, setCurrentPStocks] = useState([]);
  const [currentCStocks, setCurrentCStocks] = useState([]);
  const [arenaAnim, setArenaAnim] = useState({ attacker: null, sell: null, event: false });
  const [eventOverlay, setEventOverlay] = useState(null); // {card, actor}
  const [currentComment, setCurrentComment] = useState('');
  const feedRef = useRef(null);

  // ターンを順番に表示
  useEffect(() => {
    if (phase !== 'battle' || !battleResult) return;
    if (currentTurnIdx >= battleResult.turns.length) {
      // 全ターン終了 → リザルトへ
      setTimeout(() => setPhase('result'), 2000);
      return;
    }
    const timer = setTimeout(() => {
      const t = battleResult.turns[currentTurnIdx];
      setCurrentComment(t.comment || '');

      if (t.type === 'event') {
        // イベントカードオーバーレイを表示
        setEventOverlay({ card: t.card, actor: t.actor });
        setArenaAnim({ attacker: null, sell: null, event: true });
        setTimeout(() => setEventOverlay(null), 2800);
        setTimeout(() => setArenaAnim({ attacker: null, sell: null, event: false }), 2800);
      } else {
        // 売却アニメーション：売ったキャラが跳ね上がる
        setArenaAnim({ attacker: null, sell: { actor: t.actor, stockId: t.stock.id }, event: false });
        setTimeout(() => setArenaAnim({ attacker: null, sell: null, event: false }), 800);
      }

      setTimeout(() => {
        setVisibleTurns(prev => [t, ...prev]);
        setCurrentPStocks(t.pStocks);
        setCurrentCStocks(t.cStocks);
        setCurrentTurnIdx(i => i + 1);
      }, 500);
    }, currentTurnIdx === 0 ? 1200 : 3200);
    return () => clearTimeout(timer);
  }, [phase, currentTurnIdx, battleResult]);

  // スクロール
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [visibleTurns]);

  const [hoveredStockId, setHoveredStockId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  function toggleStock(stock) {
    setSelectedStocks(prev => {
      if (prev.find(s => s.id === stock.id)) return prev.filter(s => s.id !== stock.id);
      if (prev.length >= 3) return prev;
      return [...prev, stock];
    });
  }

  async function startBattle() {
    if (selectedStocks.length !== 3 || !selectedEvent) return;
    setPhase('loading');

    // CPUデッキ（プレイヤーと被らない銘柄からランダム3枚）
    const cpuDeck = shuffle(STOCKS.filter(s => !selectedStocks.find(p => p.id === s.id))).slice(0, 3);
    const result = simulateBattle(selectedStocks, cpuDeck, selectedEvent);

    // AI実況生成（ターンごとのコメント＋総括）
    let commentary = { turns: [], final: '' };
    try {
      commentary = await generateBattleCommentary(result);
    } catch(e) {
      commentary = {
        turns: result.turns.map(t => ({ turn: t.turn, comment: '' })),
        final: '市場が激しく動いた今日のバトル。両者の戦略が激突し、最後まで目が離せない展開となった。'
      };
    }
    // ターンオブジェクトにコメントを付与
    const enrichedTurns = result.turns.map(t => ({
      ...t,
      comment: (commentary.turns.find(c => c.turn === t.turn) || {}).comment || ''
    }));
    const enrichedResult = { ...result, turns: enrichedTurns };

    setBattleResult(enrichedResult);
    setRecap(commentary.final);
    setVisibleTurns([]);
    setCurrentTurnIdx(0);
    setCurrentPStocks(selectedStocks.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 })));
    setCurrentCStocks(cpuDeck.map(s => ({ ...s, currentPrice: s.price, sold: false, profit: 0 })));
    setPhase('battle');
  }

  function reset() {
    setSelectedStocks([]);
    setSelectedEvent(null);
    setBattleResult(null);
    setRecap('');
    setVisibleTurns([]);
    setCurrentTurnIdx(0);
    setPhase('title');
  }

  const pCurrent = battleResult
    ? battleResult.turns.slice(0, currentTurnIdx).filter(t => t.type === 'sell' && t.actor === 'player').reduce((sum, t) => sum + t.profit, 0)
    : 0;
  const cCurrent = battleResult
    ? battleResult.turns.slice(0, currentTurnIdx).filter(t => t.type === 'sell' && t.actor === 'cpu').reduce((sum, t) => sum + t.profit, 0)
    : 0;

  // ティッカー用データ
  const tickerItems = [...STOCKS, ...STOCKS];

  return (
    <div className="sb-root">
      <style>{CSS}</style>
      <div className="sb-inner">
        {/* ティッカー */}
        <div className="ticker-wrap">
          <div className="ticker-track">
            {tickerItems.map((s, i) => {
              const up = (s.id + i) % 3 !== 0;
              const pct = ((s.id * 7 + i * 3) % 41 / 10).toFixed(1);
              return (
                <span key={`${s.id}-${i}`} className="ticker-item">
                  {s.ticker}
                  <span className={up ? 'ticker-up' : 'ticker-dn'}>
                    {up ? '▲' : '▼'}{pct}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* ヘッダー */}
        <div className="sb-header">
          <div className="sb-logo">KABUKKA MONSTER</div>
          <div className="sb-badge">NIKKEI GROWTH MARKET ● LIVE</div>
        </div>

        {/* ─── タイトル ─── */}
        {phase === 'title' && (
          <div className="title-screen">
            <div className="title-eyebrow">KABUKKA MONSTER</div>
            <h1 className="title-h1">KABUKKA MONSTER</h1>
            <p className="title-sub">株を育て、市場を制せ。</p>
            <button className="btn-start" onClick={() => setPhase('select')}>デッキ編成へ</button>
          </div>
        )}

        {/* ─── デッキ選択 ─── */}
        {phase === 'select' && (
          <div className="deck-screen">
            <div style={{ marginBottom: 32 }}>
              <div className="section-label">STEP 1 — 株を3枚選ぶ（{selectedStocks.length}/3）</div>
              <div className="stock-grid">
                {STOCKS.map(s => (
                  <div
                    key={s.id}
                    className={`stock-pick${selectedStocks.find(p => p.id === s.id) ? ' active' : ''}`}
                    onClick={() => toggleStock(s)}
                    onMouseEnter={e => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setHoveredStockId(s.id);
                      setTooltipPos({ x: r.left + r.width / 2, y: r.top - 12 });
                    }}
                    onMouseLeave={() => setHoveredStockId(null)}
                  >
                    {selectedStocks.find(p => p.id === s.id) && (
                      <div className="sp-check">✓</div>
                    )}
                    <div className="sp-ticker">{s.ticker}</div>
                    <div className="sp-name">{s.name}</div>
                    <div className="sp-sector">{s.sector}</div>
                    <div className="sp-price">{s.price.toLocaleString()}円</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <div className="section-label">STEP 2 — イベントカードを1枚選ぶ</div>
              <div className="event-grid">
                {EVENT_CARDS.map(c => (
                  <div
                    key={c.id}
                    className={`event-pick${selectedEvent?.id === c.id ? ' active' : ''}`}
                    onClick={() => setSelectedEvent(c)}
                  >
                    <div className={`ep-tag ${c.type}`}>
                      {c.type === 'good' ? '▲ BULLISH' : c.type === 'bad' ? '▼ BEARISH' : '◆ NEUTRAL'}
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
              onClick={startBattle}
            >
              バトル開始
            </button>
          </div>
        )}

        {/* ─── ローディング ─── */}
        {phase === 'loading' && (
          <div className="loading-screen">
            <div className="loader-ring" />
            <div className="loader-text">AI が実況を生成中...</div>
          </div>
        )}

        {/* ─── バトル観戦 ─── */}
        {phase === 'battle' && battleResult && (() => {
          const lastTurn = visibleTurns[0];
          const sellingStockId = arenaAnim.sell?.stockId;

          return (
          <div className="battle-screen">

            {/* イベントカードオーバーレイ */}
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

            {/* 利益レース */}
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

            {/* ── キャラクターアリーナ ── */}
            <div className="char-arena">
              <div className="ca-glow-l"/>
              <div className="ca-glow-r"/>

              {/* プレイヤー側チーム */}
              <div className="char-team side-left">
                {currentPStocks.map(s => {
                  const isActive = !s.sold && !currentPStocks.slice(0, currentPStocks.indexOf(s)).some(x => !x.sold);
                  const isSelling = arenaAnim.sell?.actor === 'player' && arenaAnim.sell?.stockId === s.id;
                  const profit = s.currentPrice - s.price;
                  const szPx = isActive ? 86 : 58;
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
                  );
                })}
              </div>

              {/* 中央 */}
              <div className="char-center-col">
                <div className="char-turn-badge">TURN</div>
                <div className="char-turn-badge" style={{ fontSize: 32, color: 'var(--dim)' }}>
                  {visibleTurns.length + 1}
                </div>
                <div className="char-center-label">OF 8</div>
              </div>

              {/* CPU側チーム */}
              <div className="char-team side-right">
                {currentCStocks.map(s => {
                  const isActive = !s.sold && !currentCStocks.slice(0, currentCStocks.indexOf(s)).some(x => !x.sold);
                  const isSelling = arenaAnim.sell?.actor === 'cpu' && arenaAnim.sell?.stockId === s.id;
                  const profit = s.currentPrice - s.price;
                  const szPx = isActive ? 86 : 58;
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
                  );
                })}
              </div>
            </div>

            {/* ポートフォリオ 2サイド */}
            <div className="portfolio-battle" >
              {/* プレイヤー側 */}
              <div className="portfolio-side">
                <div className="ps-header">
                  <span className="ps-label">PLAYER</span>
                  <span className="ps-total" style={{ color: pCurrent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {pCurrent >= 0 ? '+' : ''}{pCurrent.toLocaleString()}
                  </span>
                </div>
                {currentPStocks.map(s => {
                  const profit = s.currentPrice - s.price;
                  const hp = Math.max(0, Math.min(1, s.currentPrice / s.price));
                  const isSelling = arenaAnim.sell?.actor === 'player' && arenaAnim.sell?.stockId === s.id;
                  const isEventAffected = arenaAnim.event && !s.sold;
                  return (
                    <div key={s.id} className={[
                      'stock-row',
                      s.sold ? 'is-sold' : '',
                      isSelling ? 'is-selling' : '',
                      isEventAffected ? 'event-pulse' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ background: !s.sold ? 'rgba(0,229,160,.03)' : '' }}>
                      <div className={`stock-char${isSelling ? ' is-selling' : ''}`}>
                        <CharacterSVG sector={s.sector} size={44}/>
                      </div>
                      <div className="stock-row-info">
                        <div className="sri-name" style={{ color: s.sold ? 'var(--dim)' : 'var(--text)' }}>{s.name}</div>
                        <div className="sri-ticker">{s.ticker} · {s.sector}</div>
                        <div className="stock-hp-bar">
                          <div className="stock-hp-fill" style={{ width: `${hp * 100}%`, background: hpColor(hp) }}/>
                        </div>
                      </div>
                      <div className="stock-row-stats">
                        <div className="srs-price">{s.currentPrice.toLocaleString()}円</div>
                        <div className="srs-profit" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                        </div>
                      </div>
                      {s.sold && <div className="sold-stamp">SOLD</div>}
                      {isSelling && (
                        <div className="profit-pop" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {profit >= 0 ? '+' : ''}{profit.toLocaleString()}円
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 中央区切り */}
              <div className="portfolio-divider"/>

              {/* CPU側 */}
              <div className="portfolio-side">
                <div className="ps-header">
                  <span className="ps-label">CPU</span>
                  <span className="ps-total" style={{ color: cCurrent >= 0 ? 'var(--red)' : 'var(--green)' }}>
                    {cCurrent >= 0 ? '+' : ''}{cCurrent.toLocaleString()}
                  </span>
                </div>
                {currentCStocks.map(s => {
                  const profit = s.currentPrice - s.price;
                  const hp = Math.max(0, Math.min(1, s.currentPrice / s.price));
                  const isSelling = arenaAnim.sell?.actor === 'cpu' && arenaAnim.sell?.stockId === s.id;
                  const isEventAffected = arenaAnim.event && !s.sold;
                  return (
                    <div key={s.id} className={[
                      'stock-row',
                      s.sold ? 'is-sold' : '',
                      isSelling ? 'is-selling' : '',
                      isEventAffected ? 'event-pulse' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ background: !s.sold ? 'rgba(255,61,90,.03)' : '' }}>
                      <div className={`stock-char${isSelling ? ' is-selling' : ''}`}>
                        <CharacterSVG sector={s.sector} flip size={44}/>
                      </div>
                      <div className="stock-row-info">
                        <div className="sri-name" style={{ color: s.sold ? 'var(--dim)' : 'var(--text)' }}>{s.name}</div>
                        <div className="sri-ticker">{s.ticker} · {s.sector}</div>
                        <div className="stock-hp-bar">
                          <div className="stock-hp-fill" style={{ width: `${hp * 100}%`, background: hpColor(hp) }}/>
                        </div>
                      </div>
                      <div className="stock-row-stats">
                        <div className="srs-price">{s.currentPrice.toLocaleString()}円</div>
                        <div className="srs-profit" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                        </div>
                      </div>
                      {s.sold && <div className="sold-stamp">SOLD</div>}
                      {isSelling && (
                        <div className="profit-pop" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {profit >= 0 ? '+' : ''}{profit.toLocaleString()}円
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* コメンタリー */}
            <div className="commentary-bar">
              {currentComment ? (
                <>
                  <div className="cb-label">🎙 COMMENTATOR</div>
                  <div className="cb-text">{currentComment}</div>
                </>
              ) : (
                <div className="cb-label" style={{ opacity: .4, animation: 'pulse 1.5s infinite' }}>BATTLE STARTING...</div>
              )}
            </div>

            {/* ターンフィード */}
            <div className="section-label">BATTLE LOG</div>
            <div className="turn-feed" ref={feedRef}>
              {visibleTurns.map((t, i) => {
                const isEvent = t.type === 'event';
                const cls = isEvent
                  ? (t.actor === 'player' ? 'event-player' : 'event-cpu')
                  : t.actor;
                return (
                  <div key={i} className={`turn-item ${cls}`}>
                    <div className="ti-header">
                      <span className="ti-actor" style={{ color: t.actor === 'player' ? 'var(--green)' : 'var(--red)' }}>
                        {t.actor === 'player' ? 'PLAYER' : 'CPU'}{isEvent ? ' — EVENT' : ''}
                      </span>
                      <span className="ti-turn">TURN {t.turn}</span>
                    </div>
                    <div className="ti-action">{t.action}</div>
                    {!isEvent && (
                      <div className="ti-profit" style={{ color: t.profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {t.profit >= 0 ? '+' : ''}{t.profit.toLocaleString()}円
                      </div>
                    )}
                  </div>
                );
              })}
              {visibleTurns.length === 0 && (
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)', animation: 'pulse 1s infinite' }}>
                  — バトル開始待機中 —
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* ─── リザルト ─── */}
        {phase === 'result' && battleResult && (
          <div className="result-screen">
            <div className="result-verdict">
              <div className="verdict-eyebrow">BATTLE RESULT</div>
              <div className={`verdict-title ${battleResult.winner === 'player' ? 'verdict-win' : battleResult.winner === 'cpu' ? 'verdict-lose' : 'verdict-draw'}`}>
                {battleResult.winner === 'player' ? 'YOU WIN' : battleResult.winner === 'cpu' ? 'YOU LOSE' : 'DRAW'}
              </div>
            </div>

            {/* スコア */}
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

            {/* AI実況 */}
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

            <button className="btn-retry" onClick={reset}>もう一度バトル</button>
          </div>
        )}
      {/* グローバルツールチップ */}
      {hoveredStockId && (() => {
        const stock = STOCKS.find(s => s.id === hoveredStockId);
        if (!stock) return null;
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
        );
      })()}
      </div>
    </div>
  );
}
