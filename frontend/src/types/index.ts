export interface User {
  id: string
  username: string
  email: string
  display_name: string
  bio: string | null
  profile_picture: string | null
  banner_image: string | null
  website: string | null
  location: string | null
  birth_date: string | null
  is_verified: boolean
  is_private: boolean
  followers_count: number
  following_count: number
  posts_count: number
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  content: string
  author: User
  media: Media[]
  likes_count: number
  reposts_count: number
  replies_count: number
  views_count: number
  is_liked: boolean
  is_reposted: boolean
  is_bookmarked: boolean
  is_pinned: boolean
  parent_post: Post | null
  quote_post: Post | null
  hashtags: Hashtag[]
  mentions: User[]
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  type: 'image' | 'video' | 'gif'
  url: string
  thumbnail_url: string | null
  alt_text: string | null
  width: number | null
  height: number | null
}

export interface Hashtag {
  id: string
  name: string
  posts_count: number
}

export interface Notification {
  id: string
  type: 'like' | 'repost' | 'reply' | 'mention' | 'follow' | 'quote'
  actor: User
  post?: Post
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  participants: User[]
  last_message: Message | null
  unread_count: number
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender: User
  content: string
  media: Media[]
  is_read: boolean
  created_at: string
}

export interface TrendingTopic {
  rank: number
  hashtag: string
  posts_count: number
  category: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  username: string
  email: string
  password: string
  display_name: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  pagination?: Pagination
}

export interface Pagination {
  count: number
  next: string | null
  previous: string | null
  current_page: number
  total_pages: number
}

export interface FeedType {
  type: 'for_you' | 'following' | 'trending'
  label: string
}
