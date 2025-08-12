import { Bot, Lock, Search, Send, X } from 'lucide-react';
import { useState } from 'react';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello!",
      sender: "other",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 2,
      text: "Can I try the software first?",
      sender: "other",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 3,
      text: "Sure. Here is the demo link. You can use it as long as you want.",
      sender: "user",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 4,
      text: "Thank you. Now I want to buy the software. Which type of subscription do you have?",
      sender: "other",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    }
  ]);

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      }]);
      setInputValue('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
      {/* AI Chat Icon Button */}
      <button onClick={toggleChat} style={{...styles.chatIconButton}} className="chatIconButton">
        <div style={styles.buttonInner} className="buttonInner">
          <Bot size={28} color="white" />
        </div>
        <div style={styles.ripple}></div>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div style={styles.chatPopup}>
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.logo}>
                <Bot size={18} color="white" />
                <span style={styles.logoText}>AI Assistant</span>
                <div style={styles.statusDot}></div>
              </div>
              <div style={styles.headerActions}>
                <button style={styles.headerButton}>
                  <Search size={14} color="white" />
                </button>
                <button style={styles.headerButton}>
                  <Lock size={14} color="white" />
                </button>
              </div>
            </div>
          </div>

          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div key={message.id} style={{
                ...styles.messageWrapper,
                ...(message.sender === 'user' ? styles.userMessageWrapper : styles.otherMessageWrapper)
              }}>
                {message.sender === 'other' && (
                  <img src={message.avatar} alt="Avatar" style={styles.avatar} />
                )}
                <div style={{
                  ...styles.message,
                  ...(message.sender === 'user' ? styles.userMessage : styles.otherMessage)
                }}>
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <img src={message.avatar} alt="Avatar" style={styles.avatar} />
                )}
              </div>
            ))}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendButton}>
              <Send size={16} color="white" />
            </button>
          </div>

          <div style={styles.bottomActions}>
            <button style={styles.actionButton}>
              <Bot size={20} color="white" />
            </button>
            <button onClick={toggleChat} style={styles.actionButton}>
              <X size={20} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  chatIconButton: {
    width: '70px',
    height: '70px',
    padding: '0',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  chatPopup: {
    position: 'absolute',
    bottom: '80px',
    right: '0',
    width: '350px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    padding: '15px 20px',
    color: 'white',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '18px',
  },
  logoText: {
    fontWeight: '600',
    fontSize: '16px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    marginLeft: '8px',
    animation: 'pulse-dot 2s infinite',
  },
  buttonInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    transition: 'transform 0.2s ease',
  },
  ripple: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translate(-50%, -50%) scale(0)',
    animation: 'ripple 2s infinite',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  headerButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: '#FAFAFA',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  otherMessageWrapper: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word',
  },
  userMessage: {
    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    color: 'white',
    borderBottomRightRadius: '6px',
  },
  otherMessage: {
    backgroundColor: 'white',
    color: '#333',
    borderBottomLeftRadius: '6px',
    border: '1px solid #E5E5E5',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderTop: '1px solid #E5E5E5',
  },
  input: {
    flex: 1,
    border: '1px solid #E0E0E0',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#F8F8F8',
    transition: 'border-color 0.2s',
  },
  sendButton: {
    width: '40px',
    height: '40px',
    padding: '0',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
    flexShrink: 0,
  },
  bottomActions: {
    backgroundColor: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    borderTop: '1px solid #E5E5E5',
  },
  actionButton: {
    width: '50px',
    height: '50px',
    padding: '0',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
};

// Add CSS animations for clean AI effects
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(4);
      opacity: 0;
    }
  }

  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  .chatIconButton:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 35px rgba(79, 70, 229, 0.5);
  }

  .chatIconButton:hover .buttonInner {
    transform: scale(1.1);
  }

  .chatIconButton:active {
    transform: translateY(0) scale(0.95);
  }

  input:focus {
    border-color: #4F46E5 !important;
  }
`;
document.head.appendChild(styleSheet);

export default ChatPopup;
