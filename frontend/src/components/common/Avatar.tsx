import { cn } from '@utils/helpers'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
}

export function Avatar({ src, alt, size = 'md', className, onClick }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const fallbackColor = 'bg-gradient-to-br from-primary-500 to-accent-500'

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex-shrink-0',
        sizes[size],
        className
      )}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center text-white font-semibold', fallbackColor)}>
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
