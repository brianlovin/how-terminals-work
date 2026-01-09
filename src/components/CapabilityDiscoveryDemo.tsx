import { useState, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { SubsectionLabel } from './shared/SubsectionLabel';

// TERM capabilities mapping
const TERM_CAPABILITIES: Record<
  string,
  {
    colors: number;
    mouse: boolean;
    altScreen: boolean;
    unicode: boolean;
    description: string;
  }
> = {
  'xterm-256color': {
    colors: 256,
    mouse: true,
    altScreen: true,
    unicode: true,
    description: 'Modern terminal with 256-color support',
  },
  xterm: {
    colors: 16,
    mouse: true,
    altScreen: true,
    unicode: true,
    description: 'Standard X terminal emulator',
  },
  'screen-256color': {
    colors: 256,
    mouse: true,
    altScreen: true,
    unicode: true,
    description: 'GNU Screen with 256 colors',
  },
  vt100: {
    colors: 0,
    mouse: false,
    altScreen: false,
    unicode: false,
    description: 'DEC terminal from 1978',
  },
  dumb: {
    colors: 0,
    mouse: false,
    altScreen: false,
    unicode: false,
    description: 'No special capabilities',
  },
};

// Feature sequences
const FEATURES = [
  {
    id: 'mouse',
    name: 'Mouse Tracking',
    enable: '^[[?1000h',
    disable: '^[[?1000l',
    description: 'Report mouse clicks as escape sequences',
  },
  {
    id: 'altscreen',
    name: 'Alternate Screen',
    enable: '^[[?1049h',
    disable: '^[[?1049l',
    description: 'Switch to a separate screen buffer',
  },
  {
    id: 'bracketed',
    name: 'Bracketed Paste',
    enable: '^[[?2004h',
    disable: '^[[?2004l',
    description: 'Wrap pasted text with special markers',
  },
];

// DA1 response codes
const DA1_CODES: Record<string, string> = {
  '1': '132 columns',
  '2': 'Printer port',
  '4': 'Sixel graphics',
  '6': 'Selective erase',
  '7': 'Soft fonts (DRCS)',
  '8': 'User-defined keys',
  '9': 'National replacement sets',
  '15': 'Technical character set',
  '18': 'Windowing capability',
  '21': 'Horizontal scrolling',
  '22': 'ANSI color',
  '28': 'Rectangular editing',
  '29': 'ANSI text locator',
};

type QueryPhase = 'idle' | 'sending' | 'responding' | 'done';

export function CapabilityDiscoveryDemo() {
  const [selectedTerm, setSelectedTerm] = useState('xterm-256color');
  const [queryPhase, setQueryPhase] = useState<QueryPhase>('idle');
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(
    new Set()
  );

  const capabilities = TERM_CAPABILITIES[selectedTerm]!;

  const runQuery = () => {
    if (queryPhase !== 'idle' && queryPhase !== 'done') return;
    setQueryPhase('sending');
  };

  useEffect(() => {
    if (queryPhase === 'sending') {
      const timer = setTimeout(() => setQueryPhase('responding'), 800);
      return () => clearTimeout(timer);
    }
    if (queryPhase === 'responding') {
      const timer = setTimeout(() => setQueryPhase('done'), 800);
      return () => clearTimeout(timer);
    }
  }, [queryPhase]);

  const toggleFeature = (featureId: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-10">
      {/* Section 1: TERM Variable */}
      <div className="space-y-4">
        <SubsectionLabel>The TERM Variable</SubsectionLabel>

        <TerminalWindow>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-terminal-dim">$</span>
                <span className="text-terminal-cyan">TERM</span>
                <span className="text-terminal-dim">=</span>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="bg-terminal-bg border border-terminal-border text-terminal-yellow px-2 py-1 text-sm font-mono cursor-pointer hover:border-terminal-dim focus:outline-none focus:border-terminal-fg"
                >
                  {Object.keys(TERM_CAPABILITIES).map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-terminal-muted text-sm">
                {capabilities.description}
              </span>
            </div>

            {/* Capability Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <CapabilityItem
                label="Colors"
                value={
                  capabilities.colors === 0
                    ? 'None'
                    : capabilities.colors.toString()
                }
                supported={capabilities.colors > 0}
              />
              <CapabilityItem
                label="Mouse"
                value={capabilities.mouse ? 'Yes' : 'No'}
                supported={capabilities.mouse}
              />
              <CapabilityItem
                label="Alt Screen"
                value={capabilities.altScreen ? 'Yes' : 'No'}
                supported={capabilities.altScreen}
              />
              <CapabilityItem
                label="Unicode"
                value={capabilities.unicode ? 'Yes' : 'No'}
                supported={capabilities.unicode}
              />
            </div>
          </div>
        </TerminalWindow>

        <p className="text-terminal-muted text-sm">
          Programs check the <code className="text-terminal-cyan">TERM</code>{' '}
          environment variable to look up capabilities in the terminfo database.
          It's just a string—the terminal doesn't enforce it.
        </p>
      </div>

      {/* Section 2: Query/Response */}
      <div className="space-y-4">
        <SubsectionLabel>Query & Response</SubsectionLabel>

        <TerminalWindow>
          <div className="space-y-4">
            {/* Query visualization */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="text-center flex-1">
                <div className="text-xs text-terminal-dim uppercase mb-2">
                  Program
                </div>
                <div className="w-12 h-12 mx-auto border border-terminal-border flex items-center justify-center text-terminal-muted">
                  vim
                </div>
              </div>

              <div className="flex-1 relative h-16">
                {/* Query arrow */}
                <div
                  className={`absolute top-2 left-0 right-0 flex items-center transition-opacity duration-300 ${
                    queryPhase === 'sending' ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="flex-1 border-t border-terminal-green border-dashed" />
                  <div className="text-terminal-green px-2 text-xs font-mono whitespace-nowrap">
                    ESC[c
                  </div>
                  <div className="text-terminal-green">→</div>
                </div>

                {/* Response arrow */}
                <div
                  className={`absolute bottom-2 left-0 right-0 flex items-center transition-opacity duration-300 ${
                    queryPhase === 'responding' || queryPhase === 'done'
                      ? 'opacity-100'
                      : 'opacity-30'
                  }`}
                >
                  <div className="text-terminal-yellow">←</div>
                  <div className="text-terminal-yellow px-2 text-xs font-mono whitespace-nowrap">
                    ESC[?64;1;4;22c
                  </div>
                  <div className="flex-1 border-t border-terminal-yellow border-dashed" />
                </div>
              </div>

              <div className="text-center flex-1">
                <div className="text-xs text-terminal-dim uppercase mb-2">
                  Terminal
                </div>
                <div className="w-12 h-12 mx-auto border border-terminal-border flex items-center justify-center text-terminal-muted">
                  tty
                </div>
              </div>
            </div>

            {/* Response decoder */}
            {(queryPhase === 'responding' || queryPhase === 'done') && (
              <div className="bg-terminal-bg/50 border border-terminal-border p-3 space-y-2">
                <div className="text-xs text-terminal-dim uppercase">
                  Response Decoded
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-yellow font-mono">64</span>
                    <span className="text-terminal-muted">VT420</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-yellow font-mono">1</span>
                    <span className="text-terminal-muted">
                      {DA1_CODES['1']}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-yellow font-mono">4</span>
                    <span className="text-terminal-muted">
                      {DA1_CODES['4']}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-yellow font-mono">22</span>
                    <span className="text-terminal-muted">
                      {DA1_CODES['22']}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Query button */}
            <div className="flex justify-center">
              <button
                onClick={runQuery}
                disabled={queryPhase === 'sending' || queryPhase === 'responding'}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  queryPhase === 'sending' || queryPhase === 'responding'
                    ? 'bg-terminal-dim text-terminal-bg cursor-not-allowed'
                    : 'bg-terminal-fg text-terminal-bg hover:bg-terminal-bright-white'
                }`}
              >
                {queryPhase === 'sending'
                  ? 'Sending...'
                  : queryPhase === 'responding'
                    ? 'Receiving...'
                    : queryPhase === 'done'
                      ? 'Send Again'
                      : 'Send DA1 Query'}
              </button>
            </div>
          </div>
        </TerminalWindow>

        <p className="text-terminal-muted text-sm">
          Programs can also query the terminal directly. DA1 (
          <code className="text-terminal-cyan">ESC[c</code>) asks "what are
          you?" and the terminal responds with capability codes.
        </p>
      </div>

      {/* Section 3: Feature Toggles */}
      <div className="space-y-4">
        <SubsectionLabel>Enabling Features</SubsectionLabel>

        <TerminalWindow>
          <div className="space-y-3">
            {FEATURES.map((feature) => {
              const isEnabled = enabledFeatures.has(feature.id);
              return (
                <div
                  key={feature.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-terminal-border/50 last:border-0"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleFeature(feature.id)}
                      className="w-4 h-4 accent-terminal-fg"
                    />
                    <span
                      className={`font-medium text-sm ${isEnabled ? 'text-terminal-fg' : 'text-terminal-muted'}`}
                    >
                      {feature.name}
                    </span>
                  </label>

                  <code
                    className={`text-xs font-mono px-2 py-1 ${
                      isEnabled
                        ? 'text-terminal-green bg-terminal-green/10'
                        : 'text-terminal-dim bg-terminal-bg/50'
                    }`}
                  >
                    {isEnabled ? feature.enable : feature.disable}
                  </code>

                  <span className="text-terminal-dim text-xs sm:ml-auto">
                    {feature.description}
                  </span>
                </div>
              );
            })}
          </div>
        </TerminalWindow>

        <p className="text-terminal-muted text-sm">
          Features are off by default. Programs send escape sequences to enable
          them—that's why vim sends{' '}
          <code className="text-terminal-cyan">^[[?1049h</code> at startup (to
          enter alternate screen) and{' '}
          <code className="text-terminal-cyan">^[[?1049l</code> when you quit.
        </p>
      </div>
    </div>
  );
}

function CapabilityItem({
  label,
  value,
  supported,
}: {
  label: string;
  value: string;
  supported: boolean;
}) {
  return (
    <div
      className={`px-3 py-2 border ${supported ? 'border-terminal-green/50 bg-terminal-green/5' : 'border-terminal-border bg-terminal-bg/50'}`}
    >
      <div className="text-xs text-terminal-dim uppercase">{label}</div>
      <div
        className={`text-sm font-medium ${supported ? 'text-terminal-green' : 'text-terminal-dim'}`}
      >
        {value}
      </div>
    </div>
  );
}
