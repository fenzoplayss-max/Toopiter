import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '@services/index'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'
import { Button } from '@components/common'
import { validateEmail, validatePassword, validateUsername } from '@utils/helpers'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    display_name: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-30 characters, letters, numbers, and underscores only'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.errors[0]
      }
    }

    if (!formData.display_name) {
      newErrors.display_name = 'Display name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await authService.signUp(formData)
      await login(response.data)
      toast.success('Welcome to Toopiter!')
      navigate('/')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string; errors?: Record<string, string[]> } } }
      const message = err.response?.data?.detail || 'Sign up failed. Please try again.'
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        setErrors({ form: message })
      }
      
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-900">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <svg className="w-16 h-16 text-primary-600" viewBox="0 0 100 100" fill="currentColor">
              <path d="M75 25c-5-5-15-5-20 0l-5 5-5-5c-5-5-15-5-20 0s-5 15 0 20l25 25 25-25c5-5 5-15 0-20z" />
              <circle cx="35" cy="35" r="8" fill="white" />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
              Create your account
            </h2>
            <p className="text-dark-500 dark:text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Display Name
              </label>
              <input
                id="display_name"
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className={`input-field ${errors.display_name ? 'border-red-500' : ''}`}
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.display_name && (
                <p className="mt-1 text-sm text-red-500">{errors.display_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">@</span>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/\s/g, '') })}
                  className={`input-field pl-8 ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="johndoe"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-dark-500 dark:text-dark-400">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-xs text-dark-500 dark:text-dark-400 text-center">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
