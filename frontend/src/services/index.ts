import apiClient from './api'
import type { 
  User, 
  Post, 
  AuthTokens, 
  LoginCredentials, 
  SignUpData,
  Notification,
  Conversation,
  Message,
  TrendingTopic,
  ApiResponse,
  Pagination 
} from '@types/index'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login/', credentials)
    return response.data
  },

  signUp: async (data: SignUpData): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/signup/', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout/')
  },

  refreshToken: async (refresh: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/token/refresh/', { refresh })
    return response.data
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me/')
    return response.data
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password/reset/', { email })
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/password/reset/confirm/', { token, password: newPassword })
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email/', { token })
  },
}

export const userService = {
  getProfile: async (username: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${username}/`)
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>('/users/me/', data)
    return response.data
  },

  follow: async (username: string): Promise<ApiResponse<{ following: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ following: boolean }>>(`/users/${username}/follow/`)
    return response.data
  },

  unfollow: async (username: string): Promise<ApiResponse<{ following: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ following: boolean }>>(`/users/${username}/follow/`)
    return response.data
  },

  block: async (username: string): Promise<ApiResponse<{ blocked: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ blocked: boolean }>>(`/users/${username}/block/`)
    return response.data
  },

  unblock: async (username: string): Promise<ApiResponse<{ blocked: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ blocked: boolean }>>(`/users/${username}/block/`)
    return response.data
  },

  mute: async (username: string): Promise<ApiResponse<{ muted: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ muted: boolean }>>(`/users/${username}/mute/`)
    return response.data
  },

  unmute: async (username: string): Promise<ApiResponse<{ muted: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ muted: boolean }>>(`/users/${username}/mute/`)
    return response.data
  },

  searchUsers: async (query: string, page?: number): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users/search/', {
      params: { q: query, page },
    })
    return response.data
  },

  getFollowers: async (username: string, page?: number): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users/${username}/followers/`, {
      params: { page },
    })
    return response.data
  },

  getFollowing: async (username: string, page?: number): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users/${username}/following/`, {
      params: { page },
    })
    return response.data
  },
}

export const postService = {
  getFeed: async (feedType: 'for_you' | 'following' | 'trending', page?: number): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get<ApiResponse<Post[]>>(`/posts/feed/${feedType}/`, {
      params: { page },
    })
    return response.data
  },

  getPost: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}/`)
    return response.data
  },

  createPost: async (content: string, media?: File[], parentPostId?: string): Promise<ApiResponse<Post>> => {
    const formData = new FormData()
    formData.append('content', content)
    
    if (media && media.length > 0) {
      media.forEach((file) => formData.append('media', file))
    }
    
    if (parentPostId) {
      formData.append('parent_post', parentPostId)
    }

    const response = await apiClient.post<ApiResponse<Post>>('/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updatePost: async (id: string, content: string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/`, { content })
    return response.data
  },

  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/posts/${id}/`)
  },

  like: async (id: string): Promise<ApiResponse<{ liked: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ liked: boolean }>>(`/posts/${id}/like/`)
    return response.data
  },

  unlike: async (id: string): Promise<ApiResponse<{ liked: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ liked: boolean }>>(`/posts/${id}/like/`)
    return response.data
  },

  repost: async (id: string): Promise<ApiResponse<{ reposted: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ reposted: boolean }>>(`/posts/${id}/repost/`)
    return response.data
  },

  unrepost: async (id: string): Promise<ApiResponse<{ reposted: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ reposted: boolean }>>(`/posts/${id}/repost/`)
    return response.data
  },

  bookmark: async (id: string): Promise<ApiResponse<{ bookmarked: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ bookmarked: boolean }>>(`/posts/${id}/bookmark/`)
    return response.data
  },

  unbookmark: async (id: string): Promise<ApiResponse<{ bookmarked: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ bookmarked: boolean }>>(`/posts/${id}/bookmark/`)
    return response.data
  },

  pin: async (id: string): Promise<ApiResponse<{ pinned: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ pinned: boolean }>>(`/posts/${id}/pin/`)
    return response.data
  },

  unpin: async (id: string): Promise<ApiResponse<{ pinned: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ pinned: boolean }>>(`/posts/${id}/pin/`)
    return response.data
  },

  getReplies: async (id: string, page?: number): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get<ApiResponse<Post[]>>(`/posts/${id}/replies/`, {
      params: { page },
    })
    return response.data
  },

  searchPosts: async (query: string, page?: number): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get<ApiResponse<Post[]>>('/posts/search/', {
      params: { q: query, page },
    })
    return response.data
  },
}

export const notificationService = {
  getNotifications: async (page?: number): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications/', {
      params: { page },
    })
    return response.data
  },

  markAsRead: async (ids: string[]): Promise<void> => {
    await apiClient.post('/notifications/mark-read/', { ids })
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/mark-all-read/')
  },
}

export const conversationService = {
  getConversations: async (page?: number): Promise<ApiResponse<Conversation[]>> => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations/', {
      params: { page },
    })
    return response.data
  },

  getConversation: async (id: string): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get<ApiResponse<Message[]>>(`/conversations/${id}/messages/`)
    return response.data
  },

  sendMessage: async (participantIds: string[], content: string, media?: File[]): Promise<ApiResponse<Message>> => {
    const formData = new FormData()
    formData.append('content', content)
    participantIds.forEach((id) => formData.append('participant_ids', id))
    
    if (media && media.length > 0) {
      media.forEach((file) => formData.append('media', file))
    }

    const response = await apiClient.post<ApiResponse<Message>>('/conversations/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  sendReply: async (conversationId: string, content: string, media?: File[]): Promise<ApiResponse<Message>> => {
    const formData = new FormData()
    formData.append('content', content)
    
    if (media && media.length > 0) {
      media.forEach((file) => formData.append('media', file))
    }

    const response = await apiClient.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  markMessageAsRead: async (messageId: string): Promise<void> => {
    await apiClient.post(`/messages/${messageId}/mark-read/`)
  },
}

export const trendingService = {
  getTrendingTopics: async (): Promise<ApiResponse<TrendingTopic[]>> => {
    const response = await apiClient.get<ApiResponse<TrendingTopic[]>>('/trending/')
    return response.data
  },
}

export const uploadService = {
  uploadMedia: async (files: File[]): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await apiClient.post<ApiResponse<{ urls: string[] }>>('/upload/media/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
