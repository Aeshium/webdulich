import { type PointerEvent, type ReactNode, useRef } from 'react'

export default function ImageMotion({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const elementRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    const element = elementRef.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const offsetX = (x / bounds.width - 0.5) * 18
    const offsetY = (y / bounds.height - 0.5) * 18
    element.style.setProperty('--pointer-x', `${offsetX.toFixed(1)}px`)
    element.style.setProperty('--pointer-y', `${offsetY.toFixed(1)}px`)
    element.style.setProperty('--pointer-glow-x', `${(x / bounds.width) * 100}%`)
    element.style.setProperty('--pointer-glow-y', `${(y / bounds.height) * 100}%`)
  }

  function handlePointerLeave() {
    const element = elementRef.current
    if (!element) return
    element.style.setProperty('--pointer-x', '0px')
    element.style.setProperty('--pointer-y', '0px')
  }

  return (
    <div
      ref={elementRef}
      className={`image-motion ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  )
}
