import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/useTheme.js';
export default function ContactPage() {
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
        padding: '24px 28px',
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
      <div style={{ margin: '0 0 20px 0', fontSize: '16px', lineHeight: '1.8', fontWeight: '500' }}>
        <p style={{ margin: '6px 0' }}>
          <strong>Email:</strong>{' '}
          <a
            href="mailto:lodaragab@gmail.com"
            style={{ color: isOn ? '#004488' : '#1edefe', textDecoration: 'underline' }}
          >
            lodaragab@gmail.com
          </a>
        </p>
        <p style={{ margin: '6px 0' }}>
          <strong>GitHub:</strong>{' '}
          <a
            href="https://github.com/walid2004/Zephyrion"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: isOn ? '#004488' : '#1edefe', textDecoration: 'underline', wordBreak: 'break-all' }}
          >
            https://github.com/walid2004/Zephyrion
          </a>
        </p>
        <p style={{ margin: '6px 0' }}>
          <strong>Location:</strong> Deggendorf, Germany
        </p>
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
