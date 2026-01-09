import { useState, useCallback, useRef } from 'react';
import { TerminalWindow } from './TerminalWindow';
import {
  SubsectionLabel,
  InfoPanel,
  Button,
  StepDotsNavigation,
} from './shared';

type InputMode = 'cooked' | 'raw';

type ExplainerStep = 'cooked' | 'raw' | 'difference' | 'examples';

const EXPLAINER_STEPS: Record<
  ExplainerStep,
  { title: string; description: string }
> = {
  cooked: {
    title: 'Cooked Mode (Line-Buffered)',
    description:
      'In cooked mode (also called canonical mode), the terminal collects your input into a line buffer. You can edit with backspace, and nothing is sent to the program until you press Enter. This is how your shell normally works.',
  },
  raw: {
    title: 'Raw Mode (Character-at-a-Time)',
    description:
      'In raw mode, every keystroke is sent to the program immediately—no buffering, no line editing. The program sees each key the instant you press it. This is how vim, htop, and other interactive programs work.',
  },
  difference: {
    title: 'Why Two Modes?',
    description:
      "Cooked mode lets the terminal handle basic editing (backspace, line recall) so every program doesn't have to implement it. Raw mode gives programs full control over input—essential for editors, games, and TUIs that need instant key response.",
  },
  examples: {
    title: 'Real-World Examples',
    description:
      'Your shell (bash/zsh) uses cooked mode—type, edit, then press Enter. Vim uses raw mode—press j and you immediately move down. SSH uses raw mode to forward your keys. Even Ctrl+C works differently: in cooked mode, the terminal handles it; in raw mode, the program must.',
  },
};

export function InputModesDemo() {
  const [mode, setMode] = useState<InputMode>('cooked');
  const [buffer, setBuffer] = useState('');
  const [sentLines, setSentLines] = useState<string[]>([]);
  const [rawKeyHistory, setRawKeyHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('cooked');
  const inputRef = useRef<HTMLInputElement>(null);

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (mode === 'cooked') {
        // Cooked mode: standard behavior, only send on Enter
        if (e.key === 'Enter') {
          e.preventDefault();
          if (buffer.trim()) {
            setSentLines((prev) => [...prev, buffer]);
            setBuffer('');
          }
        }
        // Backspace and other editing is handled automatically
      } else {
        // Raw mode: every key is immediately "sent"
        e.preventDefault();
        let keyName = e.key;
        if (e.key === ' ') keyName = 'Space';
        if (e.key === 'Backspace') keyName = 'BS';
        if (e.key === 'Enter') keyName = 'Enter';
        if (e.key === 'Escape') keyName = 'Esc';
        if (e.key === 'ArrowUp') keyName = '↑';
        if (e.key === 'ArrowDown') keyName = '↓';
        if (e.key === 'ArrowLeft') keyName = '←';
        if (e.key === 'ArrowRight') keyName = '→';
        if (e.key === 'Tab') keyName = 'Tab';

        setRawKeyHistory((prev) => [...prev.slice(-11), keyName]);
      }
    },
    [mode, buffer]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mode === 'cooked') {
        setBuffer(e.target.value);
      }
      // In raw mode, onChange doesn't do anything meaningful
    },
    [mode]
  );

  const reset = useCallback(() => {
    setBuffer('');
    setSentLines([]);
    setRawKeyHistory([]);
  }, []);

  // Reset state when mode changes
  const handleModeChange = useCallback((newMode: InputMode) => {
    setMode(newMode);
    setBuffer('');
    setSentLines([]);
    setRawKeyHistory([]);
  }, []);

  // Focus input when clicking anywhere in the terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <SubsectionLabel className="mb-0">Input Mode:</SubsectionLabel>
        <div className="inline-flex">
          <button
            onClick={() => handleModeChange('cooked')}
            className={`px-4 py-2 text-sm border transition-all ${
              mode === 'cooked'
                ? 'border-terminal-green bg-terminal-green/20 text-terminal-green z-10'
                : 'border-terminal-border text-terminal-muted hover:text-terminal-fg'
            }`}
          >
            Cooked (Line-Buffered)
          </button>
          <button
            onClick={() => handleModeChange('raw')}
            className={`px-4 py-2 text-sm border transition-all -ml-px ${
              mode === 'raw'
                ? 'border-terminal-green bg-terminal-green/20 text-terminal-green z-10'
                : 'border-terminal-border text-terminal-muted hover:text-terminal-fg'
            }`}
          >
            Raw (Immediate)
          </button>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal Simulation */}
        <div className="space-y-4">
          <SubsectionLabel>
            {mode === 'cooked'
              ? 'Type, Edit, Then Enter'
              : 'Every Key Sent Instantly'}
          </SubsectionLabel>
          <TerminalWindow>
            <div
              className="font-mono text-sm min-h-[200px] cursor-text"
              onClick={focusInput}
            >
              {mode === 'cooked' ? (
                <>
                  {/* Cooked mode: show line history and current buffer */}
                  {sentLines.map((line, idx) => (
                    <div key={idx} className="text-terminal-muted">
                      $ {line}
                    </div>
                  ))}
                  <div className="flex items-center">
                    <span className="text-terminal-green">$</span>
                    <span className="ml-2 text-terminal-fg">{buffer}</span>
                    <span className="cursor-blink">█</span>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={buffer}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="sr-only"
                  />
                </>
              ) : (
                <>
                  {/* Raw mode: show key-by-key display */}
                  <div className="flex flex-wrap gap-1 min-h-[60px]">
                    {rawKeyHistory.map((key, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs border border-terminal-border ${
                          idx === rawKeyHistory.length - 1
                            ? 'bg-terminal-green/20 text-terminal-green border-terminal-green'
                            : 'bg-terminal-highlight text-terminal-fg'
                        }`}
                        style={{
                          opacity: 0.5 + (idx / rawKeyHistory.length) * 0.5,
                        }}
                      >
                        {key}
                      </span>
                    ))}
                    {rawKeyHistory.length === 0 && (
                      <span className="text-terminal-dim text-xs">
                        Start typing...
                      </span>
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value=""
                    onChange={() => {}}
                    onKeyDown={handleKeyDown}
                    className="sr-only"
                  />
                  <div className="mt-4 text-terminal-dim text-xs">
                    Click here and type. Each key appears instantly.
                  </div>
                </>
              )}
            </div>
          </TerminalWindow>
          <Button size="sm" variant="secondary" onClick={reset}>
            Clear
          </Button>
        </div>

        {/* What's Happening */}
        <div className="space-y-4">
          <SubsectionLabel>What's Happening</SubsectionLabel>
          <div className="bg-terminal-highlight border border-terminal-border p-4 space-y-4">
            {mode === 'cooked' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-green font-bold">
                    Cooked Mode
                  </span>
                  <span className="text-terminal-dim text-sm">(canonical)</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">1.</span>
                    <span className="text-terminal-muted">
                      You type characters. They go into a{' '}
                      <span className="text-terminal-yellow">line buffer</span>.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">2.</span>
                    <span className="text-terminal-muted">
                      <span className="text-terminal-yellow">Backspace</span>{' '}
                      removes characters from the buffer.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">3.</span>
                    <span className="text-terminal-muted">
                      <span className="text-terminal-yellow">Enter</span> sends
                      the entire line to the program.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">4.</span>
                    <span className="text-terminal-muted">
                      The program sees:{' '}
                      <code className="text-terminal-green">
                        "{buffer || '...'}\\n"
                      </code>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-red font-bold">Raw Mode</span>
                  <span className="text-terminal-dim text-sm">
                    (non-canonical)
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">1.</span>
                    <span className="text-terminal-muted">
                      You press a key. It's{' '}
                      <span className="text-terminal-yellow">immediately</span>{' '}
                      sent.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">2.</span>
                    <span className="text-terminal-muted">
                      <span className="text-terminal-yellow">No buffer</span>—no
                      line editing by the terminal.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">3.</span>
                    <span className="text-terminal-muted">
                      <span className="text-terminal-yellow">Backspace</span> is
                      just another key the program receives.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-terminal-cyan">4.</span>
                    <span className="text-terminal-muted">
                      The program handles everything: cursor, display, editing.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Explainer */}
      <InfoPanel className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="text-terminal-red font-medium text-sm">
            {stepContent.title}
          </div>
          <StepDotsNavigation
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>
        <p className="text-terminal-muted text-sm leading-relaxed">
          {stepContent.description}
        </p>
      </InfoPanel>

      {/* Comparison Table */}
      <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">
          Cooked vs Raw: Quick Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left py-2 text-terminal-dim">Behavior</th>
                <th className="text-left py-2 text-terminal-green">
                  Cooked Mode
                </th>
                <th className="text-left py-2 text-terminal-red">Raw Mode</th>
              </tr>
            </thead>
            <tbody className="text-terminal-muted">
              <tr className="border-b border-terminal-border/50">
                <td className="py-2">When input is sent</td>
                <td className="py-2">After pressing Enter</td>
                <td className="py-2">Immediately per key</td>
              </tr>
              <tr className="border-b border-terminal-border/50">
                <td className="py-2">Backspace</td>
                <td className="py-2">Deletes from buffer</td>
                <td className="py-2">Just another key</td>
              </tr>
              <tr className="border-b border-terminal-border/50">
                <td className="py-2">Ctrl+C</td>
                <td className="py-2">Terminal sends SIGINT</td>
                <td className="py-2">Program receives ^C</td>
              </tr>
              <tr className="border-b border-terminal-border/50">
                <td className="py-2">Arrow keys</td>
                <td className="py-2">Line recall (history)</td>
                <td className="py-2">Program handles it</td>
              </tr>
              <tr>
                <td className="py-2">Used by</td>
                <td className="py-2 text-terminal-cyan">bash, zsh, cat</td>
                <td className="py-2 text-terminal-cyan">
                  vim, htop, ssh, less
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
