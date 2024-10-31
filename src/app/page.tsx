export const dynamic = 'force-dynamic'
export const runtime = "edge"

import { db } from '@/lib/db'
import { MetricsDisplay } from '@/components/MetricsDisplay'

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

async function refreshMessage(): Promise<Metrics> {
  'use server'
  const serverStart = Date.now()
  const pageStart = performance.now()
  
  // Pre-query processing time
  const preProcessingStart = performance.now()
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate some pre-processing
  const preQueryTime = performance.now() - preProcessingStart
  
  // Database query
  const tursoStart = performance.now()
  const result = await db.execute(`
    SELECT 
      content || ' [Random: ' || substr(hex(randomblob(4)), 1, 8) || 
      ' Time: ' || datetime('now') || ']' as content 
    FROM messages 
    LIMIT 1
  `)
  const tursoLatency = performance.now() - tursoStart
  
  // Post-query processing time
  const postProcessingStart = performance.now()
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate some post-processing
  const postQueryTime = performance.now() - postProcessingStart
  
  // Calculate total Next.js processing time (excluding DB query)
  const nextLatency = preQueryTime + postQueryTime
  const totalLatency = performance.now() - pageStart
  const serverEnd = Date.now()

  return {
    message: result.rows[0]?.content as string,
    tursoLatency,
    nextLatency,
    totalLatency,
    serverStart,
    serverEnd,
    preQueryTime,
    postQueryTime
  }
}

export default async function Home() {
  const initialMetrics = await refreshMessage()
  
  return (
    <main className="flex w-full min-h-screen flex-col max-w-2xl mx-auto text-center p-6 md:p-20 dark:text-neutral-300 font-mono space-y-12">

       <div>
        <h1 className="text-4xl font-bold mb-3">
          Message from Turso Next
        </h1>
        <p>Next 15 + Server Actions + force-dynamic</p>
        </div>

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
      



  <div className="mt-12 p-6 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-sm text-left">
 <h2 className="text-xl font-semibold mb-4">🌍 Turso Locations</h2>
 
 <div className="overflow-x-auto">
   <table className="min-w-full">
     <thead>
       <tr className="text-left text-sm font-medium text-gray-500 dark:text-neutral-300">
         <th className="py-2 px-4">NAME</th>
         <th className="py-2 px-4">TYPE</th>
         <th className="py-2 px-4">LOCATION</th>
         <th className="py-2 px-4">REGION</th>
       </tr>
     </thead>
     <tbody>
       <tr className="border-t">
         <td className="py-2 px-4">bom</td>
         <td className="py-2 px-4">
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
             primary
           </span>
         </td>
         <td className="py-2 px-4">bom</td>
         <td className="py-2 px-4">Mumbai, India</td>
       </tr>
       <tr className="border-t">
         <td className="py-2 px-4">fra</td>
         <td className="py-2 px-4">
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
             replica
           </span>
         </td>
         <td className="py-2 px-4">fra</td>
         <td className="py-2 px-4">Frankfurt, Germany</td>
       </tr>
       <tr className="border-t">
         <td className="py-2 px-4">iad</td>
         <td className="py-2 px-4">
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
             replica
           </span>
         </td>
         <td className="py-2 px-4">iad</td>
         <td className="py-2 px-4">Virginia, USA</td>
       </tr>
     </tbody>
   </table>
 </div>

 <div className="mt-4 text-sm text-gray-600 dark:text-neutral-400">
   <p className="flex items-center">
     <span className="w-3 h-3 bg-green-100 rounded-full mr-2"></span>
     Primary: Main write location
   </p>
   <p className="flex items-center mt-1">
     <span className="w-3 h-3 bg-blue-100 rounded-full mr-2"></span>
     Replica: Auto-routing for lowest latency reads
   </p>
 </div>
</div>


      <footer className="mt-12 text-center text-sm text-gray-600 dark:text-neutral-300 space-y-2">
          <div className="flex justify-center space-x-4">
            <a 
              href="https://github.com/xdajay/turso-test" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a 
              href="https://x.com/ajthakur_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </a>
          </div>
        </footer>
    </main>
  )
}