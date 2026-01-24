'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, Key, X, Loader2, Trash2 } from 'lucide-react';
import { ADVISORS, Advisor } from '@/lib/advisors';
import { HelpModal } from '@/components/HelpModal';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // Show help modal on first visit
      setShowHelp(true);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('anthropic-api-key', apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setShowApiKeyModal(false);
      setError('');
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!selectedAdvisor) {
      setError('Please select an advisor first');
      return;
    }

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: selectedAdvisor.prompt,
          apiKey: apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantMessage += parsed.text;
                setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
              }
            } catch {
              // Skip unparseable
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      if (errorMessage.includes('Invalid API key')) {
        setShowApiKeyModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20',
    blue: 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20',
    indigo: 'border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20',
    amber: 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20',
    purple: 'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20',
    violet: 'border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20',
    red: 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20',
    pink: 'border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20',
  };

  const selectedColorMap: Record<string, string> = {
    emerald: 'border-emerald-400 bg-emerald-500/30 ring-2 ring-emerald-500/50',
    blue: 'border-blue-400 bg-blue-500/30 ring-2 ring-blue-500/50',
    cyan: 'border-cyan-400 bg-cyan-500/30 ring-2 ring-cyan-500/50',
    indigo: 'border-indigo-400 bg-indigo-500/30 ring-2 ring-indigo-500/50',
    amber: 'border-amber-400 bg-amber-500/30 ring-2 ring-amber-500/50',
    purple: 'border-purple-400 bg-purple-500/30 ring-2 ring-purple-500/50',
    violet: 'border-violet-400 bg-violet-500/30 ring-2 ring-violet-500/50',
    red: 'border-red-400 bg-red-500/30 ring-2 ring-red-500/50',
    pink: 'border-pink-400 bg-pink-500/30 ring-2 ring-pink-500/50',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="Investment Board" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Investment Board of Advisors
              </h1>
              <p className="text-xs text-white/40">Get wisdom from legendary investors</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition-all hover:border-emerald-500/30 hover:bg-white/10 hover:text-white active:scale-95"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </button>
            <button
              onClick={() => {
                setApiKeyInput(apiKey);
                setShowApiKeyModal(true);
              }}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all active:scale-95 ${
                apiKey
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400 animate-pulse'
              }`}
            >
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">{apiKey ? 'API Key Set' : 'Set API Key'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Advisor Selection */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-white/50 mb-3">Choose Your Advisor</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {ADVISORS.map((advisor) => (
              <button
                key={advisor.id}
                onClick={() => {
                  setSelectedAdvisor(advisor);
                  setMessages([]);
                  setError('');
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all active:scale-95 ${
                  selectedAdvisor?.id === advisor.id
                    ? selectedColorMap[advisor.color]
                    : colorMap[advisor.color]
                }`}
              >
                <span className="text-2xl">{advisor.emoji}</span>
                <span className="text-[10px] sm:text-xs font-medium text-white/80 text-center leading-tight">
                  {advisor.name.split(' ').pop()}
                </span>
              </button>
            ))}
          </div>
          {selectedAdvisor && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-white/60">
                <span className="text-white/80 font-medium">{selectedAdvisor.emoji} {selectedAdvisor.name}</span>
                {' '}&mdash; {selectedAdvisor.title}
              </p>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden" style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }}>
          {/* Messages */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    {selectedAdvisor ? (
                      <>
                        <span className="text-5xl mb-4 block">{selectedAdvisor.emoji}</span>
                        <h3 className="text-lg font-medium text-white/70 mb-2">
                          Chat with {selectedAdvisor.name}
                        </h3>
                        <p className="text-sm text-white/40 max-w-md">
                          Ask about investment strategies, market analysis, portfolio advice, or any financial topic.
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl mb-4 block">💰</span>
                        <h3 className="text-lg font-medium text-white/70 mb-2">
                          Select an Advisor Above
                        </h3>
                        <p className="text-sm text-white/40 max-w-md">
                          Choose from 9 legendary investors, each with their own unique philosophy and style.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-emerald-600/30 border border-emerald-500/30 text-white'
                        : 'bg-white/5 border border-white/10 text-white/90'
                    }`}
                  >
                    {msg.role === 'assistant' && selectedAdvisor && (
                      <div className="text-xs text-white/40 mb-1 font-medium">
                        {selectedAdvisor.emoji} {selectedAdvisor.name}
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-sm text-red-400">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedAdvisor
                      ? `Ask ${selectedAdvisor.name} a question...`
                      : 'Select an advisor to start chatting...'
                  }
                  disabled={!selectedAdvisor || isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || !selectedAdvisor}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white transition-all hover:from-emerald-500 hover:to-teal-400 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                For educational purposes only. Not financial advice. Always consult qualified professionals.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowApiKeyModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/95 shadow-2xl p-6">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-white mb-2">Claude API Key</h2>
            <p className="text-sm text-white/50 mb-4">
              Your key is stored only in your browser. Never sent to our servers.
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={saveApiKey}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-500 hover:to-teal-400 transition-all"
              >
                Save Key
              </button>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                Get Key
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
