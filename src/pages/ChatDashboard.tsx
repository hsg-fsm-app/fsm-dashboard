/**
 * CHAT DASHBOARD - Admin Chat Management
 * 
 * This is the admin-side chat interface for managing customer conversations.
 * Features:
 * - List all chat sessions in sidebar
 * - View/send messages in main area
 * - Create new chat sessions (generates shareable link)
 * - Real-time message updates via Supabase Realtime
 * 
 * Flow:
 * 1. Admin creates a chat session → gets shareable link
 * 2. Admin shares link with customer (email, SMS, etc.)
 * 3. Customer opens link → sees chat UI → can send messages
 * 4. Both parties see messages in real-time
 */

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import '@styles/pages/ChatDashboard.css';

// ==========================================
// TYPES - Define data structures
// ==========================================

interface ChatSession {
  id: string;  // UUID from Supabase
  created_at: string;
  status: 'open' | 'closed';
  customer_name: string | null;
  customer_email: string | null;
  metadata: Record<string, unknown>;
  // Computed on frontend for display
  lastMessage?: string;
  unreadCount?: number;
}

interface ChatMessage {
  id: string;  // UUID from Supabase
  created_at: string;
  chat_id: string;  // UUID reference
  sender_type: 'admin' | 'customer';
  sender_id: string | null;
  content: string;
}

// ==========================================
// SUPABASE CLIENT - For realtime subscriptions
// ==========================================

// Note: This uses the anon key (safe to expose) for realtime only
// All writes go through Netlify Functions for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// COMPONENT
// ==========================================

const ChatDashboard = () => {
  // State for chat sessions (sidebar)
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  
  // State for messages (main chat area)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // State for new session modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatEmail, setNewChatEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  
  // State for search/filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ref for auto-scrolling messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // DATA FETCHING
  // ==========================================

  /**
   * Fetch all chat sessions for the sidebar
   * Note: Must access app via localhost:8888 (Netlify dev), not 5173 (Vite)
   */
  const fetchSessions = async () => {
    try {
      const response = await fetch('/.netlify/functions/chat-session');
      
      // Check if we got HTML instead of JSON (wrong port)
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.warn('Got HTML instead of JSON - make sure you are accessing via localhost:8888');
        return;
      }
      
      const data = await response.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  /**
   * Fetch messages for the selected session
   */
  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/.netlify/functions/chat-message?chatId=${chatId}`);
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // ==========================================
  // EFFECTS
  // ==========================================

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id);
    } else {
      setMessages([]);
    }
  }, [selectedSession]);

  // Subscribe to realtime messages when session is selected
  useEffect(() => {
    if (!selectedSession) return;

    // Create realtime subscription for new messages
    const channel = supabase
      .channel(`chat:${selectedSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${selectedSession.id}`,
        },
        (payload) => {
          // Append new message to the list
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount or session change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ==========================================
  // HANDLERS
  // ==========================================

  /**
   * Create a new chat session
   * Generates a shareable link for the customer
   */
  const handleCreateSession = async () => {
    try {
      const response = await fetch('/.netlify/functions/chat-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: newChatName || 'Guest',
          customer_email: newChatEmail || null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show the generated link to copy
        setGeneratedLink(data.chatLink);
        // Refresh sessions list
        fetchSessions();
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create chat session');
    }
  };

  /**
   * Send a message as admin
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSession || !newMessage.trim()) return;
    
    setSending(true);
    try {
      await fetch('/.netlify/functions/chat-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: selectedSession.id,
          sender_type: 'admin',
          sender_id: 'admin-1', // In production, use actual admin ID
          content: newMessage.trim()
        })
      });
      
      setNewMessage('');
      // Note: Message will appear via realtime subscription
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  /**
   * Close a chat session
   */
  const handleCloseSession = async (sessionId: number) => {
    if (!confirm('Close this chat session?')) return;
    
    try {
      await fetch(`/.netlify/functions/chat-session?id=${sessionId}`, {
        method: 'DELETE'
      });
      fetchSessions();
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };

  /**
   * Copy link to clipboard
   */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard!');
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  // Filter sessions by search query
  const filteredSessions = sessions.filter(session => 
    session.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  /**
   * Format timestamp for display
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // ==========================================
  // ICONS
  // ==========================================

  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="cs-chat-dashboard">
      {/* ====== SIDEBAR - Conversations List ====== */}
      <aside className="cs-chat-sidebar">
        <div className="cs-sidebar-header">
          <h2 className="cs-sidebar-title">Messages</h2>
          <button 
            className="cs-button-new-conversation" 
            onClick={() => setShowNewChatModal(true)}
            aria-label="Start new conversation"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Search Input */}
        <div className="cs-search-wrapper">
          <input 
            type="search" 
            className="cs-search-input" 
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Conversation List */}
        <div className="cs-conversation-list">
          {filteredSessions.length === 0 && (
            <div className="cs-empty-conversations">
              <p>No conversations yet</p>
              <button 
                className="cs-button cs-button--small"
                onClick={() => setShowNewChatModal(true)}
              >
                Start a chat
              </button>
            </div>
          )}
          
          {filteredSessions.map((session) => (
            <div 
              key={session.id}
              className={`cs-conversation-item ${selectedSession?.id === session.id ? 'cs-active' : ''}`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="cs-conversation-avatar">
                {/* Avatar placeholder - first letter of name */}
                <div className="cs-avatar-placeholder">
                  {(session.customer_name || 'G')[0].toUpperCase()}
                </div>
                <span className={`cs-status-indicator ${session.status === 'open' ? 'cs-online' : 'cs-offline'}`}></span>
              </div>
              <div className="cs-conversation-content">
                <div className="cs-conversation-header">
                  <h3 className="cs-conversation-name">
                    {session.customer_name || 'Guest'}
                  </h3>
                  <span className="cs-conversation-time">
                    {formatTime(session.created_at)}
                  </span>
                </div>
                <p className="cs-conversation-preview">
                  {session.customer_email || 'No email provided'}
                </p>
                {session.status === 'open' && (
                  <span className="cs-status-badge cs-status-open">Open</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ====== MAIN CHAT AREA ====== */}
      <main className="cs-chat-main">
        {!selectedSession ? (
          /* Empty State - No conversation selected */
          <div className="cs-chat-empty-state">
            <div className="cs-empty-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a chat from the sidebar or start a new conversation</p>
            <button 
              className="cs-button"
              onClick={() => setShowNewChatModal(true)}
            >
              <PlusIcon />
              <span>New Chat</span>
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="cs-chat-header">
              <div className="cs-chat-header-info">
                <div className="cs-avatar-placeholder cs-avatar--large">
                  {(selectedSession.customer_name || 'G')[0].toUpperCase()}
                </div>
                <div className="cs-chat-header-details">
                  <h2 className="cs-chat-title">
                    {selectedSession.customer_name || 'Guest'}
                  </h2>
                  <p className="cs-chat-status">
                    {selectedSession.customer_email || 'No email'} • {selectedSession.status}
                  </p>
                </div>
              </div>
              <button 
                className="cs-chat-close-btn"
                onClick={() => handleCloseSession(selectedSession.id)}
                title="Close conversation"
              >
                Close Chat
              </button>
            </div>

            {/* Messages Container */}
            <div className="cs-messages-container">
              {messages.length === 0 && (
                <div className="cs-messages-empty">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`cs-message ${message.sender_type === 'admin' ? 'cs-message-sent' : 'cs-message-received'}`}
                >
                  {message.sender_type === 'customer' && (
                    <div className="cs-message-avatar">
                      <div className="cs-avatar-placeholder cs-avatar--small">
                        {(selectedSession.customer_name || 'G')[0].toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="cs-message-content">
                    <div className="cs-message-header">
                      {message.sender_type === 'customer' && (
                        <span className="cs-message-sender">
                          {selectedSession.customer_name || 'Customer'}
                        </span>
                      )}
                      <span className="cs-message-time">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <div className="cs-message-bubble">
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form className="cs-message-input-wrapper" onSubmit={handleSendMessage}>
              <textarea 
                className="cs-message-input" 
                placeholder="Type your message..."
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  // Send on Enter (without Shift)
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button 
                type="submit"
                className="cs-send-button"
                disabled={sending || !newMessage.trim()}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </form>
          </>
        )}
      </main>

      {/* ====== NEW CHAT MODAL ====== */}
      {showNewChatModal && (
        <div className="cs-modal-overlay" onClick={() => {
          setShowNewChatModal(false);
          setGeneratedLink('');
          setNewChatName('');
          setNewChatEmail('');
        }}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <h2 className="cs-modal-title">
                {generatedLink ? 'Share Chat Link' : 'Start New Chat'}
              </h2>
              <button 
                className="cs-modal-close"
                onClick={() => {
                  setShowNewChatModal(false);
                  setGeneratedLink('');
                  setNewChatName('');
                  setNewChatEmail('');
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="cs-modal-body">
              {!generatedLink ? (
                /* Step 1: Enter customer details */
                <>
                  <div className="cs-form-group">
                    <label className="cs-form-label">Customer Name</label>
                    <input
                      type="text"
                      className="cs-form-input"
                      placeholder="e.g., John Smith"
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                    />
                  </div>
                  <div className="cs-form-group">
                    <label className="cs-form-label">Customer Email (optional)</label>
                    <input
                      type="email"
                      className="cs-form-input"
                      placeholder="e.g., john@example.com"
                      value={newChatEmail}
                      onChange={(e) => setNewChatEmail(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                /* Step 2: Show generated link */
                <div className="cs-link-generated">
                  <p className="cs-link-instructions">
                    Share this link with your customer to start chatting:
                  </p>
                  <div className="cs-link-box">
                    <code className="cs-link-text">{generatedLink}</code>
                    <button 
                      className="cs-copy-button"
                      onClick={handleCopyLink}
                    >
                      <CopyIcon />
                      Copy
                    </button>
                  </div>
                  <p className="cs-link-note">
                    This link is valid for 7 days. Customer can bookmark it to resume chat later.
                  </p>
                </div>
              )}
            </div>

            <div className="cs-modal-footer">
              {!generatedLink ? (
                <button 
                  className="cs-button"
                  onClick={handleCreateSession}
                >
                  Create Chat Link
                </button>
              ) : (
                <button 
                  className="cs-button"
                  onClick={() => {
                    setShowNewChatModal(false);
                    setGeneratedLink('');
                    setNewChatName('');
                    setNewChatEmail('');
                  }}
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
