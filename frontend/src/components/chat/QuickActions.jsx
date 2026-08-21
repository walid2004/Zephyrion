import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/useTheme.js';
import ConfirmModal from '../common/ConfirmModal.jsx';
export default function QuickActions({
  onFinish,
  onSkip,
  onShowFilters,
  onRestart,
  criteriaCount = 0,
  isFinished = false
}) {
  const { dark: isOn } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const handleRestartClick = () => {
    setShowConfirm(true);
  };
  const handleConfirmRestart = () => {
    setShowConfirm(false);
    onRestart();
  };
  const handleCancelRestart = () => {
    setShowConfirm(false);
  };
  const buttonBase = {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.1s ease',
    outline: 'none',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const primaryStyle = {
    ...buttonBase,
    backgroundColor: isOn ? 'rgb(188, 116, 116)' : '#ffffff',
    color: isOn ? '#ffffff' : '#000000',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
  };
  const secondaryStyle = {
    ...buttonBase,
    backgroundColor: isOn ? '#ffffff' : '#000000',
    color: isOn ? '#000000' : '#ffffff',
    border: isOn ? '1px solid rgba(0, 0, 0, 0.15)' : '1px solid rgba(255, 255, 255, 0.35)'
  };
  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        title="Restart Conversation"
        message="Are you sure you want to restart?"
        confirmText="Yes, restart"
        cancelText="Cancel"
        onConfirm={handleConfirmRestart}
        onCancel={handleCancelRestart}
      />
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '6px',
          userSelect: 'none'
        }}
      >
        {!isFinished ? (
          <>
            <button
              type="button"
              style={primaryStyle}
              onClick={onFinish}
              title="Finish and search cars with selected filters"
            >
              Find Cars Now {criteriaCount > 0 ? `(${criteriaCount})` : ''}
            </button>
            <button
              type="button"
              style={secondaryStyle}
              onClick={onSkip}
              title="Skip this question"
            >
              Skip
            </button>
            {criteriaCount > 0 && (
              <button
                type="button"
                style={secondaryStyle}
                onClick={onShowFilters}
                title="Show summary of chosen filters"
              >
                My Filters
              </button>
            )}
            <button
              type="button"
              style={secondaryStyle}
              onClick={handleRestartClick}
              title="Restart search"
            >
              Restart
            </button>
          </>
        ) : (
          <button
            type="button"
            style={primaryStyle}
            onClick={handleRestartClick}
            title="Start a new search"
          >
            Start New Search
          </button>
        )}
      </motion.div>
    </>
  );
}
