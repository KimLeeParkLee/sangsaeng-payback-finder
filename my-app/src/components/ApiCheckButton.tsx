'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ApiCheckButton() {
  const [path, setPath] = useState('health')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)

  async function check() {
    setLoading(true)
    setStatus(null)
    setBody(null)
    const started = performance.now()
    try {
      const url = path.startsWith('/') ? `/api${path}` : `/api/${path}`
      const res = await fetch(url, { cache: 'no-store' })
      const dur = Math.round(performance.now() - started)
      setStatus(`${res.status} ${res.statusText} (${dur}ms)`) 
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const json = await res.json()
        setBody(JSON.stringify(json, null, 2))
      } else {
        const text = await res.text()
        setBody(text.slice(0, 2000))
      }
    } catch (err: any) {
      setStatus('REQUEST_FAILED')
      setBody(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex gap-2">
        <Input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="endpoint path (e.g. health or stores)"
        />
        <Button onClick={check} disabled={loading}>
          {loading ? 'Checking…' : 'Check API'}
        </Button>
      </div>
      {status && <div className="text-sm text-muted-foreground">Status: {status}</div>}
      {body && (
        <pre className="text-xs bg-secondary/50 p-3 rounded-md overflow-auto max-h-64">
          {body}
        </pre>
      )}
    </div>
  )
}

