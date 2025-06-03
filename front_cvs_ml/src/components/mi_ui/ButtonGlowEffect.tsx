
import type React from "react"
import { useState, useRef } from "react"
import { Button } from "../ui/button"

interface ButtonGlowEffectProps extends React.ComponentProps<typeof Button> {
  glowColor?: string
}

export const ButtonGlowEffect: React.FC<ButtonGlowEffectProps> = ({
  children,
  glowColor = "rgba(138, 112, 255, 0.6)",
  className = "",
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()

    // Calculate position relative to the button
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <Button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
    </Button>
  )
}
