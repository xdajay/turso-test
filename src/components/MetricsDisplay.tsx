'use client'

type Metrics = {
    message: string;
    tursoLatency: number;
    nextLatency: number;
    totalLatency: number;
  }

  
import { useState, useTransition } from 'react'

export function MetricsDisplay({ 
  initialMetrics, 
  refreshAction 
}: { 
  initialMetrics: Metrics,
  refreshAction: () => Promise<Metrics>
}) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [isPending, startTransition] = useTransition()

  const handleRefresh = async () => {
    startTransition(async () => {
      const newMetrics = await refreshAction()
      setMetrics(newMetrics)
    })
  }

  return (
    <div>
      <p className="text-2xl text-center">
        {metrics.message}
      </p>
      
      <div className="mt-8 space-y-2 text-center text-sm text-gray-600">
        <p>🚀 Turso DB Latency: {metrics.tursoLatency.toFixed(2)}ms</p>
        <p>⚡ Next.js Latency: {metrics.nextLatency.toFixed(2)}ms</p>
        <p>🌐 Total Latency: {metrics.totalLatency.toFixed(2)}ms</p>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          {isPending ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  )
}