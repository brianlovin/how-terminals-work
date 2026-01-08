import { useState, useRef } from 'react';
import { TerminalWindow } from './TerminalWindow';

const SPECIAL_KEYS: Record<
  string,
  { bytes: string; sequence: string; desc: string }
> = {
  ArrowUp: { bytes: '1b 5b 41', sequence: '^[[A', desc: 'Cursor Up' },
  ArrowDown: { bytes: '1b 5b 42', sequence: '^[[B', desc: 'Cursor Down' },
  ArrowRight: { bytes: '1b 5b 43', sequence: '^[[C', desc: 'Cursor Right' },
  ArrowLeft: { bytes: '1b 5b 44', sequence: '^[[D', desc: 'Cursor Left' },
  Enter: { bytes: '0d', sequence: '^M', desc: 'Carriage Return' },
  Tab: { bytes: '09', sequence: '^I', desc: 'Horizontal Tab' },
  Backspace: { bytes: '7f', sequence: '^?', desc: 'Delete' },
  Escape: { bytes: '1b', sequence: '^[', desc: 'Escape' },
};

interface KeyInfo {
  key: string;
  bytes: string;
  sequence: string;
  desc: string;
}

export function KeyboardDemo() {
  const [lastKey, setLastKey] = useState<KeyInfo | null>(null);
  const [history, setHistory] = useState<KeyInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const special = SPECIAL_KEYS[e.code] || SPECIAL_KEYS[e.key];
    const keyInfo: KeyInfo = special
      ? {
          key: e.key,
          bytes: special.bytes,
          sequence: special.sequence,
          desc: special.desc,
        }
      : {
          key: e.key,
          bytes: e.key.charCodeAt(0).toString(16).padStart(2, '0'),
          sequence: e.key,
          desc: `Character '${e.key}'`,
        };

    if (special) e.preventDefault();
    setLastKey(keyInfo);
    setHistory((prev) => [keyInfo, ...prev].slice(0, 8));
  };

  return (
    <div className="space-y-6">
      <TerminalWindow>
        <div
          className="min-h-[180px] flex flex-col items-center justify-center cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            onKeyDown={handleKeyDown}
          />
          {lastKey ? (
            <div className="text-center space-y-4">
              <div className="text-3xl font-medium text-terminal-fg">
                {lastKey.key === ' ' ? 'Space' : lastKey.key}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-terminal-bg p-3">
                  <div className="text-terminal-dim text-xs uppercase tracking-wider mb-1">Bytes</div>
                  <code className="text-terminal-yellow">
                    {lastKey.bytes}
                  </code>
                </div>
                <div className="bg-terminal-bg p-3">
                  <div className="text-terminal-dim text-xs uppercase tracking-wider mb-1">Sequence</div>
                  <code className="text-terminal-cyan">
                    {lastKey.sequence}
                  </code>
                </div>
              </div>
              <div className="text-terminal-muted text-sm">{lastKey.desc}</div>
            </div>
          ) : (
            <div className="text-terminal-muted text-center">
              <div className="text-lg mb-1">Press any key</div>
              <div className="text-sm text-terminal-dim">
                Try arrow keys, Enter, Tab, or letters
              </div>
            </div>
          )}
        </div>
      </TerminalWindow>

      {history.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {history.map((k, i) => (
            <div
              key={i}
              className="bg-terminal-highlight border border-terminal-border px-3 py-1.5 text-sm"
              style={{ opacity: 1 - i * 0.1 }}
            >
              <span className="text-terminal-fg">
                {k.key === ' ' ? '␣' : k.key}
              </span>
              <span className="text-terminal-dim mx-2">→</span>
              <code className="text-terminal-yellow">{k.bytes}</code>
            </div>
          ))}
        </div>
      )}

      <div className="text-terminal-muted text-sm">
        When you press an arrow key, your terminal doesn't send "arrow up" — it
        sends <code className="text-terminal-yellow">ESC [ A</code> (three
        bytes). Programs that don't understand this will print{' '}
        <code className="text-terminal-cyan">^[[A</code> literally.
      </div>
    </div>
  );
}
