import { useState, useCallback } from 'react';
import { TerminalWindow } from './TerminalWindow';
import {
  SubsectionLabel,
  InfoPanel,
  Button,
  StepDotsNavigation,
} from './shared';

type Signal = 'SIGINT' | 'SIGTSTP';

interface SignalInfo {
  key: string;
  signal: Signal;
  name: string;
  action: string;
  description: string;
  example: string;
}

const SIGNALS: SignalInfo[] = [
  {
    key: 'Ctrl+C',
    signal: 'SIGINT',
    name: 'Interrupt',
    action: 'Stop the running program',
    description:
      "Sends SIGINT (signal interrupt) to the foreground process. Most programs respond by stopping immediately. It's how you cancel a long-running command or exit a program that's stuck.",
    example: 'Running `sleep 100` and pressing Ctrl+C stops it immediately.',
  },
  {
    key: 'Ctrl+Z',
    signal: 'SIGTSTP',
    name: 'Suspend',
    action: 'Pause and move to background',
    description:
      'Sends SIGTSTP (signal terminal stop) to suspend the process. The program pauses but stays in memory. Use `fg` to resume it in the foreground, or `bg` to continue it in the background.',
    example:
      'Suspend vim with Ctrl+Z, run another command, then type `fg` to return.',
  },
];

type ExplainerStep = 'what' | 'how' | 'path' | 'handling';

const EXPLAINER_STEPS: Record<
  ExplainerStep,
  { title: string; description: string }
> = {
  what: {
    title: 'What Are Signals?',
    description:
      'Signals are a way for the operating system to communicate with running programs. When you press Ctrl+C, your terminal sends a byte (0x03) to the PTY—but the kernel intercepts it and converts it into a signal before your program ever sees it.',
  },
  how: {
    title: 'The Line Discipline',
    description:
      "The kernel's PTY has a component called the line discipline. It inspects every byte passing through. When it sees 0x03 (Ctrl+C) and signal handling is enabled, it generates SIGINT instead of passing the byte to the program. This happens in the kernel, not in your terminal emulator.",
  },
  path: {
    title: 'The Signal Path',
    description:
      'When you press Ctrl+C: 1) Your terminal sends byte 0x03 to the PTY master. 2) The kernel line discipline intercepts it. 3) Instead of forwarding the byte, it sends SIGINT to the foreground process group. 4) The process handles or terminates.',
  },
  handling: {
    title: 'Signal Handling',
    description:
      'Programs can choose how to handle signals. Some ignore Ctrl+C (like vim during certain operations). Some catch it to clean up before exiting. Some (like sleep) just die immediately. The default is to terminate.',
  },
};

export function SignalsDemo() {
  const [selectedSignal, setSelectedSignal] = useState<SignalInfo>(SIGNALS[0]);
  const [terminalState, setTerminalState] = useState<
    'idle' | 'running' | 'interrupted' | 'suspended'
  >('idle');
  const [output, setOutput] = useState<string[]>(['$ ']);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('what');

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  const simulateCommand = useCallback(() => {
    setTerminalState('running');
    setOutput(['$ sleep 100', 'sleeping...']);
  }, []);

  // Apply the effect of a signal to the terminal state
  const applySignalEffect = useCallback((signal: Signal) => {
    if (signal === 'SIGINT') {
      setTerminalState('interrupted');
      setOutput((prev) => [...prev, '^C', '$ ']);
    } else if (signal === 'SIGTSTP') {
      setTerminalState('suspended');
      setOutput((prev) => [
        ...prev,
        '^Z',
        '[1]+  Stopped                 sleep 100',
        '$ ',
      ]);
    }
  }, []);

  const simulateSignal = useCallback(
    (signal: Signal) => {
      if (terminalState !== 'running') {
        // Start a "command" first, then apply signal after delay
        simulateCommand();
        setTimeout(() => applySignalEffect(signal), 500);
      } else {
        applySignalEffect(signal);
      }
    },
    [terminalState, simulateCommand, applySignalEffect]
  );

  const resetTerminal = useCallback(() => {
    setTerminalState('idle');
    setOutput(['$ ']);
  }, []);

  return (
    <div className="space-y-8">
      {/* Signal Glossary - side-by-side layout like VocabularyDemo */}
      <div className="bg-terminal-highlight border border-terminal-border flex flex-col lg:flex-row">
        {/* Signal list */}
        <div className="p-4 lg:border-r border-terminal-border lg:w-1/2">
          <div className="font-mono text-sm space-y-1">
            {SIGNALS.map((sig) => {
              const isActive = selectedSignal.key === sig.key;
              return (
                <div
                  key={sig.key}
                  onMouseEnter={() => setSelectedSignal(sig)}
                  className={`w-full text-left px-3 py-3 flex items-center justify-between transition-all cursor-default ${
                    isActive
                      ? 'bg-terminal-border/50 border-l-2 border-terminal-fg'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <code className="text-terminal-yellow font-bold">
                      {sig.key}
                    </code>
                    <span className="text-terminal-fg">{sig.name}</span>
                  </div>
                  <span className="text-terminal-cyan text-sm">
                    {sig.signal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signal details */}
        <div className="p-4 lg:w-1/2 border-t lg:border-t-0 border-terminal-border">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <code className="text-terminal-yellow font-bold text-base">
                  {selectedSignal.key}
                </code>
                <span className="text-terminal-dim">→</span>
                <span className="text-terminal-green font-bold">
                  {selectedSignal.signal}
                </span>
              </div>
              <p className="text-terminal-muted text-xs mt-1">
                {selectedSignal.action}
              </p>
            </div>

            <p className="text-terminal-muted text-sm leading-relaxed">
              {selectedSignal.description}
            </p>

            <div className="bg-terminal-bg border border-terminal-border p-3 text-sm">
              <span className="text-terminal-dim">Example: </span>
              <span className="text-terminal-fg">{selectedSignal.example}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Terminal - now below the glossary */}
      <div className="space-y-4">
        <SubsectionLabel>Try It</SubsectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TerminalWindow>
            <div className="font-mono text-sm min-h-[180px]">
              {output.map((line, idx) => {
                const isLastLine = idx === output.length - 1;
                const showCursor =
                  isLastLine &&
                  (terminalState === 'idle' || terminalState === 'running');
                return (
                  <div
                    key={idx}
                    className={line.startsWith('^') ? 'text-terminal-red' : ''}
                  >
                    {line}
                    {showCursor && <span className="cursor-blink">█</span>}
                  </div>
                );
              })}
            </div>
          </TerminalWindow>

          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={simulateCommand}
                disabled={terminalState === 'running'}
              >
                Run Command
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => simulateSignal('SIGINT')}
              >
                Ctrl+C
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => simulateSignal('SIGTSTP')}
              >
                Ctrl+Z
              </Button>
              <Button size="sm" variant="secondary" onClick={resetTerminal}>
                Reset
              </Button>
            </div>

            {terminalState !== 'idle' && terminalState !== 'running' && (
              <div className="text-sm">
                <span className="text-terminal-dim">State: </span>
                <span
                  className={
                    terminalState === 'interrupted'
                      ? 'text-terminal-red'
                      : 'text-terminal-yellow'
                  }
                >
                  {terminalState === 'interrupted' &&
                    'Process interrupted (killed)'}
                  {terminalState === 'suspended' &&
                    'Process suspended (use `fg` to resume)'}
                </span>
              </div>
            )}

            <p className="text-terminal-dim text-sm">
              Click "Run Command" to start a simulated process, then try sending
              different signals.
            </p>
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

      {/* Signal vs Character Comparison */}
      <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">
          Signals vs Regular Keys
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-terminal-bg border border-terminal-border p-4 space-y-3">
            <div className="text-terminal-fg font-bold text-sm">
              Regular Keys
            </div>
            <div className="font-mono text-sm space-y-1">
              <div>
                <span className="text-terminal-yellow">a</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-cyan">0x61</span>
                <span className="text-terminal-muted">
                  {' '}
                  (character sent to program)
                </span>
              </div>
              <div>
                <span className="text-terminal-yellow">Enter</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-cyan">0x0D</span>
                <span className="text-terminal-muted"> (carriage return)</span>
              </div>
              <div>
                <span className="text-terminal-yellow">↑</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-cyan">^[[A</span>
                <span className="text-terminal-muted"> (escape sequence)</span>
              </div>
            </div>
          </div>

          <div className="bg-terminal-bg border border-terminal-border p-4 space-y-3">
            <div className="text-terminal-fg font-bold text-sm">
              Signal Keys
            </div>
            <div className="font-mono text-sm space-y-1">
              <div>
                <span className="text-terminal-yellow">Ctrl+C</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-cyan">0x03</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-red">SIGINT</span>
              </div>
              <div>
                <span className="text-terminal-yellow">Ctrl+Z</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-cyan">0x1A</span>
                <span className="text-terminal-dim"> → </span>
                <span className="text-terminal-red">SIGTSTP</span>
              </div>
              <div className="text-terminal-dim text-xs mt-2">
                Bytes intercepted by line discipline → converted to signals
              </div>
            </div>
          </div>
        </div>

        <p className="text-terminal-dim text-sm">
          Regular keys become bytes that flow through the PTY to the program.
          Signal keys also become bytes, but the kernel's line discipline
          intercepts them and generates OS signals before they reach the
          program.
        </p>
      </div>
    </div>
  );
}
