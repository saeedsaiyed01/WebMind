import React, { useEffect, useRef, useState } from "react";
import { onSendMessage as sendChatMessage } from "../../services/userServices";
import styles from "./AiChatModal.module.css";

interface CreditsData {
  credits: number;
  plan: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface LLMChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  initialMessages?: Message[];
}

const LLMChatModal: React.FC<LLMChatModalProps> = ({
  isOpen,
  onClose,
  contentId,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [hasCheckedCredits, setHasCheckedCredits] = useState(false);
  const [showLowCreditsWarning, setShowLowCreditsWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Enhanced outside click handler with better accessibility
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    
    if (isOpen) {
      // Add slight delay to prevent immediate close on first click
      setTimeout(() => {
        document.addEventListener("mousedown", handleOutsideClick);
      }, 100);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Enhanced scroll behavior for mobile
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  }, [messages]);

  // Enhanced focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      fetchCredits();
    }
  }, [isOpen]);

  // Fetch user credits
  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/plan`, {
        headers: { 'Authorization': `${token}` }
      });

      if (response.ok) {
        const data: CreditsData = await response.json();
        setCredits(data.credits);
        setHasCheckedCredits(true);

        // Show appropriate warnings based on credit level
        if (data.credits <= 0) {
          setShowNoCredits(true);
          setShowLowCreditsWarning(false);
        } else if (data.credits < 1) {
          setShowLowCreditsWarning(true);
          setShowNoCredits(false);
        } else {
          setShowLowCreditsWarning(false);
          setShowNoCredits(false);
        }
      } else {
        console.error('Failed to fetch credits - response not ok:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  // Enhanced Escape key handling
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    // Check if we've checked credits and user has none
    if (hasCheckedCredits && credits !== null && credits <= 0) {
      setShowNoCredits(true);
      setShowLowCreditsWarning(false);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage.content, contentId);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Deduct credits after successful message
      if (credits !== null) {
        const newCredits = credits - 1;
        setCredits(newCredits);

        // Update warnings based on new credit count
        if (newCredits <= 0) {
          setShowNoCredits(true);
          setShowLowCreditsWarning(false);
        } else if (newCredits < 1) {
          setShowLowCreditsWarning(true);
          setShowNoCredits(false);
        } else {
          setShowLowCreditsWarning(false);
          setShowNoCredits(false);
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I couldn't process your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const canSendMessage = input.trim() !== "" && !isLoading && !(hasCheckedCredits && credits !== null && credits <= 0);
  const isSendButtonDisabled = !canSendMessage;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="chat-modal-title">
      {/* Enhanced backdrop with better blur */}
      <div 
        className={styles.backdrop}
        aria-hidden="true"
      />

      {/* Chat modal container */}
      <div
        ref={modalRef}
        className={styles.modalContainer}
        role="document"
        tabIndex={-1}
      >
        {/* Enhanced Header with better accessibility */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.statusIndicator} aria-label="AI Chat Status"></div>
            <h3 id="chat-modal-title" className={styles.headerTitle}>AI Chat</h3>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close chat modal"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Enhanced Messages container with proper accessibility */}
        <div 
          className={styles.messagesContainer}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {showNoCredits ? (
            <div className={styles.noCreditsState}>
              <h2 className={styles.noCreditsTitle}>No Credits Remaining</h2>
              <p className={styles.noCreditsText}>
                Upgrade your plan to continue chatting
              </p>
              <button
                onClick={() => window.location.href = '/pricing'}
                className={styles.upgradeButton}
                type="button"
                aria-describedby="upgrade-description"
              >
                Upgrade Now
              </button>
            </div>
          ) : messages.length === 0 && !isLoading ? (
            <div className={styles.emptyState} role="status" aria-live="polite">
              <p>Ask me anything...</p>
            </div>
          ) : (
            <>
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${
                    message.sender === "user" ? styles.messageRowUser : styles.messageRowAi
                  }`}
                  role="article"
                  aria-label={`${message.sender === 'user' ? 'Your message' : 'AI response'}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.sender === "user" ? styles.messageBubbleUser : styles.messageBubbleAi
                    }`}
                  >
                    <div className={styles.messageContent}>{message.content}</div>
                    <div
                      className={`${styles.messageTimestamp} ${
                        message.sender === "user" ? styles.timestampUser : styles.timestampAi
                      }`}
                      aria-label={`Sent at ${message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Enhanced Loading animation with accessibility */}
              {isLoading && (
                <div className={styles.messageRow} role="status" aria-live="polite" aria-label="AI is typing">
                  <div className={`${styles.messageBubble} ${styles.messageBubbleAi} ${styles.loadingBubble}`}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Enhanced Input area with better accessibility */}
        <div className={styles.inputArea}>
          {/* Enhanced No credits warning banner */}
          {hasCheckedCredits && credits !== null && credits <= 0 && (
            <div className={`${styles.warningBanner} ${styles.noCreditsWarning}`} role="alert">
              <div className={styles.warningContent}>
                <svg 
                  className={styles.warningIcon} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
                <span className={styles.warningText}>No credits remaining</span>
              </div>
              <button
                onClick={() => window.location.href = '/pricing'}
                className={styles.warningLink}
                type="button"
                aria-label="Upgrade plan to continue chatting"
              >
                Upgrade Plan
              </button>
            </div>
          )}

          <div className={styles.inputRow}>
            <div className={styles.textareaWrapper}>
              <textarea
                ref={inputRef}
                className={styles.textarea}
                placeholder={
                  hasCheckedCredits && credits !== null && credits <= 0
                    ? "Upgrade your plan to continue chatting..."
                    : "Type your message..."
                }
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label="Message input"
                aria-describedby="input-help"
                aria-required="true"
                disabled={hasCheckedCredits && credits !== null && credits <= 0}
              />
            </div>
            <div className={styles.inputActions}>
              {/* Low credits warning */}
              {showLowCreditsWarning && (
                <div className={styles.lowCreditsBadge} role="status" aria-live="polite">
                  Low credits!
                </div>
              )}
              <button
                className={`${styles.sendButton} ${
                  isSendButtonDisabled
                    ? styles.sendButtonDisabled
                    : showLowCreditsWarning
                      ? styles.sendButtonWarning
                      : styles.sendButtonActive
                }`}
                onClick={handleSendMessage}
                disabled={isSendButtonDisabled}
                type="button"
                aria-label="Send message"
                aria-disabled={isSendButtonDisabled}
              >
                <svg
                  className={styles.sendIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMChatModal;
