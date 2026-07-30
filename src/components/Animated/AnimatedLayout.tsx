import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from '@tanstack/react-router'

export function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      useAnimate
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1, delay: 4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
