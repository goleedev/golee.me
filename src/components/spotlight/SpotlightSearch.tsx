import { useEffect, useRef, useState } from 'react';

const SUGGESTIONS = [
  { emoji: '🛠️', text: "What's her tech stack?" },
  { emoji: '🌍', text: 'Tell me about DefyDefault' },
  { emoji: '📬', text: 'How can I contact her?' },
  { emoji: '✨', text: 'Fun facts about Go?' },
];

const SuggestionRow = ({
  emoji,
  text,
  onClick,
  disabled,
}: {
  emoji: string;
  text: string;
  onClick: () => void;
  disabled: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 text-left transition-colors"
      style={{
        padding: '9px 12px',
        borderRadius: '10px',
        minHeight: 'unset',
        minWidth: 'unset',
        background: hovered ? 'rgba(0,122,255,0.7)' : 'transparent',
      }}
    >
      <span
        style={{
          fontSize: '16px',
          lineHeight: 1,
          width: '20px',
          textAlign: 'center',
        }}
      >
        {emoji}
      </span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.7)',
          transition: 'color 0.1s',
        }}
      >
        {text}
      </span>
    </button>
  );
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

interface SpotlightSearchProps {
  onClose: () => void;
}

export const SpotlightSearch = ({ onClose }: SpotlightSearchProps) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const FUN_FACTS = [
    'Tell me about the time Go took a bamboo raft on the Amnok River and saw North Korea.',
    "Tell me about Go's obsession with Friends and her favorite character.",
    "Tell me about Go's favorite thriller and horror movies.",
  ];

  const resolveQuestion = (question: string) => {
    if (question === 'Fun facts about Go?') {
      return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    }
    return question;
  };

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const resolved = resolveQuestion(trimmed);

    setQuery('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: '', streaming: true },
    ]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: resolved,
          history: messages
            .filter((m) => !m.streaming && m.content)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
          },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);

            // Workers AI (llama) format
            if (typeof parsed.response === 'string') {
              accumulated += parsed.response;
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: accumulated, streaming: true },
              ]);
            }

            // Claude API format (fallback)
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              parsed.delta?.text
            ) {
              accumulated += parsed.delta.text;
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: accumulated, streaming: true },
              ]);
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: accumulated || 'No response received.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Network error. Please check your connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99998]"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="spotlight-panel fixed left-1/2 -translate-x-1/2 z-[99999] flex flex-col overflow-hidden"
        style={{
          top: '64px',
          width: 'min(680px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 104px)',
          borderRadius: '18px',
          background: 'rgba(235, 235, 240, 0.85)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.5) inset',
        }}
      >
        {/* Search input row — macOS Spotlight feel */}
        <div
          className="flex items-center gap-3 px-5 shrink-0"
          style={{
            height: '64px',
            borderBottom: hasMessages ? '1px solid rgba(0,0,0,0.1)' : undefined,
          }}
        >
          {/* Search icon or spinner */}
          {isLoading ? (
            <div
              className="shrink-0 w-5 h-5 rounded-full border-2 border-black/20 border-t-black/60"
              style={{ animation: 'spin 0.7s linear infinite' }}
            />
          ) : (
            <svg
              className="shrink-0 w-5 h-5"
              style={{ color: 'rgba(0,0,0,0.3)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M16.5 16.5l4 4" />
            </svg>
          )}

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                ask(query);
              }
            }}
            placeholder={
              hasMessages ? 'Ask a follow-up...' : 'Ask me anything about Go...'
            }
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: '20px',
              fontWeight: 300,
              color: 'rgba(0,0,0,0.85)',
              letterSpacing: '-0.01em',
            }}
            disabled={isLoading}
          />

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {hasMessages && !isLoading && (
              <button
                onClick={handleClear}
                style={{
                  fontSize: '11px',
                  color: 'rgba(0,0,0,0.3)',
                  background: 'rgba(0,0,0,0.08)',
                  borderRadius: '6px',
                  padding: '3px 7px',
                  cursor: 'pointer',
                  minHeight: 'unset',
                  minWidth: 'unset',
                  border: 'none',
                  fontFamily: 'monospace',
                }}
              >
                ← back
              </button>
            )}
            <kbd
              style={{
                fontSize: '11px',
                color: 'rgba(0,0,0,0.3)',
                background: 'rgba(0,0,0,0.08)',
                borderRadius: '6px',
                padding: '3px 7px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
              onClick={onClose}
            >
              esc
            </kbd>
          </div>
        </div>

        {/* Message thread */}
        {hasMessages && (
          <div
            className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                // User — right aligned, pill style
                <div key={i} className="flex justify-end">
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.08)',
                      borderRadius: '14px',
                      padding: '8px 14px',
                      maxWidth: '75%',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'rgba(0,0,0,0.75)',
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ) : (
                // Assistant — full width, clean text
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.08)',
                      fontSize: '11px',
                      color: 'rgba(0,0,0,0.4)',
                      marginTop: '2px',
                    }}
                  >
                    ✦
                  </div>
                  <div
                    className="flex-1"
                    style={{
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'rgba(0,0,0,0.8)',
                      lineHeight: 1.75,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content ? (
                      <>
                        {msg.content}
                        {msg.streaming && (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '2px',
                              height: '14px',
                              background: 'rgba(0,0,0,0.5)',
                              marginLeft: '2px',
                              verticalAlign: 'middle',
                              borderRadius: '1px',
                              animation: 'blink 1s step-end infinite',
                            }}
                          />
                        )}
                      </>
                    ) : (
                      // Typing dots
                      <div
                        className="flex gap-1 items-center"
                        style={{ height: '24px' }}
                      >
                        {[0, 1, 2].map((j) => (
                          <div
                            key={j}
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'rgba(0,0,0,0.25)',
                              animation: 'dotBounce 1.2s ease infinite',
                              animationDelay: `${j * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Suggestions — macOS list style */}
        {!hasMessages && (
          <div className="px-3 py-2 shrink-0">
            {SUGGESTIONS.map((s) => (
              <SuggestionRow
                key={s.text}
                emoji={s.emoji}
                text={s.text}
                onClick={() => ask(s.text)}
                disabled={isLoading}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-2.5 shrink-0"
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'rgba(0,0,0,0.28)',
              letterSpacing: '0.01em',
            }}
          >
            Powered by Workers AI · Llama 3.3 70B
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
};
