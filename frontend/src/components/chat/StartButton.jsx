import { motion } from 'framer-motion';
export default function StartButton({ onStart, isStarted = false }) {
  if (isStarted) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%'
      }}
    >
      <button
        type="button"
        className="startbutton"
        onClick={onStart}
        style={{
          width: '160px',
          height: '48px',
          fontSize: '20px',
          fontWeight: '700',
          borderRadius: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          margin: 0
        }}
      >
        Start now!
      </button>
    </motion.div>
  );
}
