import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore, useThemeStore, useNotificationStore } from '@store/index'
import { Avatar, Button } from '@components/common'
import ComposeModal from '@components/modals/ComposeModal'

export default function Layout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  const { unreadCount } = useNotificationStore()
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/explore', label: 'Explore', icon: ExploreIcon },
    { path: '/notifications', label: 'Notifications', icon: NotificationsIcon, badge: unreadCount > 0 },
    { path: '/messages', label: 'Messages', icon: MessagesIcon },
    { path: `/profile/${user?.username}`, label: 'Profile', icon: ProfileIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-20 lg:w-72 flex-col h-screen sticky top-0 border-r border-dark-100 dark:border-dark-800 p-4">
          {/* Logo */}
          <Link to="/" className="p-3 mb-4 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-full w-fit transition-colors">
            <svg className="w-8 h-8 text-primary-600" viewBox="0 0 100 100" fill="currentColor">
              <path d="M75 25c-5-5-15-5-20 0l-5 5-5-5c-5-5-15-5-20 0s-5 15 0 20l25 25 25-25c5-5 5-15 0-20z" />
              <circle cx="35" cy="35" r="8" fill="white" />
            </svg>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'font-bold text-dark-900 dark:text-dark-50'
                      : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-7 h-7" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:block text-lg">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Compose Button */}
          <Button
            onClick={() => setIsComposeModalOpen(true)}
            className="w-full mt-4 hidden lg:block"
            size="lg"
          >
            Post
          </Button>
          <button
            onClick={() => setIsComposeModalOpen(true)}
            className="lg:hidden mt-4 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* User Menu */}
          <div className="mt-auto pt-4 border-t border-dark-100 dark:border-dark-800">
            <button className="flex items-center gap-3 p-3 w-full hover:bg-dark-100 dark:hover:bg-dark-800 rounded-full transition-colors">
              <Avatar src={user?.profile_picture} alt={user?.display_name || 'User'} size="md" />
              <div className="hidden lg:block text-left flex-1 min-w-0">
                <p className="font-semibold text-dark-900 dark:text-dark-50 truncate">{user?.display_name}</p>
                <p className="text-sm text-dark-500 dark:text-dark-400 truncate">@{user?.username}</p>
              </div>
              <svg className="w-5 h-5 text-dark-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen border-r border-dark-100 dark:border-dark-800 max-w-2xl">
          <Outlet />
        </main>

        {/* Right Sidebar - Desktop */}
        <aside className="hidden xl:block xl:w-80 2xl:w-96 h-screen sticky top-0 p-4 overflow-y-auto">
          {/* Search */}
          <div className="sticky top-0 bg-white dark:bg-dark-900 pb-4 z-10">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search Toopiter"
                className="w-full pl-12 pr-4 py-3 bg-dark-50 dark:bg-dark-800 border border-transparent focus:border-primary-500 rounded-full outline-none transition-colors"
              />
            </div>
          </div>

          {/* Trending */}
          <div className="card p-4 mb-4">
            <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">Trending for you</h2>
            <div className="space-y-4">
              {[
                { tag: '#Technology', posts: '125K' },
                { tag: '#AI', posts: '89K' },
                { tag: '#WebDevelopment', posts: '56K' },
                { tag: '#Python', posts: '42K' },
                { tag: '#React', posts: '38K' },
              ].map((topic, i) => (
                <div key={i} className="hover:bg-dark-50 dark:hover:bg-dark-800 -mx-2 px-2 py-2 rounded-lg cursor-pointer transition-colors">
                  <p className="text-xs text-dark-500 dark:text-dark-400">Trending</p>
                  <p className="font-bold text-dark-900 dark:text-dark-50">{topic.tag}</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">{topic.posts} posts</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
              Show more
            </button>
          </div>

          {/* Who to follow */}
          <div className="card p-4">
            <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">Who to follow</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-900 dark:text-dark-50 truncate">User {i}</p>
                    <p className="text-sm text-dark-500 dark:text-dark-400 truncate">@user{i}</p>
                  </div>
                  <Button variant="secondary" size="sm">Follow</Button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 flex justify-around py-2 z-50">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative p-3 ${isActive ? 'text-primary-600' : 'text-dark-500 dark:text-dark-400'}`}
              >
                <Icon className="w-6 h-6" />
                {item.badge && unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-primary-600 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Compose Modal */}
      {isComposeModalOpen && (
        <ComposeModal onClose={() => setIsComposeModalOpen(false)} />
      )}
    </div>
  )
}

// Icons
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function ExploreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function NotificationsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function MessagesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
