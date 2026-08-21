import { useState, useEffect, useCallback, useRef } from 'react';
import socket from '../services/socket.js';
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useEffect(() => {
    const handleResponse = (msg) => {
      setIsLoading(false);
      if (!msg) return;
      const responseText = msg.l || '';
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), sender: 'server', text: responseText }
      ]);
      if (msg.toparse && typeof msg.toparse === 'object') {
        setAnswers(msg.toparse);
      }
      if (typeof msg.isFinished === 'boolean') {
        setIsFinished(msg.isFinished);
      }
      if (typeof msg.phase === 'number') {
        setPhase(msg.phase);
      }
    };
    socket.on('response', handleResponse);
    return () => {
      socket.off('response', handleResponse);
    };
  }, []);
  const startChat = useCallback(() => {
    setStarted(true);
    setIsFinished(false);
    setAnswers({});
    setMessages([]);
    setIsLoading(true);
    socket.emit('chat', {
      message: 'xx_starting_xx',
      phase: 0,
      finaaal: {}
    });
  }, []);
  const sendMessage = useCallback((text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender: 'user', text: trimmed }
    ]);
    setIsLoading(true);
    socket.emit('chat', {
      message: trimmed,
      phase: phaseRef.current,
      finaaal: answersRef.current
    });
  }, []);
  const finishSearch = useCallback(() => {
    sendMessage('finish');
  }, [sendMessage]);
  const skipQuestion = useCallback(() => {
    sendMessage('skip');
  }, [sendMessage]);
  const showFilters = useCallback(() => {
    sendMessage('status');
  }, [sendMessage]);
  const restartChat = useCallback(() => {
    setIsFinished(false);
    setMessages([]);
    setAnswers({});
    setPhase(0);
    setIsLoading(true);
    socket.emit('chat', {
      message: 'xx_starting_xx',
      phase: 0,
      finaaal: {}
    });
  }, []);
  const criteriaCount = Object.keys(answers).length;
  return {
    messages,
    phase,
    started,
    answers,
    criteriaCount,
    isLoading,
    isFinished,
    startChat,
    sendMessage,
    finishSearch,
    skipQuestion,
    showFilters,
    restartChat
  };
}
