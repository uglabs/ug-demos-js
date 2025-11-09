import React, { useEffect, useState } from 'react'

export interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 500) // Wait for fade out animation
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500'

  return (
    <div
      className={`fixed top-5 left-5 text-white p-4 rounded-lg shadow-lg transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} ${
        bgColor
      }`}
    >
      {message}
    </div>
  )
}
