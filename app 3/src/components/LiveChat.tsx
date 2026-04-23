import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Loader2, Send, Sparkles } from 'lucide-react';

interface LiveChatProps {
  onAuthRequired: () => void;
}

export function LiveChat({ onAuthRequired }: LiveChatProps) {
  const { isAuthenticated } = useAuth();
  const { messages, sendMessage, createSession, currentSession, isLoading } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    setHasStarted(true);
    if (!currentSession) {
      await createSession('New Chat');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  // Quick reply options
  const quickReplies = [
    "We struggle with communication",
    "How do I express my needs better?",
    "Help us with conflict resolution",
    "Suggest a relationship exercise"
  ];

  const handleQuickReply = async (reply: string) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    await sendMessage(reply);
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-periwinkle/10 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-periwinkle" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-ink mb-3">
          Start a Conversation
        </h3>
        <p className="text-ink-light mb-6 max-w-sm">
          Chat with your AI couples therapist. Get personalized guidance to strengthen your relationship.
        </p>
        <Button 
          onClick={handleStartChat}
          className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8"
        >
          {isAuthenticated ? 'Start Chatting' : 'Sign In to Start'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-ink-light mb-4">How can I help you today?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-periwinkle/10 text-periwinkle rounded-full text-sm hover:bg-periwinkle/20 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-5 py-3.5 text-[15px] leading-relaxed ${
                msg.role === 'user'
                  ? 'chat-bubble-user bg-periwinkle/10 text-ink'
                  : 'chat-bubble-ai bg-white text-ink shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 px-5 py-4 bg-white rounded-[22px_22px_22px_6px] shadow-sm w-fit">
              <span className="w-2 h-2 bg-periwinkle rounded-full animate-pulse-dot" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-periwinkle rounded-full animate-pulse-dot" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-periwinkle rounded-full animate-pulse-dot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-periwinkle hover:bg-periwinkle-dark"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LiveChat;
