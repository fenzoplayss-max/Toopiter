import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnClickOutside } from '@hooks/index'
import { Button, Avatar } from '@components/common'
import { postService } from '@services/index'
import { useFeedStore, useAuthStore } from '@store/index'
import toast from 'react-hot-toast'

interface ComposeModalProps {
  onClose: () => void
  initialContent?: string
  replyTo?: { id: string; author: { username: string; display_name: string } }
}

export default function ComposeModal({ onClose, initialContent = '', replyTo }: ComposeModalProps) {
  const [content, setContent] = useState(initialContent)
  const [media, setMedia] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const maxLength = 280
  
  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()
  const { addPost } = useFeedStore()

  useOnClickOutside(modalRef, onClose)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setCharCount(newText.length)
    setContent(newText)
  }

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + media.length > 4) {
      toast.error('Maximum 4 media files allowed')
      return
    }

    const newMedia = [...media, ...files]
    setMedia(newMedia)

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setMediaPreviews([...mediaPreviews, ...newPreviews])
  }

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index])
    setMedia(media.filter((_, i) => i !== index))
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error('Please add some content or media')
      return
    }

    if (content.length > maxLength) {
      toast.error('Post is too long')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await postService.createPost(content, media, replyTo?.id)
      addPost(response.data)
      toast.success('Post created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="modal-content"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-100 dark:border-dark-800">
            <button onClick={onClose} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-bold">
              {replyTo ? 'Reply' : 'Create Post'}
            </h2>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="p-4">
            {replyTo && (
              <div className="mb-4 pb-4 border-b border-dark-100 dark:border-dark-800">
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  Replying to <span className="text-primary-500">@{replyTo.author.username}</span>
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Avatar src={user?.profile_picture} alt={user?.display_name || 'User'} size="md" />
              
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={handleTextChange}
                  placeholder="What's happening?"
                  className="w-full min-h-[120px] bg-transparent outline-none resize-none text-lg placeholder-dark-400"
                  autoFocus
                />

                {/* Media Previews */}
                {mediaPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Character Count */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={media.length >= 4}
                      className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-full transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-full transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {content.length > 0 && (
                      <div className={`text-sm ${charCount > maxLength ? 'text-red-500' : 'text-dark-400'}`}>
                        {charCount}/{maxLength}
                      </div>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={!content.trim() && media.length === 0}
                      isLoading={isSubmitting}
                      size="sm"
                    >
                      {replyTo ? 'Reply' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
