import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoIosSend } from 'react-icons/io';
import { useTheme } from '../../context/useTheme.js';
import QuickActions from './QuickActions.jsx';

const EXAMPLE_CARS = [
  'White Audi A4 Avant under 30k diesel',
  'Red Porsche 911 Coupe under 85k automatic',
  'Grey Volkswagen Golf GTI under 25k petrol',
  'Blue Mercedes-Benz C-Class under 35k automatic',
  'Black BMW X5 SUV under 45k hybrid',
  'Silver Tesla Model 3 under 32k electric',
  'Green Ford Mustang Convertible under 40k manual'
];

function getRandomExample() {
  const index = Math.floor(Math.random() * EXAMPLE_CARS.length);
  return EXAMPLE_CARS[index];
}

export default function ChatInput({
  onSendMessage,
  onFinish,
  onSkip,
  onShowFilters,
  onRestart,
  criteriaCount = 0,
  isFinished = false,
  isVisible = false
}) {
  const [inputValue, setInputValue] = useState('');
  const [placeholderExample, setPlaceholderExample] = useState(() => getRandomExample());
  const { isDark } = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setPlaceholderExample(getRandomExample());
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSendMessage(inputValue);
    setInputValue('');
    setPlaceholderExample(getRandomExample());
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        display: isVisible ? 'block' : 'none',
        maxWidth: '780px',
        width: '94%',
        margin: '6px auto 0 auto',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}
    >
      <QuickActions
        onFinish={onFinish}
        onSkip={onSkip}
        onShowFilters={onShowFilters}
        onRestart={onRestart}
        criteriaCount={criteriaCount}
        isFinished={isFinished}
      />

      <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type e.g. '${placeholderExample}'...`}
            className="input"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '24px',
              padding: '0 50px 0 18px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              outline: 'none',
              backgroundColor: '#ffffff',
              color: '#111111',
              boxSizing: 'border-box',
              boxShadow: '0 3px 12px rgba(0,0,0,0.2)'
            }}
            autoComplete="off"
            autoFocus
          />
          <button
            className="phew"
            type="submit"
            aria-label="Send message"
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'black' : 'rgb(188, 116, 116)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              padding: 0
            }}
          >
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1, 1.1],
                rotate: [0, -20, 0, -20, 0]
              }}
              transition={{
                ease: 'easeInOut',
                repeat: Infinity,
                duration: 8
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IoIosSend size={22} color="white" />
            </motion.div>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
