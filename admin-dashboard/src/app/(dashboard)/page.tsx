'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main dashboard page
    router.push('/dashboard')
  }, [router])

  // Return loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    </div>
  )
}