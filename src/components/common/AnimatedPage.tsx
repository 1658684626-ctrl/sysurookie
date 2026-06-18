import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface AnimatedPageProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedPage({
  children,
  className,
  delay = 0,
}: AnimatedPageProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
