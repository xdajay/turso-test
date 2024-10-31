'use client'
import { useState, useTransition } from 'react'

type Metrics = {
    message: string;
    tursoLatency: number;
    nextLatency: number;
    totalLatency: number;
    serverStart: number;
    serverEnd: number;
    preQueryTime: number;
    postQueryTime: number;
  }
  
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
        const clientEnd = Date.now()
        
        // Update metrics with actual round-trip time
        setMetrics({
          ...newMetrics,
          totalLatency: clientEnd - newMetrics.serverStart
        })
      })
    }

  return (
    <div className='mt-4'>
      <p className="text-2xl text-center">
        {metrics.message}
      </p>
      
      <div className="mt-8 space-y-2 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>🚀 Turso DB Latency: {metrics.tursoLatency.toFixed(2)}ms</p>
        <p>⚡ Pre-Query Time: {metrics.preQueryTime.toFixed(2)}ms</p>
        <p>📡 Post-Query Time: {metrics.postQueryTime.toFixed(2)}ms</p>
        <p>🔄 Next.js Processing: {metrics.nextLatency.toFixed(2)}ms</p>
        <p>🌐 Total Round Trip: {metrics.totalLatency.toFixed(2)}ms</p>
        <p className="text-xs text-gray-400">
          Server Time: {new Date(metrics.serverStart).toISOString().split('T')[1].split('.')[0]}
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          {isPending ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-400 dark:text-gray-300">
        <p>Server Start: {new Date(metrics.serverStart).toISOString()}</p>
        <p>Server End: {new Date(metrics.serverEnd).toISOString()}</p>
      </div>
    </div>
  )
}