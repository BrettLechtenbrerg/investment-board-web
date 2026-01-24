'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, Key, X, Loader2, Trash2, Settings2 } from 'lucide-react';
import { ALL_ADVISORS, DEFAULT_ADVISOR_IDS, generateBoardMeetingAdvisor, Advisor } from '@/lib/advisors';
import { HelpModal } from '@/components/HelpModal';
import { CustomizeModal } from '@/components/CustomizeModal';
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
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeAdvisorIds, setActiveAdvisorIds] = useState<string[]>(DEFAULT_ADVISOR_IDS);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load API key and board config from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowHelp(true);
    }
    const savedBoard = localStorage.getItem('investment-board-advisors');
    if (savedBoard) {
      try {
        const parsed = JSON.parse(savedBoard);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setActiveAdvisorIds(parsed);
        }
      } catch { /* use defaults */ }
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

  const activeAdvisors = ALL_ADVISORS.filter(a => activeAdvisorIds.includes(a.id));
  const boardMeeting = generateBoardMeetingAdvisor(activeAdvisors);

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
    gold: 'border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20',
    teal: 'border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20',
    slate: 'border-slate-400/30 bg-slate-500/10 hover:bg-slate-500/20',
    sky: 'border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20',
    orange: 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20',
    rose: 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20',
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
    gold: 'border-yellow-400 bg-yellow-500/30 ring-2 ring-yellow-500/50',
    teal: 'border-teal-400 bg-teal-500/30 ring-2 ring-teal-500/50',
    slate: 'border-slate-400 bg-slate-500/30 ring-2 ring-slate-500/50',
    sky: 'border-sky-400 bg-sky-500/30 ring-2 ring-sky-500/50',
    orange: 'border-orange-400 bg-orange-500/30 ring-2 ring-orange-500/50',
    rose: 'border-rose-400 bg-rose-500/30 ring-2 ring-rose-500/50',
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
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Welcome To Your Personal<br />Investment Board of Advisors</h1>
          <div className="flex justify-center mb-6">
            <Image src="/icon.png" alt="Investment Board of Advisors" width={200} height={200} className="rounded-2xl" />
          </div>
          <div className="text-left max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-white mb-1">Follow these steps to get your investment board working for you.</p>
            <p className="text-sm text-white/70 mb-3">If you already have an Anthropic/Claude account you can skip to step 4.</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-white/80">
              <li>If you do not have an Anthropic / Claude AI account follow the link to set up your FREE account -&gt; <a href="https://www.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold">https://www.anthropic.com/</a></li>
              <li>When you are on the anthropic page simply click the black button in the top right corner that says Try Claude.</li>
              <li>Follow the simple instructions and you will have a FREE Claude account be up and running in approximately 2 min.</li>
              <li>After you set up your account, get anthropic API so you can talk to your board. Follow the link to get an API key and if you need further help then watch the 1 minute video below.</li>
              <li>Once you have created and named your API key. Click the pulsing &ldquo;Set API Key&rdquo; in the top right hand corner and paste your key in the box and hit save.</li>
              <li>Give the system 30 seconds to activate and you can begin asking your board questions.</li>
              <li>You can ask individual board member questions or Call a Board Meeting and ask them all at once.</li>
              <li>If you want to customize your board then simply click the Customize Your Board button and make changes by following the instructions. Please remember to hit the big green Save Board button or your changes will not take effect.</li>
            </ol>
          </div>
        </div>

        {/* Advisor Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/50">Choose Your Advisor</h2>
            <button
              onClick={() => setShowCustomize(true)}
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-emerald-400 transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Customize Board
            </button>
          </div>
          <div className={`grid grid-cols-3 gap-2 ${activeAdvisors.length <= 6 ? 'sm:grid-cols-6' : activeAdvisors.length <= 9 ? 'sm:grid-cols-5 lg:grid-cols-9' : 'sm:grid-cols-5 lg:grid-cols-8'}`}>
            {activeAdvisors.map((advisor) => (
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
          {/* Instruction Button */}
          <div className="mt-3 w-full flex items-center justify-center gap-3 p-3 rounded-xl border border-white/20 bg-white/[0.03]">
            <span className="text-sm text-white/70 text-center">Talk to an individual advisor by clicking their name above or call a board meeting by clicking the button below.</span>
          </div>
          {/* Board Meeting Button */}
          <button
            onClick={() => {
              setSelectedAdvisor(boardMeeting);
              setMessages([]);
              setError('');
            }}
            className={`mt-2 w-full flex items-center justify-center gap-3 p-3 rounded-xl border transition-all active:scale-95 ${
              selectedAdvisor?.id === 'board_meeting'
                ? 'border-yellow-400 bg-yellow-500/20 ring-2 ring-yellow-500/50'
                : 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/15'
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-sm font-semibold text-yellow-300">Call a Board Meeting</span>
            <span className="text-xs text-white/40 hidden sm:inline">&mdash; All {activeAdvisors.length} advisors weigh in together</span>
          </button>
          {/* Customize Your Board Button */}
          <button
            onClick={() => setShowCustomize(true)}
            className="mt-2 w-full flex items-center justify-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 transition-all active:scale-95"
          >
            <Settings2 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Customize Your Board</span>
          </button>
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
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden" style={{ height: 'calc(100vh - 700px)', minHeight: '150px' }}>
          {/* Messages */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && selectedAdvisor && (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <span className="text-5xl mb-4 block">{selectedAdvisor.emoji}</span>
                    <h3 className="text-lg font-medium text-white/70 mb-2">
                      Chat with {selectedAdvisor.name}
                    </h3>
                    <p className="text-sm text-white/40 max-w-md">
                      Ask about investment strategies, market analysis, portfolio advice, or any financial topic.
                    </p>
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

      {/* Customize Modal */}
      <CustomizeModal
        isOpen={showCustomize}
        onClose={() => setShowCustomize(false)}
        onSave={(ids) => {
          setActiveAdvisorIds(ids);
          setSelectedAdvisor(null);
          setMessages([]);
        }}
        activeAdvisorIds={activeAdvisorIds}
      />

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
            <h2 className="text-lg font-semibold text-white mb-4">Set Up Your API Key</h2>

            {/* Step 1 */}
            <div className="mb-4 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">1</span>
                <span className="text-sm font-medium text-white">Get your Claude API key</span>
              </div>
              <p className="text-xs text-white/50 mb-2 ml-8">Create an account and generate an API key on the Anthropic platform.</p>
              <a
                href="https://platform.claude.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-8 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Open Claude Dashboard →
              </a>
            </div>

            {/* Step 2 */}
            <div className="mb-4 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold">2</span>
                <span className="text-sm font-medium text-white">Watch the video tutorial</span>
              </div>
              <p className="text-xs text-white/50 mb-2 ml-8">Not sure how? Watch this quick guide on getting your API key.</p>
              <a
                href="https://www.youtube.com/watch?v=y3Jx8sIwYQs"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-8 inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors"
              >
                Watch Tutorial on YouTube →
              </a>
            </div>

            {/* Step 3 */}
            <div className="mb-4 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">3</span>
                <span className="text-sm font-medium text-white">Paste your key below</span>
              </div>
              <p className="text-xs text-white/50 mb-2 ml-8">Your key is stored only in your browser. Never sent to our servers.</p>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <button
              onClick={saveApiKey}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-500 hover:to-teal-400 transition-all"
            >
              Save Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
