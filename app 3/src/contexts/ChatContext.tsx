import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

interface Message {
  id?: string;
  role: 'user' | 'ai';
  content: string;
  created_at?: string;
}

interface Session {
  id: string;
  title: string;
  topic?: string;
  status: string;
  created_at: string;
  messages?: Message[];
}

interface ChatContextType {
  sessions: Session[];
  currentSession: Session | null;
  messages: Message[];
  isLoading: boolean;
  loadSessions: () => Promise<void>;
  createSession: (title?: string, topic?: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  topics: { id: string; title: string; description: string }[];
  loadTopics: () => Promise<void>;
  startTopic: (topic: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<{ id: string; title: string; description: string }[]>([]);

  const loadSessions = useCallback(async () => {
    try {
      const data = await api.getSessions();
      setSessions(data.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }, []);

  const createSession = async (title?: string, topic?: string) => {
    setIsLoading(true);
    try {
      const data = await api.createSession(title, topic);
      setCurrentSession(data.session);
      setMessages(data.session.messages || []);
      await loadSessions();
    } catch (error) {
      toast.error('Failed to create session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const data = await api.getSession(sessionId);
      setCurrentSession(data.session);
      setMessages(data.session.messages || []);
    } catch (error) {
      toast.error('Failed to load session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!currentSession) {
      toast.error('No active session');
      return;
    }

    // Optimistically add user message
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await api.sendMessage(currentSession.id, message);
      setMessages(prev => [...prev, data.aiMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m !== userMessage));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopics = async () => {
    try {
      const data = await api.getTopics();
      setTopics(data.topics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const startTopic = async (topic: string) => {
    if (!currentSession) {
      await createSession('Guided Session', topic);
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.startTopicSession(currentSession.id, topic);
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      toast.error('Failed to start topic');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        messages,
        isLoading,
        loadSessions,
        createSession,
        loadSession,
        sendMessage,
        topics,
        loadTopics,
        startTopic,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export default ChatContext;
