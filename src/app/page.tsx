export const dynamic = 'force-dynamic'
export const runtime = "edge"

import { db } from '@/lib/db'
import { MetricsDisplay } from '@/components/MetricsDisplay'

// Define types for our metrics
type Metrics = {
  message: string;
  tursoLatency: number;
  nextLatency: number;
  totalLatency: number;
}

// Server Action
async function refreshMessage(): Promise<Metrics> {
  'use server'
  const pageStart = performance.now()
  
  const tursoStart = performance.now()
  const result = await db.execute(`
    SELECT 
      content || ' [Random: ' || substr(hex(randomblob(4)), 1, 8) || 
      ' Time: ' || datetime('now') || ']' as content 
    FROM messages 
    LIMIT 1
  `)
  const tursoLatency = performance.now() - tursoStart
  
  const totalLatency = performance.now() - pageStart
  const nextLatency = totalLatency - tursoLatency
  
  return {
    message: result.rows[0]?.content as string,
    tursoLatency,
    nextLatency,
    totalLatency
  }
}

export default async function Home() {
  const initialMetrics = await refreshMessage()
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Message from Turso
        </h1>
        
        <MetricsDisplay 
          initialMetrics={initialMetrics} 
          refreshAction={refreshMessage} 
        />

        <div className="p-4 rounded">
          <h3 className="font-medium mb-2">📝 SQL Query Running:</h3>
          <pre className="p-3 rounded text-sm overflow-x-auto">
            {`SELECT 
  content || ' [Random: ' || substr(hex(randomblob(4)), 1, 8) || 
  ' Time: ' || datetime('now') || ']' as content 
FROM messages 
LIMIT 1`}
          </pre>
        </div>
      </div>
    </main>
  )
}