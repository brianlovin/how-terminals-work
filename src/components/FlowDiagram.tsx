import { useState, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow';

type Phase =
  | 'idle'
  | 'keystroke'
  | 'terminal-encode'
  | 'pty-to-shell'
  | 'shell-process'
  | 'shell-output'
  | 'pty-to-terminal'
  | 'terminal-render'
  | 'done';

interface Step {
  phase: Phase;
  title: string;
  description: string;
  terminalContent: string[];
  highlight: 'keyboard' | 'terminal' | 'pty' | 'shell' | null;
  dataPacket?: string;
  dataDirection?: 'down' | 'up';
}

const STEPS: Step[] = [
  {
    phase: 'idle',
    title: 'Ready',
    description: 'The terminal is waiting. The cursor blinks.',
    terminalContent: ['$ ▌'],
    highlight: null,
  },
  {
    phase: 'keystroke',
    title: "You type 'ls'",
    description: 'Each keystroke is a separate event sent to the terminal.',
    terminalContent: ['$ ls▌'],
    highlight: 'keyboard',
    dataPacket: 'l s',
    dataDirection: 'down',
  },
  {
    phase: 'terminal-encode',
    title: 'Terminal encodes keystrokes',
    description:
      "The terminal converts your keystrokes into bytes: 'l' → 0x6C, 's' → 0x73",
    terminalContent: ['$ ls▌'],
    highlight: 'terminal',
    dataPacket: '0x6C 0x73',
    dataDirection: 'down',
  },
  {
    phase: 'pty-to-shell',
    title: 'PTY forwards to shell',
    description:
      'The pseudo-terminal pipes the bytes to the shell process (like bash or zsh).',
    terminalContent: ['$ ls▌'],
    highlight: 'pty',
    dataPacket: '0x6C 0x73',
    dataDirection: 'down',
  },
  {
    phase: 'shell-process',
    title: 'Shell receives and echoes',
    description:
      "The shell reads 'ls', echoes it back so you see what you typed, and waits for Enter.",
    terminalContent: ['$ ls▌'],
    highlight: 'shell',
  },
  {
    phase: 'shell-output',
    title: "You press Enter → Shell runs 'ls'",
    description:
      "The shell executes 'ls', which lists files. The output is just text with escape codes for colors.",
    terminalContent: [
      '$ ls',
      '\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m',
      '$ ▌',
    ],
    highlight: 'shell',
    dataPacket: '\\x1b[34mDocuments...',
    dataDirection: 'up',
  },
  {
    phase: 'pty-to-terminal',
    title: 'Output flows back through PTY',
    description:
      "The shell's output travels back through the PTY to the terminal.",
    terminalContent: [
      '$ ls',
      '\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m',
      '$ ▌',
    ],
    highlight: 'pty',
    dataPacket: '\\x1b[34mDocuments...',
    dataDirection: 'up',
  },
  {
    phase: 'terminal-render',
    title: 'Terminal renders output',
    description:
      'The terminal interprets escape sequences (\\x1b[34m = blue) and draws colored text to the grid.',
    terminalContent: [
      '$ ls',
      '\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m',
      '$ ▌',
    ],
    highlight: 'terminal',
  },
  {
    phase: 'done',
    title: 'Complete',
    description:
      'The full round trip: keystroke → encode → shell → execute → output → render. Repeat!',
    terminalContent: [
      '$ ls',
      '\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m',
      '$ ▌',
    ],
    highlight: null,
  },
];

// Standard 16-color ANSI code to Tailwind class mapping
const ANSI_COLOR_MAP: Record<string, string> = {
  // Normal colors (30-37)
  '30': 'text-terminal-black',
  '31': 'text-terminal-red',
  '32': 'text-terminal-green',
  '33': 'text-terminal-yellow',
  '34': 'text-terminal-blue',
  '35': 'text-terminal-magenta',
  '36': 'text-terminal-cyan',
  '37': 'text-terminal-white',
  // Bright colors (90-97)
  '90': 'text-terminal-bright-black',
  '91': 'text-terminal-bright-red',
  '92': 'text-terminal-bright-green',
  '93': 'text-terminal-bright-yellow',
  '94': 'text-terminal-bright-blue',
  '95': 'text-terminal-bright-magenta',
  '96': 'text-terminal-bright-cyan',
  '97': 'text-terminal-bright-white',
};

function renderTerminalLine(line: string) {
  // Simple escape sequence parser for demo
  const parts: { text: string; color?: string }[] = [];
  let current = '';
  let currentColor: string | undefined;
  let i = 0;

  while (i < line.length) {
    if (line[i] === '\x1b' && line[i + 1] === '[') {
      if (current) {
        parts.push({ text: current, color: currentColor });
        current = '';
      }
      // Find the end of escape sequence
      let j = i + 2;
      while (j < line.length && line[j] !== 'm') j++;
      const code = line.slice(i + 2, j);
      if (code === '0') currentColor = undefined;
      else if (ANSI_COLOR_MAP[code]) currentColor = ANSI_COLOR_MAP[code];
      i = j + 1;
    } else {
      current += line[i];
      i++;
    }
  }
  if (current) parts.push({ text: current, color: currentColor });

  return parts.map((p, idx) => (
    <span key={idx} className={p.color}>
      {p.text.includes('▌') ? (
        <>
          {p.text.replace('▌', '')}
          <span className="cursor-blink bg-terminal-green text-terminal-bg">
            ▌
          </span>
        </>
      ) : (
        p.text
      )}
    </span>
  ));
}

export function FlowDiagram() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStep = STEPS[stepIndex]!;

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStepIndex(0);
  };

  useEffect(() => {
    if (!isAnimating) return;
    if (stepIndex >= STEPS.length - 1) {
      setIsAnimating(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 1500);
    return () => clearTimeout(timer);
  }, [isAnimating, stepIndex]);

  const goToStep = (index: number) => {
    setIsAnimating(false);
    setStepIndex(index);
  };

  const layerClass = (layer: 'keyboard' | 'terminal' | 'pty' | 'shell') =>
    `relative px-4 py-3 border transition-all duration-300 ${
      currentStep.highlight === layer
        ? 'border-terminal-fg bg-terminal-fg/5'
        : 'border-terminal-border bg-terminal-bg/50'
    }`;

  return (
    <div className="space-y-6">
      {/* Main visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: The layer diagram */}
        <div className="space-y-3">
          <label className="block text-terminal-yellow text-xs uppercase tracking-wider mb-3">
            Terminal Stack
          </label>

          {/* Keyboard/You layer */}
          <div className={layerClass('keyboard')}>
            <div className="flex items-center gap-3">
              <span className="text-terminal-dim">[kbd]</span>
              <div>
                <div className="font-bold text-sm">You (Keyboard)</div>
                <div className="text-xs text-terminal-dim">
                  Physical keystrokes
                </div>
              </div>
            </div>
            {currentStep.dataPacket &&
              currentStep.dataDirection === 'down' &&
              currentStep.highlight === 'keyboard' && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs font-mono">
                    {currentStep.dataPacket}
                  </div>
                </div>
              )}
          </div>

          <div className="flex justify-center text-terminal-dim">
            <span
              className={
                currentStep.dataDirection === 'down'
                  ? 'text-terminal-green'
                  : ''
              }
            >
              ↓
            </span>
            <span className="mx-2">/</span>
            <span
              className={
                currentStep.dataDirection === 'up' ? 'text-terminal-green' : ''
              }
            >
              ↑
            </span>
          </div>

          {/* Terminal layer */}
          <div className={layerClass('terminal')}>
            <div className="flex items-center gap-3">
              <span className="text-terminal-dim">[tty]</span>
              <div>
                <div className="font-bold text-sm">Terminal Emulator</div>
                <div className="text-xs text-terminal-dim">
                  Encodes input, renders output
                </div>
              </div>
            </div>
            {currentStep.dataPacket && currentStep.highlight === 'terminal' && (
              <div
                className={`absolute ${currentStep.dataDirection === 'down' ? '-bottom-6' : '-top-6'} left-1/2 transform -translate-x-1/2 z-10`}
              >
                <div className="bg-terminal-yellow text-terminal-bg px-2 py-1 text-xs font-mono">
                  {currentStep.dataPacket}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center text-terminal-dim">
            <span
              className={
                currentStep.dataDirection === 'down'
                  ? 'text-terminal-green'
                  : ''
              }
            >
              ↓
            </span>
            <span className="mx-2">/</span>
            <span
              className={
                currentStep.dataDirection === 'up' ? 'text-terminal-green' : ''
              }
            >
              ↑
            </span>
          </div>

          {/* PTY layer */}
          <div className={layerClass('pty')}>
            <div className="flex items-center gap-3">
              <span className="text-terminal-dim">[pty]</span>
              <div>
                <div className="font-bold text-sm">PTY (Pseudo-Terminal)</div>
                <div className="text-xs text-terminal-dim">
                  Bidirectional pipe
                </div>
              </div>
            </div>
            {currentStep.dataPacket && currentStep.highlight === 'pty' && (
              <div
                className={`absolute ${currentStep.dataDirection === 'down' ? '-bottom-6' : '-top-6'} left-1/2 transform -translate-x-1/2 z-10`}
              >
                <div className="bg-terminal-magenta text-terminal-bg px-2 py-1 text-xs font-mono">
                  {currentStep.dataPacket}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center text-terminal-dim">
            <span
              className={
                currentStep.dataDirection === 'down'
                  ? 'text-terminal-green'
                  : ''
              }
            >
              ↓
            </span>
            <span className="mx-2">/</span>
            <span
              className={
                currentStep.dataDirection === 'up' ? 'text-terminal-green' : ''
              }
            >
              ↑
            </span>
          </div>

          {/* Shell layer */}
          <div className={layerClass('shell')}>
            <div className="flex items-center gap-3">
              <span className="text-terminal-dim">[sh]</span>
              <div>
                <div className="font-bold text-sm">Shell / Program</div>
                <div className="text-xs text-terminal-dim">
                  bash, zsh, or any CLI program
                </div>
              </div>
            </div>
            {currentStep.dataPacket &&
              currentStep.dataDirection === 'up' &&
              currentStep.highlight === 'shell' && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-terminal-cyan text-terminal-bg px-2 py-1 text-xs font-mono">
                    {currentStep.dataPacket}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Right: What you see */}
        <div className="space-y-4">
          <label className="block text-terminal-yellow text-xs uppercase tracking-wider mb-3">
            Output
          </label>
          <TerminalWindow>
            <div className="font-mono text-sm space-y-1 min-h-[120px]">
              {currentStep.terminalContent.map((line, i) => (
                <div key={i}>{renderTerminalLine(line)}</div>
              ))}
            </div>
          </TerminalWindow>

          {/* Step info */}
          <div className="bg-terminal-highlight border border-terminal-border px-4 py-3">
            <div className="text-terminal-red text-sm font-medium mb-1">
              {currentStep.title}
            </div>
            <div className="text-terminal-muted text-sm">
              {currentStep.description}
            </div>
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {STEPS.map((step, i) => (
          <button
            key={step.phase}
            onClick={() => goToStep(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === stepIndex
                ? 'bg-terminal-fg scale-125'
                : i < stepIndex
                  ? 'bg-terminal-muted'
                  : 'bg-terminal-border'
            }`}
            title={step.title}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => goToStep(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          className="px-4 py-2 border border-terminal-border text-terminal-muted text-sm hover:border-terminal-dim hover:text-terminal-fg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`px-5 py-2 text-sm font-medium transition-all ${
            isAnimating
              ? 'bg-terminal-dim text-terminal-bg cursor-not-allowed'
              : 'bg-terminal-fg text-terminal-bg hover:bg-terminal-bright-white'
          }`}
        >
          {isAnimating ? 'Playing...' : 'Play'}
        </button>
        <button
          onClick={() => goToStep(Math.min(STEPS.length - 1, stepIndex + 1))}
          disabled={stepIndex === STEPS.length - 1}
          className="px-4 py-2 border border-terminal-border text-terminal-muted text-sm hover:border-terminal-dim hover:text-terminal-fg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
