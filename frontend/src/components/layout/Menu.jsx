import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose } from 'react-icons/io5';
import Navbar from './Navbar.jsx';
export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  return (
    <div
      className="menubutton"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: '30',
        color: 'white'
      }}
    >
      <div
        onClick={toggle}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <motion.div
          key={isOpen ? 'close' : 'menu'}
          initial={{ scale: 0.8, rotate: 0, opacity: 0 }}
          animate={{ scale: 1, rotate: isOpen ? 90 : 0, opacity: 1 }}
          exit={{ scale: 0.8, rotate: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'inline-block' }}
        >
          {isOpen ? <IoClose size={50} /> : <IoMenu size={50} />}
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ ease: 'backInOut', duration: 0.3 }}
            style={{ display: 'inline-block' }}
          >
            <Navbar onNavigate={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
