// src/app/page.tsx
import { db } from '@/lib/db'

async function getMessage() {
  const tursoStart = performance.now()
  const result = await db.execute(`
    SELECT 
      content || ' [Random: ' || substr(hex(randomblob(4)), 1, 8) || 
      ' Time: ' || datetime('now') || ']' as content 
    FROM messages 
    LIMIT 1
  `)
  const tursoLatency = performance.now() - tursoStart
  return {
    content: result.rows[0]?.content as string,
    tursoLatency
  }
}

export default async function Home() {
  const pageStart = performance.now()
  const { content: message, tursoLatency } = await getMessage()
  const totalLatency = performance.now() - pageStart
  const nextLatency = totalLatency - tursoLatency
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Message from Turso
        </h1>
        <p className="text-2xl text-center">
          {message}
        </p>
        <div className="mt-8 space-y-2 text-center text-sm text-gray-600">
          <p>🚀 Turso DB Latency: {tursoLatency.toFixed(2)}ms</p>
          <p>⚡  Next.js Latency: {nextLatency.toFixed(2)}ms</p>
          <p>🌐 Total Latency: {totalLatency.toFixed(2)}ms</p>
        </div>

        <div className=" p-4 rounded">
             <h3 className="font-medium mb-2">📝 SQL Query Running:</h3>
             <pre className=" p-3 rounded text-sm overflow-x-auto">
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