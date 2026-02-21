import type { Stock, EventCard } from './types'

export const STOCKS: readonly Stock[] = [
  { id: 1, name: 'Freee', ticker: '4478', sector: 'SaaS', price: 1450, desc: 'Cloud accounting & HR SaaS for SMBs. No.1 market share in Japan. A fast-growing platform driving back-office DX.', image: '/stocks/freee.png' },
  { id: 2, name: 'MoneyForward', ticker: '3994', sector: 'SaaS', price: 3180, desc: 'From personal budgeting apps to corporate expense & accounting SaaS. A leading FinTech x SaaS company with 12M+ users.', image: '/stocks/moneyforward.png' },
  { id: 3, name: 'Socionext', ticker: '6526', sector: 'Semiconductor', price: 2750, desc: 'Fabless SoC design company born from Fujitsu & Panasonic. High margins through a factory-free semiconductor model.', image: '/stocks/socionext.png' },
  { id: 4, name: 'GENDA', ticker: '9166', sector: 'Gaming', price: 1230, desc: 'Entertainment company rapidly expanding arcade facilities through M&A. Leading the global claw machine market.', image: '/stocks/genda.png' },
  { id: 5, name: 'Medley', ticker: '4480', sector: 'Healthcare', price: 2080, desc: 'Healthcare DX company offering telemedicine, cloud solutions for clinics, and medical staffing services.', image: '/stocks/medley.png' },
  { id: 6, name: 'JMDC', ticker: '4483', sector: 'Healthcare', price: 2540, desc: 'Healthcare data company analyzing insurance & medical big data. Provides high-value analytics to pharma and insurers.', image: '/stocks/jmdc.png' },
  { id: 7, name: 'Kaonavi', ticker: '4435', sector: 'SaaS', price: 890, desc: 'Talent management SaaS with photo-based employee directory. Strong enterprise adoption in the HR tech market.', image: '/stocks/kaonavi.png' },
  { id: 8, name: 'Appier', ticker: '4180', sector: 'AI/IT', price: 1670, desc: 'Taiwan-based AI company providing marketing automation SaaS. Rapidly growing ad-tech across Asia Pacific.', image: '/stocks/appier.png' },
  { id: 9, name: 'Safie', ticker: '4375', sector: 'AI/IT', price: 650, desc: 'Cloud-based video management platform. Aggregates security camera footage for AI-powered business insights.', image: '/stocks/safie.png' },
  { id: 10, name: 'VALTES', ticker: '4442', sector: 'IT', price: 780, desc: 'IT services company specializing in software testing & QA. Steady growth driven by rising demand for system quality.', image: '/stocks/valtes.png' },
] as const

export const EVENT_CARDS: readonly EventCard[] = [
  { id: 1, name: 'Chip Shortage Crisis', headline: 'Memory prices surge, semiconductor & IT stocks plunge', effect: { 'Semiconductor': -0.22, 'IT': -0.12, 'AI/IT': -0.10 }, type: 'bad' },
  { id: 2, name: 'AI Demand Explosion', headline: 'Generative AI demand surges, SaaS & AI stocks skyrocket', effect: { 'SaaS': +0.25, 'AI/IT': +0.22 }, type: 'good' },
  { id: 3, name: 'Healthcare DX Bill Passed', headline: 'Healthcare DX promotion bill passes parliament, healthcare stocks surge', effect: { 'Healthcare': +0.22 }, type: 'good' },
  { id: 4, name: 'Yen Depreciation', headline: 'USD/JPY breaks 160. Exporters benefit, domestic demand hit', effect: { 'Semiconductor': +0.15, 'SaaS': -0.08, 'Healthcare': -0.06 }, type: 'neutral' },
  { id: 5, name: 'Startup Tax Hike', headline: 'Growth stock tax debate emerges, selling pressure across the market', effect: { 'SaaS': -0.15, 'AI/IT': -0.15, 'IT': -0.15, 'Gaming': -0.12, 'Healthcare': -0.10 }, type: 'bad' },
] as const
