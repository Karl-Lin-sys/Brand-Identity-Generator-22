import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Brain,
  MessageSquare,
  Trash2,
  HelpCircle,
  Check,
} from 'lucide-react';
import { BrandBible, ChatMessage, ChatModel } from '../types';

interface BrandChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandBible?: BrandBible;
}

const MODEL_INFO: Record<
  ChatModel,
  { name: string; tag: string; description: string; icon: any; color: string }
> = {
  'gemini-3.1-pro-preview': {
    name: 'Gemini 3.1 Pro',
    tag: 'Complex Tasks',
    description: 'Deep strategic reasoning, trademark defense, and corporate architecture.',
    icon: Brain,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  'gemini-3.5-flash': {
    name: 'Gemini 3.5 Flash',
    tag: 'General Tasks',
    description: 'Tone-of-voice polish, creative copywriting, and visual critique.',
    icon: Sparkles,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  'gemini-3.1-flash-lite': {
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Fast Tasks',
    description: 'Instant feedback, microcopy iterations, and rapid queries.',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
};

const SUGGESTIONS = [
  'Audit my color palette for accessibility & emotional tone',
  'Critique my header and body Google Font pairing',
  'Suggest 5 punchy taglines based on my mission',
  'How do I test my primary mark for trademark distinctiveness?',
  'Draft brand voice guidelines for customer support',
];

export const BrandChatDrawer: React.FC<BrandChatDrawerProps> = ({
  isOpen,
  onClose,
  brandBible,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: brandBible
        ? `Hello! I am your Creative Director & Brand Strategist. I have reviewed the brand blueprint for **${brandBible.companyName}**.\n\nHow can I help you elevate this identity today? We can refine taglines, audit color contrast, or explore trademark strategies.`
        : `Hello! I am your Creative Director & Brand Strategist. What brand identity or company mission would you like to explore together?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<ChatModel>('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          modelChoice: selectedModel,
          brandContext: brandBible,
        }),
      });

      const data = await response.json();

      const modelMessage: ChatMessage = {
        id: 'model-' + Date.now(),
        role: 'model',
        text: data.text || data.fallbackText || 'I have noted your thoughts. Let me know what to review next.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'model-err-' + Date.now(),
          role: 'model',
          text: 'I ran into a temporary network issue. Please verify your connection or retry your prompt.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'reset-' + Date.now(),
        role: 'model',
        text: `Conversation restarted. What aspect of ${brandBible?.companyName || 'your brand'} would you like to discuss?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm">Creative Director</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              </div>
              <p className="text-[11px] text-slate-500">Gemini Brand Strategist & Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model Selection Tabs (gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite) */}
        <div className="p-3 bg-slate-100/70 border-b border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Advisor Model Tier</span>
            <span className="text-[10px] text-slate-400 font-normal">Switch per task complexity</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(MODEL_INFO) as ChatModel[]).map((mKey) => {
              const info = MODEL_INFO[mKey];
              const Icon = info.icon;
              const isSelected = selectedModel === mKey;
              return (
                <button
                  key={mKey}
                  type="button"
                  onClick={() => setSelectedModel(mKey)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500/20'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 truncate">
                    <Icon className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span className="truncate">{info.name.replace('Gemini ', '')}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate font-medium">
                    {info.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {m.text}
                  </div>

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-slate-400' : 'text-slate-400 border-t border-slate-100 pt-1.5'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.modelUsed && !isUser && (
                      <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {m.modelUsed}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-500 p-2 bg-white rounded-xl border border-slate-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Analyzing with {selectedModel}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 border-t border-slate-200 bg-white overflow-x-auto">
          <div className="flex gap-1.5 whitespace-nowrap">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(s)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200/80 transition-all shrink-0 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${MODEL_INFO[selectedModel].name} about branding, palette, fonts...`}
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
            <span>Brand context synced</span>
            <span>Active model: {selectedModel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
