import { ReactNode } from 'react'

type SortButtonProps = {
  isSelected: boolean
  onClick: () => void
  children: ReactNode
}

export default function SortButton({
  isSelected,
  onClick,
  children,
}: SortButtonProps) {
  return (
    <button
      className={`px-3 py-2 rounded ${
        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
