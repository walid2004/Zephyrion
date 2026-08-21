import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/useTheme.js';
export default function ConfirmModal({
  isOpen = false,
  message = 'Are you sure you want to restart?',
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel
}) {
  const { dark: isOn } = useTheme();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            padding: '16px'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '360px',
              width: '90%',
              backgroundImage: isOn
                ? 'linear-gradient(160deg, rgb(199, 132, 132) 0%, rgb(182, 235, 239) 100%)'
                : 'linear-gradient(160deg, #2e3539 0%, #000000 100%)',
              color: isOn ? '#000000' : '#ffffff',
              borderRadius: '20px',
              padding: '20px 24px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              border: isOn ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}
          >
            <p style={{ margin: '0 0 18px 0', fontSize: '17px', fontWeight: '600', lineHeight: '1.4' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: isOn ? '1px solid rgba(0,0,0,0.3)' : '1px solid rgba(255,255,255,0.4)',
                  backgroundColor: isOn ? '#ffffff' : '#000000',
                  color: isOn ? '#000000' : '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: isOn ? 'rgb(188, 116, 116)' : '#ffffff',
                  color: isOn ? '#ffffff' : '#000000',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
