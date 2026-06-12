import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens } from '@types/index'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (tokens: AuthTokens) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (tokens: AuthTokens) => {
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        set({ 
          accessToken: tokens.access, 
          refreshToken: tokens.refresh,
          isAuthenticated: true 
        })
      },

      logout: async () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false,
          isLoading: false
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
