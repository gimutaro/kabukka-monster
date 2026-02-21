import type { Stock, EventCard } from './types'

export const STOCKS: readonly Stock[] = [
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
] as const

export const EVENT_CARDS: readonly EventCard[] = [
  { id: 1, name: '半導体不足深刻化', headline: 'メモリ価格高騰で半導体・IT銘柄が急落', effect: { '半導体': -0.22, 'IT': -0.12, 'AI/IT': -0.10 }, type: 'bad' },
  { id: 2, name: 'AI需要爆発', headline: '生成AI需要急増でSaaS・AI関連が急騰', effect: { 'SaaS': +0.25, 'AI/IT': +0.22 }, type: 'good' },
  { id: 3, name: '医療DX法案可決', headline: '医療DX推進法が国会で可決、ヘルスケア株急伸', effect: { 'ヘルスケア': +0.22 }, type: 'good' },
  { id: 4, name: '円安加速', headline: '1ドル160円突破。輸出恩恵・内需に逆風', effect: { '半導体': +0.15, 'SaaS': -0.08, 'ヘルスケア': -0.06 }, type: 'neutral' },
  { id: 5, name: 'スタートアップ増税', headline: 'グロース株増税議論が浮上、市場全体に売り圧力', effect: { 'SaaS': -0.15, 'AI/IT': -0.15, 'IT': -0.15, 'ゲーム': -0.12, 'ヘルスケア': -0.10 }, type: 'bad' },
] as const
