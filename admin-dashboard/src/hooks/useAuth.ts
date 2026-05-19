'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const userData = localStorage.getItem('adminUser')

        if (!token || !userData) {
          setIsAuthenticated(false)
          setUser(null)
          setIsLoading(false)
          return
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)

        // Validate token with backend using /auth/me endpoint
        try {
          const response = await apiClient.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.status === 200) {
            // Token is valid
            setIsLoading(false)
            return
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            logout()
            router.push('/login')
            return
          }
          throw error
        }
      } catch (error) {
        console.error('Auth validation error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    validateAuth()
  }, [router])

  const getAccessToken = () => {
    return localStorage.getItem('adminToken')
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('adminUser')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    getAccessToken,
    logout,
  }
}
