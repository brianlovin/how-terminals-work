import { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';
import {
  SubsectionLabel,
  InfoPanel,
  Button,
  StepDotsNavigation,
} from './shared';

type ExplainerStep = 'what' | 'why' | 'how' | 'apps';

const EXPLAINER_STEPS: Record<
  ExplainerStep,
  { title: string; description: string }
> = {
  what: {
    title: 'What Is the Alternate Screen?',
    description:
      'Terminals have two screen buffers: the normal screen (with your scrollback history) and the alternate screen (a separate canvas). Programs can switch between them. When they exit, your original screen reappears.',
  },
  why: {
    title: 'Why Does This Exist?',
    description:
      "Without the alternate screen, full-screen apps like vim would draw all over your terminal history. When you quit, you'd see vim's last screen mixed with your old output. The alternate screen keeps your scrollback clean.",
  },
  how: {
    title: 'How It Works',
    description:
      'Programs send an escape sequence to enter alternate screen mode: ^[[?1049h. When they exit, they send ^[[?1049l to return to the normal screen. The terminal swaps buffers, preserving your history.',
  },
  apps: {
    title: 'Apps That Use It',
    description:
      "vim, less, man, htop, tmux, and most TUI apps use the alternate screen. When you quit these apps, notice how your previous terminal output reappears? That's the alternate screen at work.",
  },
};

// Sample terminal content for normal mode
const NORMAL_SCREEN_CONTENT = [
  '$ ls -la',
  'total 32',
  'drwxr-xr-x  5 user staff  160 Jan  8 10:30 .',
  'drwxr-xr-x  8 user staff  256 Jan  7 14:22 ..',
  '-rw-r--r--  1 user staff  847 Jan  8 10:30 package.json',
  '-rw-r--r--  1 user staff 1205 Jan  8 10:28 README.md',
  'drwxr-xr-x 12 user staff  384 Jan  8 10:30 src',
  '$ git status',
  'On branch main',
  'nothing to commit, working tree clean',
  '$ vim README.md',
];

// Simulated vim content for alternate screen
const ALTERNATE_SCREEN_CONTENT = [
  '# My Project',
  '',
  'This is a sample README file.',
  '',
  '## Getting Started',
  '',
  '```bash',
  'npm install',
  'npm start',
  '```',
  '',
  '~',
  '~',
  '~',
];

export function AlternateScreenDemo() {
  const [isAlternateScreen, setIsAlternateScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('what');

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  const toggleScreen = () => {
    setIsAlternateScreen((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      {/* Main Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal Simulation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={toggleScreen}>
              {isAlternateScreen ? 'Exit vim (:q)' : 'Open vim'}
            </Button>
            <span
              className={`px-2 py-1 text-xs ${
                isAlternateScreen
                  ? 'bg-terminal-cyan/20 text-terminal-cyan'
                  : 'bg-terminal-green/20 text-terminal-green'
              }`}
            >
              {isAlternateScreen ? 'Alternate Buffer' : 'Normal Buffer'}
            </span>
          </div>

          <TerminalWindow>
            <div className="font-mono text-sm min-h-[300px] relative overflow-hidden">
              {/* Normal screen with transition */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isAlternateScreen
                    ? 'opacity-0 transform -translate-x-full'
                    : 'opacity-100 transform translate-x-0'
                }`}
              >
                {NORMAL_SCREEN_CONTENT.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith('$')
                        ? 'text-terminal-green'
                        : line.startsWith('drwx') || line.startsWith('-rw')
                          ? 'text-terminal-cyan'
                          : 'text-terminal-fg'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Alternate screen (vim) with transition */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isAlternateScreen
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-full'
                }`}
              >
                {/* Vim header */}
                <div className="bg-terminal-blue/20 text-terminal-blue px-2 mb-1 text-xs">
                  README.md [+]
                </div>
                {/* Vim content */}
                {ALTERNATE_SCREEN_CONTENT.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line === '~'
                        ? 'text-terminal-blue'
                        : line.startsWith('#')
                          ? 'text-terminal-yellow'
                          : line.startsWith('```')
                            ? 'text-terminal-green'
                            : 'text-terminal-fg'
                    }
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
                {/* Vim status line */}
                <div className="absolute bottom-0 left-0 right-0 bg-terminal-dim text-terminal-bg px-2 text-xs flex justify-between">
                  <span>-- INSERT --</span>
                  <span>1,1 All</span>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </div>

        {/* Escape Sequences */}
        <div className="space-y-4">
          <SubsectionLabel>The Escape Sequences</SubsectionLabel>

          <div className="space-y-3">
            <div
              className={`p-4 border transition-all ${
                !isAlternateScreen
                  ? 'border-terminal-green bg-terminal-green/5'
                  : 'border-terminal-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-terminal-green font-bold text-sm">
                  Enter Alternate Screen
                </span>
                <code className="text-terminal-yellow text-xs">^[[?1049h</code>
              </div>
              <p className="text-terminal-muted text-sm">
                Saves the current screen, clears display, and switches to the
                alternate buffer. Sent when opening vim, less, htop, etc.
              </p>
            </div>

            <div
              className={`p-4 border transition-all ${
                isAlternateScreen
                  ? 'border-terminal-cyan bg-terminal-cyan/5'
                  : 'border-terminal-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-terminal-cyan font-bold text-sm">
                  Exit Alternate Screen
                </span>
                <code className="text-terminal-yellow text-xs">^[[?1049l</code>
              </div>
              <p className="text-terminal-muted text-sm">
                Restores the saved screen buffer. Your previous terminal content
                reappears exactly as it was. Sent when quitting the app.
              </p>
            </div>
          </div>

          {/* Visual representation of buffer swap */}
          <div className="bg-terminal-highlight border border-terminal-border p-4 space-y-3">
            <div className="text-terminal-fg text-sm font-bold">
              Buffer Layout
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex-1 p-3 border-2 text-center text-sm transition-all ${
                  !isAlternateScreen
                    ? 'border-terminal-green bg-terminal-green/10 text-terminal-green'
                    : 'border-terminal-border text-terminal-dim'
                }`}
              >
                Normal Buffer
                <div className="text-xs mt-1 opacity-70">(your history)</div>
              </div>
              <div className="text-terminal-dim">⇄</div>
              <div
                className={`flex-1 p-3 border-2 text-center text-sm transition-all ${
                  isAlternateScreen
                    ? 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan'
                    : 'border-terminal-border text-terminal-dim'
                }`}
              >
                Alternate Buffer
                <div className="text-xs mt-1 opacity-70">(app's canvas)</div>
              </div>
            </div>
            <p className="text-terminal-dim text-xs text-center">
              Only one buffer is visible at a time. The other is preserved in
              memory.
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

      {/* Without Alternate Screen */}
      <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">
          What Would Happen Without It?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-terminal-fg font-bold text-sm">
              Without Alternate Screen
            </div>
            <div className="bg-terminal-bg border border-terminal-border p-3 font-mono text-xs space-y-1">
              <div className="text-terminal-muted">$ ls</div>
              <div className="text-terminal-muted">file1.txt file2.txt</div>
              <div className="text-terminal-muted">$ vim README.md</div>
              <div className="text-terminal-yellow"># My Project</div>
              <div>~</div>
              <div>~</div>
              <div className="text-terminal-dim">-- INSERT --</div>
              <div className="text-terminal-muted">... (quit vim)</div>
              <div className="text-terminal-red">
                ← vim's output stays mixed with history!
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-terminal-fg font-bold text-sm">
              With Alternate Screen
            </div>
            <div className="bg-terminal-bg border border-terminal-border p-3 font-mono text-xs space-y-1">
              <div className="text-terminal-muted">$ ls</div>
              <div className="text-terminal-muted">file1.txt file2.txt</div>
              <div className="text-terminal-muted">$ vim README.md</div>
              <div className="text-terminal-dim">
                (vim opens on alternate screen...)
              </div>
              <div className="text-terminal-dim">(you edit, then :q...)</div>
              <div className="text-terminal-muted">$ ls</div>
              <div className="text-terminal-muted">file1.txt file2.txt</div>
              <div className="text-terminal-green">
                ← Your history is intact!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
