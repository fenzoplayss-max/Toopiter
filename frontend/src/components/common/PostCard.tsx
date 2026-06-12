import { cn, formatNumber, formatDate } from '@utils/helpers'
import { Avatar } from './Avatar'
import type { Post } from '@types/index'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface PostCardProps {
  post: Post
  onLike?: (id: string) => void
  onRepost?: (id: string) => void
  onReply?: (post: Post) => void
  onBookmark?: (id: string) => void
  onDelete?: (id: string) => void
  showParent?: boolean
}

export function PostCard({
  post,
  onLike,
  onRepost,
  onReply,
  onBookmark,
  onDelete,
  showParent = true,
}: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleLike = () => {
    onLike?.(post.id)
  }

  const handleRepost = () => {
    onRepost?.(post.id)
  }

  const handleBookmark = () => {
    onBookmark?.(post.id)
  }

  return (
    <motion.article
      className="card p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar
          src={post.author.profile_picture}
          alt={post.author.display_name}
          size="md"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-dark-900 dark:text-dark-50 truncate">
                {post.author.display_name}
              </span>
              {post.author.is_verified && (
                <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-dark-500 dark:text-dark-400 truncate">
                @{post.author.username}
              </span>
              <span className="text-dark-400 dark:text-dark-500">·</span>
              <span className="text-dark-500 dark:text-dark-400 text-sm">
                {formatDate(post.created_at)}
              </span>
            </div>

            {/* Delete button (only for own posts) */}
            {onDelete && isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(post.id)
                }}
                className="text-dark-400 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Parent post reference */}
          {showParent && post.parent_post && (
            <div className="mt-2 mb-2 text-sm text-dark-500 dark:text-dark-400">
              Replying to{' '}
              <span className="text-primary-500 hover:underline">
                @{post.parent_post.author.username}
              </span>
            </div>
          )}

          {/* Post content */}
          <p className="mt-1 text-dark-900 dark:text-dark-50 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Media */}
          {post.media.length > 0 && (
            <div className="mt-3 rounded-2xl overflow-hidden">
              {post.media.length === 1 ? (
                <img
                  src={post.media[0].url}
                  alt={post.media[0].alt_text || 'Post media'}
                  className="w-full max-h-96 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {post.media.slice(0, 4).map((media, index) => (
                    <img
                      key={media.id}
                      src={media.url}
                      alt={media.alt_text || `Media ${index + 1}`}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between max-w-md">
            {/* Reply */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReply?.(post)
              }}
              className="flex items-center gap-2 text-dark-500 dark:text-dark-400 hover:text-accent-500 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-accent-500/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm">{formatNumber(post.replies_count)}</span>
            </button>

            {/* Repost */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRepost()
              }}
              className={cn(
                'flex items-center gap-2 transition-colors group',
                post.is_reposted 
                  ? 'text-green-500' 
                  : 'text-dark-500 dark:text-dark-400 hover:text-green-500'
              )}
            >
              <div className={cn(
                'p-2 rounded-full transition-colors',
                post.is_reposted ? '' : 'group-hover:bg-green-500/10'
              )}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-sm">{formatNumber(post.reposts_count)}</span>
            </button>

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleLike()
              }}
              className={cn(
                'flex items-center gap-2 transition-colors group',
                post.is_liked 
                  ? 'text-red-500' 
                  : 'text-dark-500 dark:text-dark-400 hover:text-red-500'
              )}
            >
              <div className={cn(
                'p-2 rounded-full transition-colors',
                post.is_liked ? '' : 'group-hover:bg-red-500/10'
              )}>
                {post.is_liked ? (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </div>
              <span className="text-sm">{formatNumber(post.likes_count)}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleBookmark()
              }}
              className={cn(
                'flex items-center gap-2 transition-colors group',
                post.is_bookmarked 
                  ? 'text-primary-500' 
                  : 'text-dark-500 dark:text-dark-400 hover:text-primary-500'
              )}
            >
              <div className={cn(
                'p-2 rounded-full transition-colors',
                post.is_bookmarked ? '' : 'group-hover:bg-primary-500/10'
              )}>
                {post.is_bookmarked ? (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Share */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Share functionality
              }}
              className="flex items-center gap-2 text-dark-500 dark:text-dark-400 hover:text-primary-500 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-primary-500/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
