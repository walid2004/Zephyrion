import { motion } from 'framer-motion';
import { useTheme } from '../../context/useTheme.js';
export default function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      className="modeswtich"
      type="button"
      aria-label="Toggle Light and Dark Mode"
      style={{
        position: 'relative',
        justifyContent: isDark ? 'flex-end' : 'flex-start',
        width: 66,
        height: 32,
        borderRadius: 50,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.25)',
        boxSizing: 'border-box'
      }}
      onClick={toggleTheme}
    >
      <motion.div
        style={{
          height: 26,
          width: 26,
          borderRadius: '50%',
          backgroundColor: isDark ? '#ffffff' : '#1edefe',
          borderWidth: 0
        }}
        layout
        transition={{
          type: 'spring',
          duration: 0.3,
          bounce: 0.25
        }}
      />
    </button>
  );
}
