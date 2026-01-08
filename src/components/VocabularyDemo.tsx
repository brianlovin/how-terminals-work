import { useState } from 'react';
import { NumberedStepNavigation, SubsectionLabel, Button } from './shared';

type Term =
  | 'terminal'
  | 'shell'
  | 'terminal-emulator'
  | 'pty'
  | 'bash'
  | 'zsh'
  | 'console'
  | 'cli';

interface TermDefinition {
  name: string;
  shortName?: string;
  category: 'hardware' | 'software' | 'shell' | 'interface';
  definition: string;
  examples: string[];
  alsoKnownAs?: string[];
}

const TERMS: Record<Term, TermDefinition> = {
  terminal: {
    name: 'Terminal',
    category: 'hardware',
    definition:
      'Originally a physical device with a screen and keyboard that connected to a mainframe computer. Today, the word usually refers to a terminal emulator.',
    examples: ['VT100', 'VT220', 'IBM 3270'],
    alsoKnownAs: ['TTY', 'Teletype'],
  },
  'terminal-emulator': {
    name: 'Terminal Emulator',
    category: 'software',
    definition:
      'A program that emulates a physical terminal. It draws the character grid, handles input/output, and connects to a shell. This is what you actually run on your computer.',
    examples: [
      'iTerm2',
      'Terminal.app',
      'Windows Terminal',
      'Alacritty',
      'kitty',
      'Warp',
      'Ghostty',
      'WezTerm',
    ],
  },
  shell: {
    name: 'Shell',
    category: 'software',
    definition:
      'A program that interprets commands. The shell reads what you type, executes programs, and handles things like pipes, redirects, and scripting. The terminal emulator is just the window; the shell is the program running inside it.',
    examples: [
      'sh',
      'bash',
      'zsh',
      'fish',
      'ksh',
      'tcsh',
      'PowerShell',
      'nushell',
    ],
  },
  pty: {
    name: 'PTY (Pseudo-Terminal)',
    shortName: 'PTY',
    category: 'software',
    definition:
      'A kernel feature that creates a fake terminal device. It has two ends: the master (connected to your terminal emulator) and the slave (connected to the shell). This is the pipe that connects your terminal to the shell.',
    examples: ['/dev/pts/0', '/dev/ttys000'],
    alsoKnownAs: ['Pseudoterminal', 'Pseudo-TTY'],
  },
  bash: {
    name: 'Bash',
    category: 'shell',
    definition:
      'The "Bourne Again Shell"—the default shell on most Linux systems. Known for its scripting capabilities and POSIX compliance. Uses .bashrc and .bash_profile for configuration.',
    examples: ['#!/bin/bash', 'source ~/.bashrc'],
  },
  zsh: {
    name: 'Zsh',
    category: 'shell',
    definition:
      'The "Z Shell"—the default shell on macOS since Catalina. Has better tab completion, theming (Oh My Zsh), and interactive features than bash. Mostly compatible with bash syntax.',
    examples: ['#!/bin/zsh', 'source ~/.zshrc'],
  },
  console: {
    name: 'Console',
    category: 'interface',
    definition:
      'Historically, the physical terminal directly attached to a computer. In modern usage, often used interchangeably with "terminal" or to mean a text-based interface.',
    examples: [
      'Linux virtual console (Ctrl+Alt+F1)',
      'Browser developer console',
    ],
    alsoKnownAs: ['System console'],
  },
  cli: {
    name: 'CLI (Command-Line Interface)',
    shortName: 'CLI',
    category: 'interface',
    definition:
      'A text-based interface where you interact by typing commands. The opposite of a GUI. Both the shell and programs you run in the terminal are CLIs.',
    examples: ['git', 'npm', 'docker', 'curl'],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  hardware: 'text-terminal-yellow',
  software: 'text-terminal-cyan',
  shell: 'text-terminal-green',
  interface: 'text-terminal-magenta',
};

const CATEGORY_LABELS: Record<string, string> = {
  hardware: 'Hardware',
  software: 'Software',
  shell: 'Shell',
  interface: 'Interface Type',
};

// Architecture diagram showing the relationship between components
function ArchitectureDiagram({
  highlightedTerm,
}: {
  highlightedTerm: Term | null;
}) {
  const isHighlighted = (terms: Term[]) => {
    if (!highlightedTerm) return false;
    return terms.includes(highlightedTerm);
  };

  const layers = [
    {
      id: 'terminal',
      terms: ['terminal-emulator', 'terminal'] as Term[],
      label: 'Terminal Emulator',
      examples: 'iTerm2, Ghostty, kitty',
      color: 'blue',
    },
    {
      id: 'pty',
      terms: ['pty'] as Term[],
      label: 'PTY',
      examples: 'Pseudo-terminal (kernel)',
      color: 'yellow',
    },
    {
      id: 'shell',
      terms: ['shell', 'bash', 'zsh'] as Term[],
      label: 'Shell',
      examples: 'zsh, bash, fish',
      color: 'green',
    },
    {
      id: 'cli',
      terms: ['cli'] as Term[],
      label: 'CLI Programs',
      examples: 'git, npm, vim',
      color: 'magenta',
    },
  ];

  return (
    <div className="bg-terminal-highlight border border-terminal-border p-6">
      <div className="text-terminal-fg text-sm font-bold mb-6">
        How They Fit Together
      </div>

      {/* Nested boxes showing containment */}
      <div className="font-mono text-sm">
        {/* Nested layers */}
        <div
          className={`border-2 p-4 transition-all ${
            isHighlighted(['terminal-emulator', 'terminal'])
              ? 'border-terminal-blue bg-terminal-blue/5'
              : 'border-terminal-blue/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-terminal-blue font-bold">
              Terminal Emulator
            </span>
            <span className="text-terminal-muted text-xs">
              iTerm2, Ghostty, kitty
            </span>
          </div>

          <div
            className={`border-2 p-4 transition-all ${
              isHighlighted(['pty'])
                ? 'border-terminal-yellow bg-terminal-yellow/5'
                : 'border-terminal-yellow/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-terminal-yellow font-bold">PTY</span>
              <span className="text-terminal-muted text-xs">
                pseudo-terminal in kernel
              </span>
            </div>

            <div
              className={`border-2 p-4 transition-all ${
                isHighlighted(['shell', 'bash', 'zsh'])
                  ? 'border-terminal-green bg-terminal-green/5'
                  : 'border-terminal-green/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-terminal-green font-bold">Shell</span>
                <span className="text-terminal-muted text-xs">
                  zsh, bash, fish
                </span>
              </div>

              <div
                className={`border-2 p-3 transition-all ${
                  isHighlighted(['cli'])
                    ? 'border-terminal-magenta bg-terminal-magenta/5'
                    : 'border-terminal-magenta/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-terminal-magenta font-bold">
                    CLI Programs
                  </span>
                  <span className="text-terminal-muted text-xs">
                    git, npm, vim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data flow annotation */}
        <div className="mt-4 pt-4 border-t border-terminal-border text-xs text-terminal-muted">
          <span className="text-terminal-fg">Data flows both ways:</span>{' '}
          keystrokes travel inward, output travels outward. Each layer
          transforms the data.
        </div>
      </div>
    </div>
  );
}

// Shell family tree and comparison
function ShellLandscape() {
  const [selectedShell, setSelectedShell] = useState<string>('zsh');

  const shells = {
    sh: {
      name: 'sh (Bourne Shell)',
      year: '1979',
      creator: 'Stephen Bourne at Bell Labs',
      description:
        'The original Unix shell. Established scripting conventions still used today. The standard for portable scripts.',
      config: '/etc/profile, ~/.profile',
      defaultOn: 'POSIX systems (as /bin/sh)',
      color: 'text-terminal-dim',
    },
    bash: {
      name: 'Bash (Bourne Again Shell)',
      year: '1989',
      creator: 'Brian Fox for GNU',
      description:
        'Backwards compatible with sh, adding command history, job control, and better scripting. The most common shell on Linux.',
      config: '~/.bashrc, ~/.bash_profile',
      defaultOn: 'Most Linux distros',
      color: 'text-terminal-yellow',
    },
    zsh: {
      name: 'Zsh (Z Shell)',
      year: '1990',
      creator: 'Paul Falstad',
      description:
        'Combines features from bash, ksh, and tcsh. Known for powerful tab completion, spelling correction, and theming via Oh My Zsh.',
      config: '~/.zshrc, ~/.zprofile',
      defaultOn: 'macOS (since 2019)',
      color: 'text-terminal-cyan',
    },
    fish: {
      name: 'Fish (Friendly Interactive Shell)',
      year: '2005',
      creator: 'Axel Liljencrantz',
      description:
        'Prioritizes user-friendliness over POSIX compatibility. Built-in syntax highlighting, autosuggestions, and web-based config.',
      config: '~/.config/fish/config.fish',
      defaultOn: 'None (opt-in)',
      color: 'text-terminal-green',
    },
    ksh: {
      name: 'Ksh (Korn Shell)',
      year: '1983',
      creator: 'David Korn at Bell Labs',
      description:
        'Combines sh compatibility with C shell features. Popular in enterprise Unix environments. Has associative arrays and better loop syntax.',
      config: '~/.kshrc',
      defaultOn: 'Some commercial Unix',
      color: 'text-terminal-magenta',
    },
    tcsh: {
      name: 'Tcsh (TENEX C Shell)',
      year: '1981',
      creator: 'Ken Greer',
      description:
        'Enhanced C shell with command-line editing and completion. C-like scripting syntax. Was the default on older BSDs and early macOS.',
      config: '~/.tcshrc, ~/.cshrc',
      defaultOn: 'FreeBSD (historically)',
      color: 'text-terminal-red',
    },
    nushell: {
      name: 'Nushell',
      year: '2019',
      creator: 'Jonathan Turner et al.',
      description:
        'Modern shell treating data as structured tables, not text. Pipelines pass typed data. Not POSIX-compatible but very powerful for data manipulation.',
      config: '~/.config/nushell/config.nu',
      defaultOn: 'None (opt-in)',
      color: 'text-terminal-blue',
    },
  };

  const shellKeys = Object.keys(shells) as Array<keyof typeof shells>;
  const selected = shells[selectedShell as keyof typeof shells];

  return (
    <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
      <div className="text-terminal-red text-sm font-bold">
        The Shell Family Tree
      </div>

      <div className="flex flex-wrap gap-2">
        {shellKeys.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedShell(key)}
            className={`px-3 py-1.5 text-sm border transition-colors ${
              selectedShell === key
                ? 'border-terminal-green bg-terminal-green/20 text-terminal-green'
                : 'border-terminal-border text-terminal-muted hover:text-terminal-fg'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <div>
            <span className={`font-bold ${selected.color}`}>
              {selected.name}
            </span>
            <span className="text-terminal-dim text-sm ml-2">
              ({selected.year})
            </span>
          </div>
          <p className="text-terminal-muted text-sm leading-relaxed">
            {selected.description}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-terminal-dim text-xs uppercase mb-1">
                Config
              </div>
              <div className="text-terminal-cyan font-mono text-xs">
                {selected.config}
              </div>
            </div>
            <div>
              <div className="text-terminal-dim text-xs uppercase mb-1">
                Default on
              </div>
              <div className="text-terminal-fg text-xs">
                {selected.defaultOn}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Terminal emulator landscape
function TerminalLandscape() {
  const [selectedTerminal, setSelectedTerminal] = useState<string>('iterm2');

  const terminals = {
    vt100: {
      name: 'VT100 (1978)',
      type: 'Hardware',
      description:
        'The DEC terminal that defined the standard. First ANSI-compliant terminal. Most modern terminal emulators trace their roots here.',
      features: ['ANSI escape codes', '80×24 display', 'Scrolling regions'],
      color: 'text-terminal-yellow',
    },
    xterm: {
      name: 'xterm (1984)',
      type: 'Classic',
      description:
        'The original X Window System terminal emulator. Added mouse tracking and 256 colors. Still the reference implementation.',
      features: ['VT102 emulation', 'Mouse tracking', '256 colors'],
      color: 'text-terminal-dim',
    },
    iterm2: {
      name: 'iTerm2',
      type: 'Feature-rich',
      description:
        'The most popular macOS terminal. Split panes, search, triggers, Python scripting API. Native tmux integration.',
      features: ['Split panes', 'Tmux integration', 'Autocomplete', 'Triggers'],
      color: 'text-terminal-green',
    },
    alacritty: {
      name: 'Alacritty',
      type: 'Minimal/Fast',
      description:
        'GPU-accelerated, written in Rust. Focused on speed and simplicity. No tabs, no splits—use tmux instead.',
      features: ['GPU rendering', 'Cross-platform', 'Vi mode', 'Fast'],
      color: 'text-terminal-cyan',
    },
    kitty: {
      name: 'kitty',
      type: 'Feature-rich',
      description:
        'GPU-based with its own image protocol. Extensible via "kittens". Defined the kitty keyboard protocol now adopted widely.',
      features: ['GPU rendering', 'Image support', 'Kittens', 'Tabs/splits'],
      color: 'text-terminal-magenta',
    },
    warp: {
      name: 'Warp',
      type: 'Modern/AI',
      description:
        'Reimagines the terminal with blocks, AI assistance, and team features. Input at bottom, modern text editing.',
      features: ['AI assistance', 'Blocks', 'Team sharing', 'Modern UI'],
      color: 'text-terminal-blue',
    },
    ghostty: {
      name: 'Ghostty',
      type: 'Modern/Fast',
      description:
        'By Mitchell Hashimoto (Vagrant, Terraform). Native GPU rendering, kitty graphics, sensible defaults. Open-sourced in late 2024.',
      features: [
        'Native rendering',
        'Kitty graphics',
        'Fast',
        'Clean defaults',
      ],
      color: 'text-terminal-red',
    },
  };

  const terminalKeys = Object.keys(terminals) as Array<keyof typeof terminals>;
  const selected = terminals[selectedTerminal as keyof typeof terminals];

  return (
    <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
      <div className="text-terminal-red text-sm font-bold">
        Terminal Emulators
      </div>

      <div className="flex flex-wrap gap-2">
        {terminalKeys.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedTerminal(key)}
            className={`px-3 py-1.5 text-sm border transition-colors ${
              selectedTerminal === key
                ? 'border-terminal-green bg-terminal-green/20 text-terminal-green'
                : 'border-terminal-border text-terminal-muted hover:text-terminal-fg'
            }`}
          >
            {key === 'vt100' ? 'VT100' : key === 'iterm2' ? 'iTerm2' : key}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <div>
            <span className={`font-bold ${selected.color}`}>
              {selected.name}
            </span>
            <span className="text-terminal-dim text-sm ml-2">
              • {selected.type}
            </span>
          </div>
          <p className="text-terminal-muted text-sm leading-relaxed">
            {selected.description}
          </p>
          <div>
            <div className="text-terminal-dim text-xs uppercase mb-2">
              Key features
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.features.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-terminal-bg border border-terminal-border text-terminal-fg text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive demo showing what happens when you type
function CommandFlowDemo() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      label: 'You type',
      content: 'ls -la',
      description: 'You press keys on your keyboard',
      highlight: 'input',
    },
    {
      label: 'Terminal receives',
      content: 'l, s, space, -, l, a',
      description: 'Terminal emulator receives keystrokes and displays them',
      highlight: 'terminal',
    },
    {
      label: 'Shell receives',
      content: 'ls -la\\n',
      description: 'When you press Enter, the shell receives the full line',
      highlight: 'shell',
    },
    {
      label: 'Shell parses',
      content: 'command: ls, args: [-l, -a]',
      description: 'Shell interprets the command and arguments',
      highlight: 'shell',
    },
    {
      label: 'Shell executes',
      content: '/bin/ls -l -a',
      description: 'Shell finds and runs the ls program',
      highlight: 'program',
    },
    {
      label: 'Output flows back',
      content: 'drwxr-xr-x  5 user ...',
      description: 'Program output goes through PTY to terminal',
      highlight: 'output',
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
      <div className="text-terminal-red text-sm font-bold">
        Follow a Command
      </div>

      <NumberedStepNavigation
        totalSteps={steps.length}
        currentStep={step}
        onStepChange={setStep}
      />

      <div className="bg-terminal-bg border border-terminal-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-terminal-cyan text-sm font-bold">
            {currentStep?.label}
          </span>
        </div>
        <div className="font-mono text-terminal-green">
          {currentStep?.content}
        </div>
        <div className="text-terminal-muted text-sm">
          {currentStep?.description}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          size="sm"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function VocabularyDemo() {
  const [activeTerm, setActiveTerm] = useState<Term>('terminal');
  const termData = activeTerm ? TERMS[activeTerm] : null;

  const termOrder: Term[] = [
    'terminal',
    'terminal-emulator',
    'shell',
    'pty',
    'bash',
    'zsh',
    'console',
    'cli',
  ];

  return (
    <div className="space-y-8">
      {/* Glossary */}
      <div className="bg-terminal-highlight border border-terminal-border flex flex-col lg:flex-row">
        {/* Term list */}
        <div className="p-4 lg:border-r border-terminal-border lg:w-1/2">
          <div className="font-mono text-sm space-y-1 min-h-[320px]">
            {termOrder.map((term) => {
              const data = TERMS[term];
              const isActive = activeTerm === term;
              return (
                <div
                  key={term}
                  onMouseEnter={() => setActiveTerm(term)}
                  className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-all cursor-default ${
                    isActive
                      ? 'bg-terminal-border/50 border-l-2 border-terminal-fg'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <span
                    className={`text-xs uppercase w-16 ${CATEGORY_COLORS[data.category]}`}
                  >
                    {CATEGORY_LABELS[data.category]?.split(' ')[0]}
                  </span>
                  <span className="text-terminal-fg">
                    {data.shortName || data.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Term details */}
        <div className="p-4 lg:w-1/2 border-t lg:border-t-0 border-terminal-border">
          {termData && (
            <div className="space-y-4">
              <div>
                <div
                  className={`text-xs uppercase ${CATEGORY_COLORS[termData.category]}`}
                >
                  {CATEGORY_LABELS[termData.category]}
                </div>
                <div className="text-terminal-fg text-base mt-2 font-bold">
                  {termData.name}
                </div>
                {termData.alsoKnownAs && (
                  <div className="text-terminal-muted text-xs">
                    AKA: {termData.alsoKnownAs.join(', ')}
                  </div>
                )}
              </div>

              <p className="text-terminal-muted text-sm leading-relaxed">
                {termData.definition}
              </p>

              <div className="space-y-2">
                <div className="text-terminal-muted text-xs uppercase">
                  Examples
                </div>
                <div className="flex flex-wrap gap-2">
                  {termData.examples.map((ex) => (
                    <span
                      key={ex}
                      className={`px-2 py-1 bg-terminal-bg border border-terminal-border font-mono text-xs ${CATEGORY_COLORS[termData.category]}`}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Architecture Diagram */}
      <ArchitectureDiagram highlightedTerm={activeTerm} />

      {/* Shell Landscape */}
      <ShellLandscape />

      {/* Terminal Emulator Landscape */}
      <TerminalLandscape />

      {/* Command Flow Demo */}
      <CommandFlowDemo />

      {/* Common Confusions */}
      <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">
          Common Confusions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-fg font-bold text-sm">
              "I opened my terminal"
            </div>
            <p className="text-terminal-muted text-sm">
              You probably mean you opened a{' '}
              <span className="text-terminal-cyan">terminal emulator</span>{' '}
              (like iTerm2), which started a{' '}
              <span className="text-terminal-green">shell</span> (like zsh)
              inside it.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-fg font-bold text-sm">
              "My terminal can't find the command"
            </div>
            <p className="text-terminal-muted text-sm">
              It's actually your{' '}
              <span className="text-terminal-green">shell</span> that searches
              for commands in your PATH. The terminal just displays what the
              shell outputs.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-fg font-bold text-sm">
              "bash vs zsh—which should I use?"
            </div>
            <p className="text-terminal-muted text-sm">
              For interactive use,{' '}
              <span className="text-terminal-cyan">zsh</span> has better
              features. For scripts,{' '}
              <span className="text-terminal-yellow">bash</span> is more
              portable. Most commands work identically in both.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-fg font-bold text-sm">
              "Terminal settings vs shell config"
            </div>
            <p className="text-terminal-muted text-sm">
              <span className="text-terminal-cyan">Terminal settings</span>{' '}
              control appearance (fonts, colors, window size).{' '}
              <span className="text-terminal-green">Shell config</span> (.zshrc)
              controls aliases, PATH, and prompt.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-terminal-highlight border border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">Quick Reference</h3>

        <div className="bg-terminal-bg border border-terminal-border p-4 font-mono text-sm space-y-2">
          <div className="text-terminal-muted"># Which shell am I using?</div>
          <div className="text-terminal-green">echo $SHELL</div>
          <div className="text-terminal-muted mt-3">
            # What terminal am I in?
          </div>
          <div className="text-terminal-green">echo $TERM_PROGRAM</div>
          <div className="text-terminal-muted mt-3">
            # What's my PTY device?
          </div>
          <div className="text-terminal-green">tty</div>
          <div className="text-terminal-muted mt-3">
            # List available shells
          </div>
          <div className="text-terminal-green">cat /etc/shells</div>
          <div className="text-terminal-muted mt-3">
            # Change default shell to zsh
          </div>
          <div className="text-terminal-green">chsh -s /bin/zsh</div>
        </div>
      </div>
    </div>
  );
}
