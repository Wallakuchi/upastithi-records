'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Sidebar() {
  const { logout } = useAuth()

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/employees', label: 'Employees', icon: '👥' },
    { href: '/attendance', label: 'Attendance', icon: '📋' },
    { href: '/leave-requests', label: 'Leave Requests', icon: '📅' },
    { href: '/reports', label: 'Reports', icon: '📈' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upastithi</h1>
        <p className="text-sm text-slate-400">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-left flex items-center gap-3"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  )
}
