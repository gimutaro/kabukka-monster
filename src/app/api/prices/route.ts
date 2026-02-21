import { NextResponse } from 'next/server'
import { exec } from 'child_process'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cmd = `${process.cwd()}/.venv/bin/python3 ${process.cwd()}/scripts/fetch_prices.py`

  try {
    const result = await new Promise<string>((resolve, reject) => {
      exec(cmd, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message))
          return
        }
        resolve(stdout.trim())
      })
    })

    const prices: Record<string, number> = JSON.parse(result)
    return NextResponse.json(prices)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch prices'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
