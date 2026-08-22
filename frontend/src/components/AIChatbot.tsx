import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const PREDEFINED_QA = [
  {
    question: "How do I create a new trip?",
    answer: "You can create a new trip by clicking the 'Plan New Trip' button in the navigation bar. You'll need to provide a name, destination cities, and travel dates. After that, you can build out your itinerary day by day!"
  },
  {
    question: "How does the budget work?",
    answer: "Your trip budget is calculated by adding up the costs of all your planned activities and any custom budget items you add (like flights or hotels). You can view detailed breakdowns on the Budget Overview page."
  },
  {
    question: "Can I share my itinerary with friends?",
    answer: "Yes! When creating or editing a trip, you can toggle the 'Make Public' setting. This will generate a unique link you can share with friends or family so they can view your itinerary."
  },
  {
    question: "What is the Community page for?",
    answer: "The Community page showcases trending destinations and public trips created by other travelers. It's a great place to find inspiration for your next adventure!"
  }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: "Hi there! 👋 I'm your GlobeTrotter AI assistant. How can I help you plan your next adventure?",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleQuestionClick = (qa: typeof PREDEFINED_QA[0]) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: qa.question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: qa.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000); // 1 second fake delay
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full gradient-primary shadow-2xl hover:scale-110 hover:shadow-primary-500/50 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-500 border-2 border-surface-900"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] glass-card border border-surface-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="gradient-primary p-4 flex items-center justify-between shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-1.5">
                GlobeTrotter AI <Sparkles className="w-3.5 h-3.5 text-accent-300" />
              </h3>
              <p className="text-primary-100 text-xs">Always here to help</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-900/50 scrollbar-thin">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'gradient-accent' : 'bg-surface-700'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-primary-400" />}
                </div>
                
                {/* Message Bubble */}
                <div className={`p-3 rounded-2xl ${msg.sender === 'user' ? 'gradient-primary text-white rounded-tr-sm' : 'bg-surface-800 text-surface-100 rounded-tl-sm border border-surface-700'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] mt-1.5 block ${msg.sender === 'user' ? 'text-primary-100 text-right' : 'text-surface-400 text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-surface-700">
                  <Bot className="w-4 h-4 text-primary-400" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-800 rounded-tl-sm border border-surface-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Predefined Questions) */}
        <div className="p-4 bg-surface-950/80 backdrop-blur-md border-t border-surface-800/60 relative z-10">
          <p className="text-xs text-surface-400 font-medium mb-3 ml-1 uppercase tracking-wider">Suggested Questions</p>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_QA.map((qa, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(qa)}
                disabled={isTyping}
                className="text-left px-3.5 py-2 rounded-xl text-sm bg-surface-800 border border-surface-700 text-surface-200 hover:text-white hover:bg-surface-700 hover:border-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
              >
                <span className="flex-1">{qa.question}</span>
                <Send className="w-3.5 h-3.5 text-surface-500 group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
