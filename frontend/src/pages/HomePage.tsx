import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postService, authService } from '@services/index'
import { useFeedStore, useAuthStore } from '@store/index'
import { PostCard, Button } from '@components/common'
import ComposeModal from '@components/modals/ComposeModal'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'for_you' | 'following'>('for_you')
  const { feedType, setFeedType, posts, hasMore, currentPage, incrementPage, setPosts, addPost, updatePost } = useFeedStore()
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false)

  // Sync local store tab with state
  useEffect(() => {
    if (feedType !== activeTab) {
      setFeedType(activeTab)
    }
  }, [])

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useQuery({
    queryKey: ['feed', activeTab],
    queryFn: ({ pageParam = 1 }) => postService.getFeed(activeTab, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.next) {
        return (lastPage.pagination?.current_page || 1) + 1
      }
      return undefined
    },
  })

  const likeMutation = useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) => 
      liked ? postService.unlike(id) : postService.like(id),
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] })
      
      const previousPosts = queryClient.getQueryData(['feed', activeTab])
      
      queryClient.setQueryData(['feed', activeTab], (old: unknown) => {
        if (!old) return old
        
        const typedOld = old as { pages?: Array<{ data?: Array<{ id: string; is_liked: boolean; likes_count: number }> }> }
        
        if (typedOld.pages) {
          return {
            ...typedOld,
            pages: typedOld.pages.map((page) => ({
              ...page,
              data: page.data?.map((post) => {
                if (post.id === id) {
                  return {
                    ...post,
                    is_liked: !liked,
                    likes_count: liked ? post.likes_count - 1 : post.likes_count + 1,
                  }
                }
                return post
              }),
            })),
          }
        }
        return old
      })
      
      return { previousPosts }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['feed', activeTab], context?.previousPosts)
      toast.error('Failed to like post')
    },
  })

  const repostMutation = useMutation({
    mutationFn: ({ id, reposted }: { id: string; reposted: boolean }) => 
      reposted ? postService.unrepost(id) : postService.repost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) => 
      bookmarked ? postService.unbookmark(id) : postService.bookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })

  const handleLike = (id: string) => {
    const post = posts.find((p) => p.id === id)
    likeMutation.mutate({ id, liked: post?.is_liked || false })
  }

  const handleRepost = (id: string) => {
    const post = posts.find((p) => p.id === id)
    repostMutation.mutate({ id, reposted: post?.is_reposted || false })
  }

  const handleBookmark = (id: string) => {
    const post = posts.find((p) => p.id === id)
    bookmarkMutation.mutate({ id, bookmarked: post?.is_bookmarked || false })
  }

  const handleReply = (post: typeof posts[0]) => {
    setIsComposeModalOpen(true)
  }

  // Flatten pages for rendering
  const allPosts = data?.pages.flatMap((page) => page.data || []) || []

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-dark-100 dark:border-dark-800">
        <h1 className="px-4 py-3 text-xl font-bold text-dark-900 dark:text-dark-50">Home</h1>
        <div className="flex">
          <button
            onClick={() => setActiveTab('for_you')}
            className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
              activeTab === 'for_you'
                ? 'text-dark-900 dark:text-dark-50'
                : 'text-dark-500 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'
            }`}
          >
            For you
            {activeTab === 'for_you' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
              activeTab === 'following'
                ? 'text-dark-900 dark:text-dark-50'
                : 'text-dark-500 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'
            }`}
          >
            Following
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary-600 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Compose Box */}
      {isAuthenticated && (
        <div className="p-4 border-b border-dark-100 dark:border-dark-800">
          <div className="flex gap-3">
            <Button
              onClick={() => setIsComposeModalOpen(true)}
              variant="primary"
              className="ml-auto"
            >
              Post
            </Button>
          </div>
        </div>
      )}

      {/* Feed */}
      <div>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : allPosts.length === 0 ? (
          <div className="p-8 text-center text-dark-500 dark:text-dark-400">
            <p className="text-lg mb-2">No posts yet</p>
            <p className="text-sm">Be the first to post something!</p>
          </div>
        ) : (
          <>
            {allPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onRepost={handleRepost}
                onReply={handleReply}
                onBookmark={handleBookmark}
              />
            ))}

            {hasNextPage && (
              <div className="p-4 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Compose Modal */}
      {isComposeModalOpen && (
        <ComposeModal onClose={() => setIsComposeModalOpen(false)} />
      )}
    </div>
  )
}
