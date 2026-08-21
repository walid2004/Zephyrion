import { useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

export function GradualSpacing({ text = 'Gradual Spacing' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      className="flex"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '2px 0 8px 0',
        padding: '0 8px',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}
    >
      <AnimatePresence>
        {text.split('').map((char, i) => (
          <motion.h2
            ref={ref}
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit="hidden"
            transition={{ duration: 0.5, delay: i * 0.03 }}
            style={{
              margin: 0,
              padding: 0,
              fontSize: 'clamp(0.85rem, 2.4vw, 1.35rem)',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#ffffff'
            }}
          >
            {char === ' ' ? <span>&nbsp;</span> : char}
          </motion.h2>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GradualSpacing;
