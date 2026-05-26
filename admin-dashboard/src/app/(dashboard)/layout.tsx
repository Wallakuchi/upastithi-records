'use client'

import AuthGuard from './_components/AuthGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}