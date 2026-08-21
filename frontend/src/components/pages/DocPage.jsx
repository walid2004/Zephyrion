import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/useTheme.js';
export default function DocPage() {
  const { dark: isOn } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.25 }}
      style={{
        maxWidth: '520px',
        width: '90%',
        margin: '30px auto',
        padding: '22px 28px',
        borderRadius: '20px',
        backgroundImage: isOn
          ? 'linear-gradient(160deg, rgb(199, 132, 132) 0%, rgb(182, 235, 239) 100%)'
          : 'linear-gradient(160deg, #364d5a 0%, #050404 100%)',
        color: isOn ? '#000000' : '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        border: isOn ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px 0', fontWeight: '500', textAlign: 'left' }}>
        <p style={{ margin: '4px 0' }}>• Answer questions step-by-step or type your full preference in one sentence.</p>
        <p style={{ margin: '4px 0' }}>• Click &apos;Find Cars Now&apos; or type &apos;finish&apos; anytime to see live matches.</p>
        <p style={{ margin: '4px 0' }}>• Type &apos;skip&apos; to pass, &apos;status&apos; for filters, or &apos;restart&apos; to reset.</p>
      </div>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '8px 24px',
          borderRadius: '20px',
          backgroundColor: isOn ? '#ffffff' : '#000000',
          color: isOn ? '#000000' : '#ffffff',
          border: isOn ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.4)',
          fontWeight: '600',
          fontSize: '15px',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        Back
      </Link>
    </motion.div>
  );
}
