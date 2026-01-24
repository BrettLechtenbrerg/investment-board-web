'use client';

import { useState } from 'react';
import { X, ChevronRight, Key, MessageSquare, Users, Shield, PlayCircle, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    number: 1,
    title: 'Get Your Claude API Key',
    icon: Key,
    color: 'purple',
    content: [
      {
        subtitle: 'Create an Anthropic Account',
        instructions: [
          'Go to console.anthropic.com',
          'Sign up for a free account (or sign in)',
          'Navigate to Settings → API Keys',
          'Click "+ Create Key" to generate a new key',
          'Copy the key immediately (it only shows once!)',
        ],
      },
      {
        subtitle: 'Add Credits',
        instructions: [
          'Go to Settings → Billing in the Anthropic Console',
          'Add $5 minimum to get started (this lasts a LONG time)',
          'Your API key won\'t work without credits added',
        ],
      },
      {
        subtitle: null,
        isWarning: true,
        instructions: [
          'Important: Your API key is stored only in YOUR browser (localStorage). It is never saved on our servers. It\'s sent directly to Anthropic\'s API to generate responses.',
        ],
      },
    ],
  },
  {
    number: 2,
    title: 'Enter Your Key Here',
    icon: Shield,
    color: 'emerald',
    content: [
      {
        subtitle: 'Paste Your Key',
        instructions: [
          'Click the "API Key" button at the top of this page',
          'Paste your key (starts with sk-ant-...)',
          'Click Save — it\'s stored in your browser only',
          'You only need to do this once per device',
        ],
      },
    ],
  },
  {
    number: 3,
    title: 'Choose an Advisor',
    icon: Users,
    color: 'blue',
    content: [
      {
        subtitle: 'Pick Your Investment Mentor',
        instructions: [
          'Click on any advisor card to select them',
          'Each advisor has a unique investment philosophy',
          'Warren Buffett for value investing fundamentals',
          'Cathie Wood for disruptive innovation',
          'Ray Dalio for macro economics and principles',
          'Mix it up! Switch advisors anytime',
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'Start Chatting',
    icon: MessageSquare,
    color: 'violet',
    content: [
      {
        subtitle: 'Ask Anything About Investing',
        instructions: [
          'Type your question in the chat box',
          'Ask about specific stocks, strategies, or concepts',
          'The advisor responds in their unique voice and philosophy',
          'Chat history is kept during your session',
          'Try asking the same question to different advisors!',
        ],
      },
      {
        subtitle: null,
        isWarning: true,
        instructions: [
          'Disclaimer: This is for educational and entertainment purposes only. This is NOT financial advice. Always consult qualified professionals before making investment decisions.',
        ],
      },
    ],
  },
  {
    number: 5,
    title: 'Watch the Tutorial',
    icon: PlayCircle,
    color: 'pink',
    content: [
      {
        subtitle: 'Video Walkthrough',
        instructions: [
          'Watch our step-by-step video guide below',
          'Shows exactly how to get your API key',
          'Demonstrates choosing advisors and chatting',
        ],
      },
      {
        subtitle: null,
        isVideo: true,
        instructions: [],
        videoPlaceholder: true,
      },
    ],
  },
];

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-gray-900/95 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-gray-900/95 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Getting Started</h2>
            <p className="text-sm text-white/50 mt-0.5">Set up your Investment Board of Advisors</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-3" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {steps.map((step) => {
            const isExpanded = expandedStep === step.number;
            const Icon = step.icon;
            const colorClasses: Record<string, string> = {
              purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
              pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            };

            return (
              <div
                key={step.number}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                {/* Step Header */}
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.number)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl border ${colorClasses[step.color] || colorClasses.purple}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white/40">Step {step.number}</span>
                    </div>
                    <h3 className="text-base font-medium text-white">{step.title}</h3>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-white/40 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>

                {/* Step Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 space-y-4">
                    {step.content.map((section, idx) => (
                      <div key={idx} className={(section as { isWarning?: boolean }).isWarning ? 'mt-2' : ''}>
                        {(section as { isWarning?: boolean }).isWarning ? (
                          <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-200/90 leading-relaxed">
                              {section.instructions[0]}
                            </p>
                          </div>
                        ) : (section as { isVideo?: boolean; videoPlaceholder?: boolean }).videoPlaceholder ? (
                          <div className="ml-14 rounded-lg bg-white/5 border border-white/10 p-6 text-center">
                            <PlayCircle className="h-12 w-12 text-white/30 mx-auto mb-3" />
                            <p className="text-sm text-white/50">Video tutorial coming soon!</p>
                            <p className="text-xs text-white/30 mt-1">Check back for a step-by-step walkthrough</p>
                          </div>
                        ) : (
                          <>
                            {section.subtitle && (
                              <h4 className="text-sm font-medium text-white/70 mb-2 ml-14">
                                {section.subtitle}
                              </h4>
                            )}
                            <ul className="space-y-1.5 ml-14">
                              {section.instructions.map((instruction, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                                  <CheckCircle2 className="h-4 w-4 text-white/30 shrink-0 mt-0.5" />
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Links */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/50 mb-3">Quick Links</h3>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Get API Key
              </a>
              <a
                href="https://docs.anthropic.com/en/docs/quickstart"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Anthropic Docs
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-white/10 bg-gray-900/95 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-500 hover:to-teal-400 transition-all"
          >
            Got it, let&apos;s invest!
          </button>
        </div>
      </div>
    </div>
  );
}
