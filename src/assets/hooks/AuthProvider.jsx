import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.currentUser()
      setUser(data.user)
      setSessionError('')
    } catch (error) {
      setUser(null)
      setSessionError(error.message || 'Não foi possível verificar a sessão.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(refreshUser)
  }, [refreshUser])

  const value = useMemo(() => ({
    user,
    loading,
    sessionError,
    async login(credentials) {
      const data = await api.login(credentials)
      setUser(data.user)
      setSessionError('')
      return data.user
    },
    async register(details) {
      const data = await api.register(details)
      setUser(data.user)
      setSessionError('')
      return data.user
    },
    async logout() {
      await api.logout()
      setUser(null)
    }
  }), [user, loading, sessionError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
