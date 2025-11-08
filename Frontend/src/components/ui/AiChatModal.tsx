import React, { useEffect, useRef, useState } from "react";
import { onSendMessage as sendChatMessage } from "../../services/userServices";

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

  // Handle outside click to close the modal
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
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus the textarea on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
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
        console.log('Chat modal credits:', data.credits, 'Plan:', data.plan);
        setCredits(data.credits);
        setHasCheckedCredits(true);

        // Show appropriate warnings based on credit level
        if (data.credits <= 0) {
          setShowNoCredits(true);
          setShowLowCreditsWarning(false);
          console.log('Showing no credits warning');
        } else if (data.credits < 1) {
          setShowLowCreditsWarning(true);
          setShowNoCredits(false);
          console.log('Showing low credits warning');
        } else {
          setShowLowCreditsWarning(false);
          setShowNoCredits(false);
          console.log('No warnings needed');
        }
      } else {
        console.error('Failed to fetch credits - response not ok:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Chat modal container */}
      <div
        ref={modalRef}
        className="
          relative z-10
          w-full max-w-2xl
          h-[80vh] md:h-[600px]
          flex flex-col
          rounded-2xl
          shadow-2xl
          border border-purple-500
          bg-[#0A0A0B]
          text-white
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-600 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
            <h3 className="font-semibold text-xl">AI Chat</h3>
          </div>
          <button
            onClick={onClose}
            className="text-purple-500 hover:purple-500 focus:outline-none"
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
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {showNoCredits ? (
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-2">No Credits Remaining</h2>
              <p className="text-gray-400 mb-4">Upgrade your plan to continue chatting</p>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          ) : messages.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <p>Ask me anything...</p>
            </div>
          ) : (
            <>
              {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[75%] rounded-lg px-3 py-2 text-sm
                  ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }
                `}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-purple-200"
                      : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading animation */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg px-3 py-2 bg-gray-800 text-white rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

            
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-purple-500 rounded-b-2xl">
          {/* Upgrade banner for no credits */}
          {hasCheckedCredits && credits !== null && credits <= 0 && (
            <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-300 text-sm font-medium">No credits remaining</span>
                </div>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="text-red-300 hover:text-red-200 text-sm font-medium underline"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end">
            <textarea
              ref={inputRef}
              className="
                flex-1 bg-gray-800 text-white
                rounded-lg px-3 py-2
                focus:outline-none
                focus:ring-2 focus:ring-purple-500
                resize-none text-sm
              "
              placeholder={
                hasCheckedCredits && credits !== null && credits <= 0
                  ? "Upgrade your plan to continue chatting..."
                  : "Type your message..."
              }
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ minHeight: "36px", maxHeight: "100px" }}
              disabled={hasCheckedCredits && credits !== null && credits <= 0}
            />
            <div className="flex items-center ml-2">
              {/* Low credits warning */}
              {showLowCreditsWarning && (
                <div className="mr-2 px-2 py-1 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
                  Low credits!
                </div>
              )}
              <button
                className={`
                  p-2 rounded-lg flex items-center justify-center
                  ${
                    input.trim() === "" || isLoading || (hasCheckedCredits && credits !== null && credits <= 0)
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : showLowCreditsWarning
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-purple-400 text-white hover:bg-purple-500"
                  }
                `}
                onClick={handleSendMessage}
                disabled={input.trim() === "" || isLoading || (hasCheckedCredits && credits !== null && credits <= 0)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
