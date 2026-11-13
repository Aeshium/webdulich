import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export type PageTransitionPhase = 'idle' | 'cover' | 'covered' | 'reveal'

type PageTransitionProps = {
  phase: PageTransitionPhase
  onCovered: () => void
  onRevealed: () => void
}

export default function PageTransition({
  phase,
  onCovered,
  onRevealed,
}: PageTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const callbacksRef = useRef({ onCovered, onRevealed })
  callbacksRef.current = { onCovered, onRevealed }

  useGSAP(
    () => {
      const curtains = gsap.utils.toArray<HTMLElement>(
        '.page-transition-curtain',
        rootRef.current,
      )

      if (phase === 'cover') {
        gsap.set(curtains, { xPercent: 101, yPercent: 0 })
        const timeline = gsap.timeline({
          onComplete: () => callbacksRef.current.onCovered(),
        })
        timeline.to(curtains, {
          xPercent: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.inOut',
        })
        return () => {
          timeline.kill()
        }
      }

      if (phase === 'reveal') {
        gsap.set(curtains, { xPercent: 0, yPercent: 0 })
        const timeline = gsap.timeline({
          onComplete: () => callbacksRef.current.onRevealed(),
        })
        timeline.to(curtains, {
          yPercent: -101,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.inOut',
        })
        return () => {
          timeline.kill()
        }
      }

      gsap.set(curtains, {
        xPercent: 0,
        yPercent: phase === 'covered' ? 0 : -101,
      })
    },
    { scope: rootRef, dependencies: [phase], revertOnUpdate: true },
  )

  return (
    <div
      ref={rootRef}
      className={`page-transition${phase === 'idle' ? '' : ' is-active'}`}
      aria-hidden="true"
    >
      <span className="page-transition-curtain" />
      <span className="page-transition-curtain" />
      <span className="page-transition-curtain" />
    </div>
  )
}
