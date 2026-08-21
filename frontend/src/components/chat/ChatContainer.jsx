import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';
export default function ChatContainer({ messages = [] }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [messages]);
  if (!messages || messages.length === 0) {
    return null;
  }
  return (
    <div
      className="mfcontainer"
      ref={containerRef}
      style={{
        flex: '1 1 0%',
        minHeight: 0,
        maxWidth: '780px',
        width: '90%',
        margin: '8px auto 0 auto',
        padding: '12px 20px 12px 10px',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box'
      }}
    >
      {messages.map((item, index) => (
        <ChatMessage
          key={item.id || index}
          message={item.text}
          sender={item.sender}
        />
      ))}
    </div>
  );
}
