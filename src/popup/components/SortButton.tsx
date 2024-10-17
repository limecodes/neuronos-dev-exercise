import { ReactNode } from 'react'

type SortButtonProps = {
  isSelected: boolean
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}

export default function SortButton({
  isSelected,
  disabled = false,
  children,
  onClick,
}: SortButtonProps) {
  const defaultStyle =
    'px-3 py-2 rounded bg-gray-200 text-black hover:bg-gray-300'
  const selectedStyle = 'px-3 py-2 rounded bg-blue-500 text-white'
  const disabledStyle =
    'px-3 py-2 rounded bg-gray-400 text-gray-500 cursor-not-allowed'

  return (
    <button
      disabled={disabled}
      className={`px-3 py-2 rounded ${
        disabled ? disabledStyle : isSelected ? selectedStyle : defaultStyle
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
