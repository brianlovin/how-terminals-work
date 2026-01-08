import { useState, useRef, useCallback } from 'react';
import { TerminalWindow } from './TerminalWindow';

// Simulating different modes like Claude Code's accept edits / plan mode toggle
type Mode = 'accept' | 'plan' | 'chat';

interface ModeConfig {
  name: string;
  indicator: string;
  color: string;
}

const MODES: Record<Mode, ModeConfig> = {
  accept: {
    name: 'accept edits on',
    indicator: '>>',
    color: 'terminal-magenta',
  },
  plan: {
    name: 'plan mode',
    indicator: '??',
    color: 'terminal-yellow',
  },
  chat: {
    name: 'chat mode',
    indicator: '~~',
    color: 'terminal-cyan',
  },
};

const MODE_ORDER: Mode[] = ['accept', 'plan', 'chat'];

type ExplainerStep =
  | 'overview'
  | 'memory'
  | 'rendering'
  | 'input-handling'
  | 'persistence';

interface StepContent {
  title: string;
  description: string;
}

const EXPLAINER_STEPS: Record<ExplainerStep, StepContent> = {
  overview: {
    title: 'State in Terminal Apps',
    description:
      'Terminal apps maintain state in memory just like GUI apps. The difference is how they display it: by printing characters to specific positions. When state changes, they redraw the relevant parts of the screen.',
  },
  memory: {
    title: 'Where State Lives',
    description:
      "The app keeps variables in memory: currentMode, inputBuffer, history, etc. These are just regular program variables. The terminal itself doesn't store your app's state—it only displays whatever characters you send it.",
  },
  rendering: {
    title: 'Rendering State Changes',
    description:
      'When the mode changes, the app: 1) Updates the variable in memory, 2) Moves the cursor to where the indicator is displayed, 3) Clears that region, 4) Prints the new indicator with appropriate colors. The user sees a seamless transition.',
  },
  'input-handling': {
    title: 'Input Triggers State Changes',
    description:
      "Key combinations like Shift+Tab are just byte sequences. The app receives these bytes, recognizes the pattern, updates internal state, and re-renders. The terminal doesn't know anything about 'modes'—it just passes bytes through.",
  },
  persistence: {
    title: 'Persistence & Sessions',
    description:
      "Terminal apps can save state to files (config, history) but lose in-memory state when they exit. Some apps use the terminal's alternate screen buffer—when they exit, the original screen content is restored, as if the app was never there.",
  },
};

export function StateManagementDemo() {
  const [currentMode, setCurrentMode] = useState<Mode>('accept');
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<{ mode: Mode; text: string }[]>([]);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('overview');
  const [showStateInspector, setShowStateInspector] = useState(false);
  const [lastKeySequence, setLastKeySequence] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cycleMode = useCallback(() => {
    const currentIndex = MODE_ORDER.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODE_ORDER.length;
    setCurrentMode(MODE_ORDER[nextIndex]!);
    setLastKeySequence('Shift+Tab → cycle mode');
    setTimeout(() => setLastKeySequence(null), 1500);
  }, [currentMode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        cycleMode();
      } else if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        setHistory((prev) =>
          [...prev, { mode: currentMode, text: inputValue }].slice(-5)
        );
        setInputValue('');
        setLastKeySequence('Enter → submit');
        setTimeout(() => setLastKeySequence(null), 1500);
      }
    },
    [cycleMode, currentMode, inputValue]
  );

  const modeConfig = MODES[currentMode];
  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const currentStepIndex = steps.indexOf(currentStep);
  const stepContent = EXPLAINER_STEPS[currentStep];

  return (
    <div className="space-y-8">
      {/* Interactive Demo */}
      <div className="space-y-4">
        <TerminalWindow>
          <div
            className="min-h-[280px] font-mono text-sm cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {/* History */}
            {history.length > 0 && (
              <div className="mb-4 space-y-2 opacity-60">
                {history.map((entry, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`text-${MODES[entry.mode].color}`}>
                      {MODES[entry.mode].indicator}
                    </span>
                    <span className="text-terminal-dim">{entry.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Current prompt line */}
            <div className="flex items-start gap-2">
              <span className="text-terminal-dim">&gt;</span>
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none text-terminal-fg"
                  placeholder="Type something and press Enter..."
                />
              </div>
            </div>

            {/* Mode indicator line - this is what we're explaining */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-${modeConfig.color} transition-colors duration-200`}
              >
                {modeConfig.indicator}
              </span>
              <span
                className={`text-${modeConfig.color} transition-colors duration-200`}
              >
                {modeConfig.name}
              </span>
              <span className="text-terminal-dim">(shift+tab to cycle)</span>
            </div>
          </div>
        </TerminalWindow>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={cycleMode}
            className="px-3 py-1.5 border border-terminal-border hover:border-terminal-green transition-colors"
          >
            Cycle Mode (Shift+Tab)
          </button>
          <button
            onClick={() => setShowStateInspector(!showStateInspector)}
            className={`px-3 py-1.5 border transition-colors ${
              showStateInspector
                ? 'bg-terminal-green/20 border-terminal-green text-terminal-green'
                : 'border-terminal-border hover:border-terminal-green'
            }`}
          >
            {showStateInspector ? 'Hide' : 'Show'} State Inspector
          </button>
        </div>

        {/* State Inspector */}
        {showStateInspector && (
          <div className="bg-terminal-bg border border-terminal-border p-4 space-y-4">
            <div className="text-terminal-red text-sm font-bold">
              State Inspector (What the App Remembers)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-terminal-highlight p-3 space-y-2">
                <div className="text-terminal-dim">
                  // Current state variables
                </div>
                <div>
                  <span className="text-terminal-cyan">currentMode</span>:{' '}
                  <span className={`text-${modeConfig.color}`}>
                    "{currentMode}"
                  </span>
                </div>
                <div>
                  <span className="text-terminal-cyan">inputBuffer</span>:{' '}
                  <span className="text-terminal-green">"{inputValue}"</span>
                </div>
                <div>
                  <span className="text-terminal-cyan">historyLength</span>:{' '}
                  <span className="text-terminal-yellow">{history.length}</span>
                </div>
              </div>
              <div className="bg-terminal-highlight p-3 space-y-2">
                <div className="text-terminal-dim">
                  // Render output for mode indicator
                </div>
                <div className="text-terminal-fg">
                  <span className="text-terminal-magenta">moveCursor</span>(3,
                  1);
                </div>
                <div className="text-terminal-fg">
                  <span className="text-terminal-magenta">setColor</span>(
                  <span className={`text-${modeConfig.color}`}>
                    {modeConfig.color.replace('terminal-', '').toUpperCase()}
                  </span>
                  );
                </div>
                <div className="text-terminal-fg">
                  <span className="text-terminal-magenta">print</span>("
                  {modeConfig.indicator} {modeConfig.name}");
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-terminal-dim text-sm bg-terminal-bg border border-terminal-border p-3">
          <span className="text-terminal-red">Try it:</span> Press{' '}
          <kbd className="bg-terminal-highlight px-1 rounded">Shift+Tab</kbd> to
          cycle between modes. Type something and press{' '}
          <kbd className="bg-terminal-highlight px-1 rounded">Enter</kbd> to see
          history tracking.
        </div>
      </div>

      {/* How it works explanation */}
      <div className="space-y-4">
        <label className="block text-terminal-dim text-xs uppercase tracking-wider">How It Works</label>

        <div className="bg-terminal-highlight border border-terminal-border px-4 py-4 space-y-4 min-h-[200px]">
          <div className="text-terminal-fg font-medium text-sm">
            {stepContent.title}
          </div>
          <p className="text-terminal-muted text-sm leading-relaxed">
            {stepContent.description}
          </p>

          {currentStep === 'memory' && (
            <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
              <div className="text-terminal-dim">
                // App's internal state (in memory)
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-terminal-cyan">struct</span> AppState{' '}
                  {'{'}
                </div>
                <div className="ml-4">
                  <span className="text-terminal-yellow">mode</span>: Mode,
                </div>
                <div className="ml-4">
                  <span className="text-terminal-yellow">input_buffer</span>:
                  String,
                </div>
                <div className="ml-4">
                  <span className="text-terminal-yellow">history</span>:
                  Vec&lt;Entry&gt;,
                </div>
                <div className="ml-4">
                  <span className="text-terminal-yellow">cursor_pos</span>:
                  (u16, u16),
                </div>
                <div>{'}'}</div>
              </div>
            </div>
          )}

          {currentStep === 'rendering' && (
            <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
              <div className="text-terminal-dim">// On mode change:</div>
              <div className="space-y-1">
                <div>
                  <span className="text-terminal-yellow">1.</span>{' '}
                  <span className="text-terminal-cyan">state.mode</span> =
                  new_mode;
                </div>
                <div>
                  <span className="text-terminal-yellow">2.</span>{' '}
                  <span className="text-terminal-green">
                    print!("\x1b[3;1H")
                  </span>
                  ; <span className="text-terminal-dim">// move to line 3</span>
                </div>
                <div>
                  <span className="text-terminal-yellow">3.</span>{' '}
                  <span className="text-terminal-green">print!("\x1b[2K")</span>
                  ; <span className="text-terminal-dim">// clear line</span>
                </div>
                <div>
                  <span className="text-terminal-yellow">4.</span>{' '}
                  <span className="text-terminal-green">
                    print!("\x1b[35m")
                  </span>
                  ; <span className="text-terminal-dim">// set color</span>
                </div>
                <div>
                  <span className="text-terminal-yellow">5. </span>{' '}
                  <span className="text-terminal-green">
                    print!("{'>> accept edits on'}")
                  </span>
                  ;
                </div>
              </div>
            </div>
          )}

          {currentStep === 'input-handling' && (
            <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
              <div className="text-terminal-dim">
                // Shift+Tab byte sequence
              </div>
              <div className="space-y-1">
                <div>
                  Bytes received:{' '}
                  <span className="text-terminal-yellow">1b 5b 5a</span>
                </div>
                <div>
                  Sequence: <span className="text-terminal-cyan">ESC [ Z</span>{' '}
                  (CSI Z = Shift+Tab)
                </div>
                <div className="mt-2 text-terminal-dim">
                  // App's key handler:
                </div>
                <div>
                  <span className="text-terminal-magenta">match</span> key {'{'}
                </div>
                <div className="ml-4">
                  ShiftTab =&gt;{' '}
                  <span className="text-terminal-cyan">cycle_mode()</span>,
                </div>
                <div className="ml-4">
                  Enter =&gt;{' '}
                  <span className="text-terminal-cyan">submit_input()</span>,
                </div>
                <div className="ml-4">
                  _ =&gt;{' '}
                  <span className="text-terminal-cyan">
                    append_to_buffer(key)
                  </span>
                  ,
                </div>
                <div>{'}'}</div>
              </div>
            </div>
          )}

          {currentStep === 'persistence' && (
            <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
              <div className="text-terminal-dim">
                // State persistence options
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-terminal-green">
                    ~/.config/app/settings.json
                  </span>{' '}
                  <span className="text-terminal-dim">— user preferences</span>
                </div>
                <div>
                  <span className="text-terminal-green">
                    ~/.local/state/app/history
                  </span>{' '}
                  <span className="text-terminal-dim">— command history</span>
                </div>
                <div>
                  <span className="text-terminal-green">/tmp/app.sock</span>{' '}
                  <span className="text-terminal-dim">
                    — inter-process state
                  </span>
                </div>
                <div className="mt-2 text-terminal-dim">
                  // But current mode? Just in memory.
                </div>
                <div className="text-terminal-dim">
                  // When you restart, it resets to default.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step navigation */}
        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-2 h-2 rounded-full transition-all ${
                step === currentStep
                  ? 'bg-terminal-fg scale-125'
                  : 'bg-terminal-border hover:bg-terminal-dim'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentStep(steps[Math.max(0, currentStepIndex - 1)]!)
            }
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 border border-terminal-border hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            Back
          </button>
          <button
            onClick={() =>
              setCurrentStep(
                steps[Math.min(steps.length - 1, currentStepIndex + 1)]!
              )
            }
            disabled={currentStepIndex === steps.length - 1}
            className="px-3 py-1.5 border border-terminal-border hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* The data flow breakdown */}
      <div className="border border-terminal-border p-6 space-y-6">
        <h3 className="text-terminal-red text-sm font-bold">
          The State Update Cycle
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="bg-terminal-highlight p-4 text-center flex-1">
            <div className="text-terminal-magenta font-bold text-sm mb-2">
              1. Input
            </div>
            <div className="text-terminal-dim text-xs">
              User presses Shift+Tab
            </div>
            <div className="font-mono text-xs mt-2 text-terminal-yellow">
              ESC [ Z
            </div>
          </div>
          <div className="text-terminal-dim text-2xl hidden md:block"></div>
          <div className="bg-terminal-highlight p-4 text-center flex-1">
            <div className="text-terminal-blue font-bold text-sm mb-2">
              2. Process
            </div>
            <div className="text-terminal-dim text-xs">
              App recognizes sequence
            </div>
            <div className="font-mono text-xs mt-2 text-terminal-cyan">
              mode = nextMode()
            </div>
          </div>
          <div className="text-terminal-dim text-2xl hidden md:block"></div>
          <div className="bg-terminal-highlight p-4 text-center flex-1">
            <div className="text-terminal-green font-bold text-sm mb-2">
              3. Render
            </div>
            <div className="text-terminal-dim text-xs">
              Redraw mode indicator
            </div>
            <div className="font-mono text-xs mt-2 text-terminal-green">
              print(indicator)
            </div>
          </div>
        </div>

        <div className="text-terminal-dim text-sm">
          The terminal never "knows" about modes. It just displays whatever
          characters the app sends. All the intelligence—tracking state,
          responding to input, deciding what to draw—lives in the app.
        </div>
      </div>

      {/* Real-world examples */}
      <div className="border border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">
          State in Real Terminal Apps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-cyan font-bold text-sm">
              Vim Modes
            </div>
            <div className="text-terminal-dim text-xs">
              Normal, Insert, Visual, Command... Vim tracks this in a variable
              and shows it in the status line. Press{' '}
              <code className="text-terminal-yellow">i</code> and Vim sets{' '}
              <code className="text-terminal-green">mode = INSERT</code>, then
              redraws "-- INSERT --" at the bottom.
            </div>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-magenta font-bold text-sm">
              Shell Prompt
            </div>
            <div className="text-terminal-dim text-xs">
              Your shell tracks current directory, git branch, exit codes. Each
              prompt is a fresh render using current state. The terminal just
              displays the characters—it doesn't know you're in a git repo.
            </div>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-yellow font-bold text-sm">
              tmux Windows
            </div>
            <div className="text-terminal-dim text-xs">
              tmux maintains a list of windows and panes in memory. The status
              bar showing "[0] bash [1] vim*" is just tmux rendering its
              internal state to the bottom line of your terminal.
            </div>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="text-terminal-green font-bold text-sm">
              Claude Code Modes
            </div>
            <div className="text-terminal-dim text-xs">
              "Accept edits on" vs "plan mode"—this is a variable in the app.
              Shift+Tab sends bytes that the app interprets as "cycle mode",
              then it redraws the indicator with a different color and text.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
