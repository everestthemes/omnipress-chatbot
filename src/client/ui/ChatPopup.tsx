import { chatApi } from "@/src/api/chatApi";
import { settingsApi } from "@/src/api/settings";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Bot,
  Mail,
  Maximize2,
  Minimize2,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast, Toaster } from "sonner";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
}

// Generate a stable session ID for this browser tab
const SESSION_ID =
  localStorage.getItem("omnipress_chat_session_id") ||
  "sess_" + Math.random().toString(36).substring(2) + "_" + Date.now();
localStorage.setItem("omnipress_chat_session_id", SESSION_ID);

declare global {
  interface Window {
    omnipressChatData?: {
      isLoggedIn: boolean;
      restUrl: string;
      nonce: string;
    };
  }
}

// Separate component to prevent focus loss during parent re-renders
const LeadForm = ({
  leadData,
  setLeadData,
  onSubmit,
  isSubmitting,
}: {
  leadData: any;
  setLeadData: any;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}) => {
  return (
    <div style={s.leadFormWrapper}>
      <div style={s.welcomeIconRing}>
        <Sparkles size={28} color="#6366f1" />
      </div>
      <p style={s.welcomeTitle}>Welcome!</p>
      <p style={s.welcomeSub}>Please introduce yourself to start chatting with our AI.</p>

      <form onSubmit={onSubmit} style={s.form}>
        <div style={s.inputGroup}>
          <div style={s.fieldLabel}>Name *</div>
          <div style={s.formInputWrapper}>
            <User size={16} color="#9ca3af" style={s.fieldIcon} />
            <input
              type="text"
              placeholder="John Doe"
              style={s.formInput}
              value={leadData.name}
              onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={s.inputGroup}>
          <div style={s.fieldLabel}>Email *</div>
          <div style={s.formInputWrapper}>
            <Mail size={16} color="#9ca3af" style={s.fieldIcon} />
            <input
              type="email"
              placeholder="john@example.com"
              style={s.formInput}
              value={leadData.email}
              onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={s.inputGroup}>
          <div style={s.fieldLabel}>Phone Number</div>
          <div style={s.formInputWrapper}>
            <Phone size={16} color="#9ca3af" style={s.fieldIcon} />
            <input
              type="tel"
              placeholder="+1 234 567 890"
              style={s.formInput}
              value={leadData.phone}
              onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ ...s.submitBtn, opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? "Saving..." : "Start Chatting"}
        </button>
      </form>
    </div>
  );
};

const ChatPopup = () => {
  const isLoggedIn = window.omnipressChatData?.isLoggedIn || false;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [titleText, setTitleText] = useState("AI Assistant");
  const [logoUrl, setLogoUrl] = useState("");
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch chatbot settings and history
  useEffect(() => {
    settingsApi.get().then((res: any) => {
      const qs = res?.data?.exampleQuestions;
      if (Array.isArray(qs) && qs.length > 0) {
        setExampleQuestions(qs.filter((q: string) => q.trim() !== ""));
      }
      
      const custom = res?.data?.customizations;
      if (custom?.titleText) setTitleText(custom.titleText);
      if (custom?.logoUrl) setLogoUrl(custom.logoUrl);

      const isLeadCaptureEnabled = res?.data?.isEnableLeadCapture ?? false;

      if (!isLoggedIn) {
        // Check if lead form should be shown for guest
        if (isLeadCaptureEnabled) {
          const isLeadCaptured = localStorage.getItem("omnipress_chat_lead_captured");
          if (!isLeadCaptured) {
            setShowLeadForm(true);
          }
        }

        // Load history from localStorage for guest
        const localHistory = localStorage.getItem("omnipress_chat_history");
        if (localHistory) {
          try {
            const parsed = JSON.parse(localHistory);
            setMessages(parsed.map((m: any) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : undefined
            })));
          } catch (e) {
            console.error("Failed to parse history", e);
          }
        }
      } else {
        // Load history from API for logged-in user
        chatApi.getHistory(SESSION_ID).then((resHistory: any) => {
          if (resHistory?.success && Array.isArray(resHistory.data)) {
            setMessages(resHistory.data.map((m: any) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : undefined
            })));
          }
        }).catch(console.error);
      }
    }).catch(() => { });
  }, [isLoggedIn]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      content: trimmed,
      role: "user",
      timestamp: new Date(),
    };

    // Append user message immediately for optimistic UI
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save to localStorage immediately for guests to prevent loss on refresh
    if (!isLoggedIn) {
      localStorage.setItem("omnipress_chat_history", JSON.stringify(updatedMessages));
    }

    setInputValue("");
    setIsLoading(true);

    try {
      const response: any = await chatApi.chat({
        question: trimmed,
        sessionId: SESSION_ID,
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (response?.success && response?.data?.answer) {
        const assistantMessage: Message = {
          content: response.data.answer,
          role: "assistant",
          timestamp: new Date(),
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        // Save to localStorage for guests
        if (!isLoggedIn) {
          localStorage.setItem("omnipress_chat_history", JSON.stringify(finalMessages));
        }
      } else {
        // Extract error message from remote API response
        const errMsg =
          response?.data?.error ||
          response?.data?.message ||
          response?.message ||
          "Failed to get a response. Please try again.";
        toast.error(errMsg);
        // Remove optimistic user message on failure
        setMessages(messages);
      }
    } catch (error: any) {
      const errMsg =
        error?.data?.error ||
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(errMsg);
      // Remove optimistic user message on failure
      setMessages(messages);
    } finally {
      setIsLoading(false);
      // Re-focus input
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);
  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear your chat history?")) return;

    setMessages([]);
    localStorage.removeItem("omnipress_chat_history");

    try {
      await chatApi.deleteHistory(SESSION_ID);
      toast.success("History cleared");
    } catch (e) {
      console.error("Failed to clear remote history", e);
      // Even if API fails, we locally cleared it
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    document.body.style.marginRight = isOpen
      ? isMaximized
        ? "700px"
        : "380px"
      : "0";
    document.body.style.transition = "margin-right 0.3s cubic-bezier(0.4,0,0.2,1)";
  }, [isOpen, isMaximized]);

  // --- Sub-components ---

  const TypingIndicator = () => (
    <div style={s.msgRow}>
      <div style={s.aiBubbleBase}>
        {logoUrl ? (
          <img src={logoUrl} alt="AI" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <span style={s.aiAvatarText}>AI</span>
        )}
      </div>
      <div style={{ ...s.bubble, ...s.aiBubble, padding: "12px 16px" }}>
        <div style={s.typingDots}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ ...s.dot, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );

  const WelcomePlaceholder = () => {
    const defaultQuestions = [
      "What is OmniPress?",
      "How do I back up my site?",
      "What plans are available?",
    ];
    const questions = exampleQuestions.length > 0 ? exampleQuestions : defaultQuestions;

    return (
      <div style={s.welcomeWrapper}>
        <div style={s.welcomeIconRing}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
          ) : (
            <Bot size={28} color="#6366f1" />
          )}
        </div>
        <p style={s.welcomeTitle}>{titleText}</p>
        <p style={s.welcomeSub}>
          Ask me anything. Click a question to get started.
        </p>
        {questions.map((q) => (
          <button
            key={q}
            style={s.suggestionBtn}
            onClick={() => {
              setInputValue(q);
              textareaRef.current?.focus();
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#eef2ff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            {q}
          </button>
        ))}
      </div>
    );
  };
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setIsLoading(true); // Using shared loading state or we could add isSubmittingLead
    try {
      await chatApi.saveLead({ ...leadData, session_id: SESSION_ID });
      localStorage.setItem("omnipress_chat_lead_captured", "true");
      setShowLeadForm(false);
      toast.success("Thank you! You can now start chatting.");
    } catch (err) {
      toast.error("Failed to save your information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <Toaster richColors position="top-right" />

      {isOpen && (
        <div
          style={{
            ...s.panel,
            width: isMaximized ? "700px" : "380px",
          }}
        >
          {/* Header */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.headerIconWrap}>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                ) : (
                  <Bot size={16} color="white" />
                )}
              </div>
              <div>
                <p style={s.headerTitle}>{titleText}</p>
                <p style={s.headerSub}>
                  <span style={s.onlineDot} />
                  Online
                </p>
              </div>
            </div>
            <div style={s.headerActions}>
              <button
                style={s.iconBtn}
                title="Clear history"
                onClick={clearHistory}
                onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.12)")
                }
              >
                <RefreshCw size={14} color="white" />
              </button>
              <button
                style={s.iconBtn}
                title={isMaximized ? "Minimize" : "Maximize"}
                onClick={() => setIsMaximized((prev) => !prev)}
                onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.12)")
                }
              >
                {isMaximized ? (
                  <Minimize2 size={14} color="white" />
                ) : (
                  <Maximize2 size={14} color="white" />
                )}
              </button>
              <button
                style={s.iconBtn}
                title="Close"
                onClick={toggleChat}
                onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.12)")
                }
              >
                <X size={16} color="white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={s.messagesArea}>
            {showLeadForm ? (
              <LeadForm 
                leadData={leadData} 
                setLeadData={setLeadData} 
                onSubmit={handleLeadSubmit}
                isSubmitting={isLoading}
              />
            ) : messages.length === 0 ? (
              <WelcomePlaceholder />
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...s.msgRow,
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.role === "assistant" && (
                      <div style={s.aiBubbleBase}>
                        {logoUrl ? (
                          <img src={logoUrl} alt="AI" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <span style={s.aiAvatarText}>AI</span>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        ...s.bubble,
                        ...(msg.role === "user" ? s.userBubble : s.aiBubble),
                      }}
                    >
                      {msg.role === "assistant" ? (
                        <Markdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                style={{ color: "#6366f1", fontWeight: 500 }}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                {...props}
                                style={{
                                  background: "#f1f5f9",
                                  padding: "1px 5px",
                                  borderRadius: "4px",
                                  fontSize: "13px",
                                  fontFamily: "monospace",
                                }}
                              />
                            ),
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div style={s.userBubbleAvatar}>
                        <span style={s.aiAvatarText}>U</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div style={s.inputArea}>
            <div style={s.inputWrapper}>
              <Textarea
                ref={textareaRef}
                placeholder={
                  isLoading
                    ? "AI is thinking…"
                    : "Send a message… (Enter to send)"
                }
                disabled={isLoading}
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  ...s.textarea,
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? "not-allowed" : "text",
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                style={{
                  ...s.sendBtn,
                  opacity: isLoading || !inputValue.trim() ? 0.45 : 1,
                  cursor:
                    isLoading || !inputValue.trim() ? "not-allowed" : "pointer",
                  transform:
                    isLoading || !inputValue.trim() ? "none" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputValue.trim())
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
              >
                <Send size={15} color="white" />
              </button>
            </div>
            <p style={s.poweredBy}>
              Powered by{" "}
              <a
                href="https://omnipressai.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#6366f1", textDecoration: "none" }}
              >
                Omnipress AI
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Launcher button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="op-chat-launcher"
          style={s.launcher}
        >
          <div style={s.launcherInner} className="op-launcher-inner">
            <Sparkles size={14} color="white" />
            <span style={{ marginLeft: "6px", fontWeight: 600, fontSize: "14px" }}>
              Ask AI
            </span>
          </div>
          <div style={s.launcherPulse} />
        </button>
      )}
    </div>
  );
};


const BG = "var(--op-bg, linear-gradient(135deg, #4f46e5, #7c3aed))";
const BG_SOLID = "var(--op-bg-solid, #4f46e5)";

const s: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 10000000,
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // --- Panel ---
  panel: {
    position: "fixed",
    bottom: 0,
    right: 0,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)",
    backgroundColor: "#fff",
    overflow: "hidden",
    transition: "width 0.2s ease",
  },

  // --- Header ---
  header: {
    background: BG,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerIconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    margin: 0,
    fontWeight: 700,
    fontSize: "14px",
    color: "white",
    lineHeight: 1.2,
  },
  headerSub: {
    margin: 0,
    fontSize: "11px",
    color: "rgba(255,255,255,0.82)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "2px",
  },
  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#4ade80",
    display: "inline-block",
    animation: "op-pulse 2s infinite",
  },
  headerActions: {
    display: "flex",
    gap: "6px",
  },
  iconBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255,255,255,0.12)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },

  // --- Messages area ---
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    backgroundColor: "#f8f9fb",
  },

  // --- Welcome ---
  welcomeWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
    gap: "10px",
    padding: "20px",
    paddingTop: "40px",
  },
  welcomeIconRing: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
  },
  welcomeTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },
  welcomeSub: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
    maxWidth: "240px",
    lineHeight: 1.5,
  },
  suggestionBtn: {
    fontSize: "13px",
    color: "#4f46e5",
    cursor: "pointer",
    padding: "7px 14px",
    border: "1px solid #c7d2fe",
    borderRadius: "20px",
    background: "transparent",
    transition: "background 0.15s",
    marginTop: "2px",
    lineHeight: 1.4,
    fontFamily: "inherit",
  },

  // --- Messages ---
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  aiBubbleBase: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: BG_SOLID,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userBubbleAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e5e7eb",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  aiAvatarText: {
    fontSize: "11px",
    fontWeight: 700,
    color: "white",
  },
  bubble: {
    maxWidth: "78%",
    padding: "10px 14px",
    fontSize: "14px",
    lineHeight: "1.55",
    wordBreak: "break-word",
    borderRadius: "18px",
  },
  userBubble: {
    background: BG,
    color: "white",
    borderBottomRightRadius: "5px",
    boxShadow: "0 2px 12px rgba(79,70,229,0.3)",
  },
  aiBubble: {
    background: "white",
    color: "#1f2937",
    borderBottomLeftRadius: "5px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },

  // --- Typing indicator ---
  typingDots: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    height: "18px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#6366f1",
    animation: "op-bounce 1.3s ease-in-out infinite",
  },

  // --- Input area ---
  inputArea: {
    backgroundColor: "#fff",
    borderTop: "1px solid #f0f0f0",
    padding: "12px 14px 8px",
    flexShrink: 0,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    background: "#f8f9fb",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    padding: "6px 8px 6px 12px",
    transition: "border-color 0.2s",
  },
  textarea: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    resize: "none",
    lineHeight: "1.5",
    fontFamily: "inherit",
    color: "#1f2937",
  },
  sendBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border: "none",
    background: BG,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "transform 0.15s, opacity 0.15s",
    boxShadow: "0 2px 10px rgba(79,70,229,0.4)",
  },
  poweredBy: {
    margin: "6px 0 0",
    textAlign: "center",
    fontSize: "11px",
    color: "#9ca3af",
  },

  // --- Launcher button ---
  launcher: {
    height: "46px",
    padding: "0 18px",
    borderRadius: "23px",
    background: BG,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 28px rgba(79,70,229,0.45)",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    color: "white",
  },
  launcherInner: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
    transition: "transform 0.2s",
  },
  launcherPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    transform: "translate(-50%, -50%) scale(0)",
    animation: "op-ripple 2s infinite",
    zIndex: 1,
  },

  // --- Lead Form ---
  leadFormWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "20px",
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    textAlign: "left",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: "6px",
    marginLeft: "2px",
  },
  formInputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "0 12px",
    height: "42px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  fieldIcon: {
    marginRight: "10px",
    flexShrink: 0,
  },
  formInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#1f2937",
    background: "transparent",
  },
  submitBtn: {
    marginTop: "10px",
    height: "44px",
    background: BG,
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};

// Inject keyframe animations once
if (typeof document !== "undefined" && !document.getElementById("op-chat-styles")) {
  const styleEl = document.createElement("style");
  styleEl.id = "op-chat-styles";
  styleEl.innerHTML = `
    @keyframes op-bounce {
      0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
      30% { transform: scale(1); opacity: 1; }
    }
    @keyframes op-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }
    @keyframes op-ripple {
      0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
    @keyframes op-slide-in {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Launcher hover */
    .op-chat-launcher:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 14px 36px rgba(79,70,229,0.5);
    }
    .op-chat-launcher:active { transform: scale(0.96); }
    .op-chat-launcher:hover .op-launcher-inner { transform: scale(1.06); }

    /* Textarea focus ring */
    .op-chat-launcher ~ * textarea:focus {
      box-shadow: none;
      border-color: transparent;
    }

    /* Message animation */
    [data-op-bubble] {
      animation: op-slide-in 0.2s ease;
    }

    /* Scrollbar */
    [data-op-messages]::-webkit-scrollbar { width: 4px; }
    [data-op-messages]::-webkit-scrollbar-track { background: transparent; }
    [data-op-messages]::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
  `;
  document.head.appendChild(styleEl);
}

export default ChatPopup;
