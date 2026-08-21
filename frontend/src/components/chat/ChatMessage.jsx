import { motion } from 'framer-motion';
import { useTheme } from '../../context/useTheme.js';

function renderTextWithLinks(text, isDark) {
  if (typeof text !== 'string') return text;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isDark ? '#1edefe' : '#0055aa',
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }}
        >
          {part.length > 40 ? `${part.slice(0, 37)}...` : part}
        </a>
      );
    }
    return part;
  });
}

export default function ChatMessage({ message, sender = 'user' }) {
  const { dark: isOn } = useTheme();
  const isUser = sender === 'user';

  const userStyle = {
    color: isOn ? 'black' : 'white',
    width: 'fit-content',
    maxWidth: '88%',
    flexShrink: 0,
    alignSelf: 'flex-end',
    zIndex: 10,
    backgroundColor: '#ffffff',
    backgroundImage: isOn
      ? 'linear-gradient(160deg, rgb(188, 204, 214) 0%, rgb(255, 255, 255) 100%)'
      : 'linear-gradient(160deg, #364d5a 0%, #050404 100%)',
    position: 'relative',
    padding: '10px 15px',
    borderRadius: '20px 20px 0px 20px',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.45',
    fontSize: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  const botStyle = {
    color: isOn ? 'black' : 'white',
    width: 'fit-content',
    maxWidth: '88%',
    flexShrink: 0,
    alignSelf: 'flex-start',
    zIndex: 10,
    backgroundColor: '#ffffff',
    backgroundImage: isOn
      ? 'linear-gradient(160deg, rgb(199, 132, 132) 0%, rgb(182, 235, 239) 100%)'
      : 'linear-gradient(160deg, #2e3539 0%, #000000 100%)',
    position: 'relative',
    padding: '10px 15px',
    borderRadius: '20px 20px 20px 0px',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.45',
    fontSize: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  return (
    <motion.div
      className={isUser ? 'message' : 'rmessage'}
      style={isUser ? userStyle : botStyle}
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
    >
      <p style={{ margin: 0 }}>
        {renderTextWithLinks(message, !isOn)}
      </p>
    </motion.div>
  );
}
