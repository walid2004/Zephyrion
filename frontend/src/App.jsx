import { Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import { useTheme } from './context/useTheme.js';
import { useChat } from './hooks/useChat.js';
import Header from './components/layout/Header.jsx';
import GradualSpacing from './components/common/GradualSpacing.jsx';
import StartButton from './components/chat/StartButton.jsx';
import ChatInput from './components/chat/ChatInput.jsx';
import ChatContainer from './components/chat/ChatContainer.jsx';
import AboutPage from './components/pages/AboutPage.jsx';
import ContactPage from './components/pages/ContactPage.jsx';
import DocPage from './components/pages/DocPage.jsx';
function App() {
  const { dark: isOn } = useTheme();
  const {
    messages,
    started,
    criteriaCount,
    isFinished,
    startChat,
    sendMessage,
    finishSearch,
    skipQuestion,
    showFilters,
    restartChat
  } = useChat();
  return (
    <div
      className="rohi"
      style={{
        backgroundImage: isOn
          ? 'linear-gradient(160deg, rgb(219, 77, 77) 0%, #394d4b 100%)'
          : 'linear-gradient(160deg, #000000 0%, #394d4b 100%)',
        borderWidth: '0px',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        paddingBottom: '16px'
      }}
    >
      <Header />
      <h1 style={{ flexShrink: 0 }}>Zephyrion</h1>
      <GradualSpacing text="Picking your car was never easier!" />
      <Routes>
        <Route
          path="/"
          element={
            !started ? (
              <StartButton onStart={startChat} isStarted={started} />
            ) : (
              <>
                <ChatContainer messages={messages} />
                <ChatInput
                  onSendMessage={sendMessage}
                  onFinish={finishSearch}
                  onSkip={skipQuestion}
                  onShowFilters={showFilters}
                  onRestart={restartChat}
                  criteriaCount={criteriaCount}
                  isFinished={isFinished}
                  isVisible={started}
                />
              </>
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/documentation" element={<DocPage />} />
      </Routes>
    </div>
  );
}
export default App;
