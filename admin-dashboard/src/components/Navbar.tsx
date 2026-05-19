'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="text-2xl hover:bg-slate-100 p-2 rounded-lg transition-colors">
          🔔
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="font-medium text-slate-700">{user?.name || 'Admin'}</span>
            <span className="text-xl">▼</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="font-medium text-slate-900">{user?.name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
