import { create } from 'zustand'
import type { Post, User } from '@types/index'

interface ThemeState {
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: true,
  
  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      return { isDarkMode: newMode }
    })
  },
  
  setTheme: (isDark: boolean) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    set({ isDarkMode: isDark })
  },
}))

// Initialize theme on load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
}

interface FeedState {
  feedType: 'for_you' | 'following' | 'trending'
  posts: Post[]
  hasMore: boolean
  currentPage: number
  setFeedType: (type: 'for_you' | 'following' | 'trending') => void
  addPost: (post: Post) => void
  updatePost: (id: string, updates: Partial<Post>) => void
  removePost: (id: string) => void
  resetFeed: () => void
  incrementPage: () => void
  setPosts: (posts: Post[], hasMore: boolean) => void
}

export const useFeedStore = create<FeedState>((set) => ({
  feedType: 'for_you',
  posts: [],
  hasMore: true,
  currentPage: 1,
  
  setFeedType: (type) => set({ feedType: type, posts: [], currentPage: 1, hasMore: true }),
  
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map((post) => 
      post.id === id ? { ...post, ...updates } : post
    )
  })),
  
  removePost: (id) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== id)
  })),
  
  resetFeed: () => set({ posts: [], currentPage: 1, hasMore: true }),
  
  incrementPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
  
  setPosts: (posts, hasMore) => set((state) => ({
    posts: state.currentPage === 1 ? posts : [...state.posts, ...posts],
    hasMore
  })),
}))

interface NotificationState {
  unreadCount: number
  setUnreadCount: (count: number) => void
  incrementUnread: () => void
  decrementUnread: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
}))

interface ModalState {
  isComposeModalOpen: boolean
  isProfileModalOpen: boolean
  selectedUser: User | null
  openComposeModal: () => void
  closeComposeModal: () => void
  openProfileModal: (user: User) => void
  closeProfileModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isComposeModalOpen: false,
  isProfileModalOpen: false,
  selectedUser: null,
  
  openComposeModal: () => set({ isComposeModalOpen: true }),
  closeComposeModal: () => set({ isComposeModalOpen: false }),
  
  openProfileModal: (user) => set({ isProfileModalOpen: true, selectedUser: user }),
  closeProfileModal: () => set({ isProfileModalOpen: false, selectedUser: null }),
}))
