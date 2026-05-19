'use client'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    present: { bg: 'bg-green-100', text: 'text-green-800' },
    absent: { bg: 'bg-gray-100', text: 'text-gray-800' },
    late: { bg: 'bg-orange-100', text: 'text-orange-800' },
    outside_office: { bg: 'bg-red-100', text: 'text-red-800' },
  }

  const config = statusConfig[status] || { bg: 'bg-slate-100', text: 'text-slate-800' }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 rounded-full text-xs',
    lg: 'px-4 py-2 rounded-lg text-sm',
  }

  return (
    <span className={`${config.bg} ${config.text} ${sizeClasses[size]} rounded-full font-medium`}>
      {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  )
}
