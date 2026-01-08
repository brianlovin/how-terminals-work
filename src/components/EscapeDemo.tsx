import { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { SubsectionLabel, InfoPanel } from './shared';

// Standard 16-color ANSI escape codes (SGR - Select Graphic Rendition)
const COLOR_SEQUENCES = [
  // Normal colors (30-37)
  { display: '^[[30m', desc: 'Black', effect: 'black', color: '#0a0a0a' },
  { display: '^[[31m', desc: 'Red', effect: 'red', color: '#f85149' },
  { display: '^[[32m', desc: 'Green', effect: 'green', color: '#22c55e' },
  { display: '^[[33m', desc: 'Yellow', effect: 'yellow', color: '#eab308' },
  { display: '^[[34m', desc: 'Blue', effect: 'blue', color: '#3b82f6' },
  { display: '^[[35m', desc: 'Magenta', effect: 'magenta', color: '#a855f7' },
  { display: '^[[36m', desc: 'Cyan', effect: 'cyan', color: '#06b6d4' },
  { display: '^[[37m', desc: 'White', effect: 'white', color: '#e5e5e5' },
  // Bright colors (90-97)
  {
    display: '^[[90m',
    desc: 'Bright Black',
    effect: 'brightBlack',
    color: '#525252',
  },
  {
    display: '^[[91m',
    desc: 'Bright Red',
    effect: 'brightRed',
    color: '#ff7b72',
  },
  {
    display: '^[[92m',
    desc: 'Bright Green',
    effect: 'brightGreen',
    color: '#4ade80',
  },
  {
    display: '^[[93m',
    desc: 'Bright Yellow',
    effect: 'brightYellow',
    color: '#facc15',
  },
  {
    display: '^[[94m',
    desc: 'Bright Blue',
    effect: 'brightBlue',
    color: '#60a5fa',
  },
  {
    display: '^[[95m',
    desc: 'Bright Magenta',
    effect: 'brightMagenta',
    color: '#c084fc',
  },
  {
    display: '^[[96m',
    desc: 'Bright Cyan',
    effect: 'brightCyan',
    color: '#22d3ee',
  },
  {
    display: '^[[97m',
    desc: 'Bright White',
    effect: 'brightWhite',
    color: '#fafafa',
  },
];

const STYLE_SEQUENCES = [
  { display: '^[[1m', desc: 'Bold', effect: 'bold' },
  { display: '^[[4m', desc: 'Underline', effect: 'underline' },
  { display: '^[[0m', desc: 'Reset all styles', effect: 'reset' },
];

const CURSOR_SEQUENCES = [
  { display: '^[[2J', desc: 'Clear entire screen', effect: 'clear' },
  { display: '^[[H', desc: 'Move cursor to home (0,0)', effect: 'home' },
  { display: '^[[5;10H', desc: 'Move cursor to row 5, col 10', effect: 'move' },
];

export function EscapeDemo() {
  const [demoText, setDemoText] = useState('Hello World');
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());

  const handleColorClick = (effect: string) => {
    setActiveColor(activeColor === effect ? null : effect);
  };

  const toggleEffect = (effect: string) => {
    setActiveEffects((prev) => {
      const next = new Set(prev);
      if (effect === 'reset') {
        setActiveColor(null);
        return new Set();
      }
      next.has(effect) ? next.delete(effect) : next.add(effect);
      return next;
    });
  };

  const getActiveColorObj = () =>
    COLOR_SEQUENCES.find((c) => c.effect === activeColor);

  const getTextStyle = (): React.CSSProperties => ({
    color: getActiveColorObj()?.color,
    fontWeight: activeEffects.has('bold') ? 'bold' : undefined,
    textDecoration: activeEffects.has('underline') ? 'underline' : undefined,
  });

  const getActiveSequences = () => {
    const seqs: string[] = [];
    if (activeColor) {
      const colorSeq = COLOR_SEQUENCES.find((c) => c.effect === activeColor);
      if (colorSeq) seqs.push(colorSeq.display);
    }
    activeEffects.forEach((e) => {
      const styleSeq = STYLE_SEQUENCES.find((s) => s.effect === e);
      if (styleSeq) seqs.push(styleSeq.display);
    });
    return seqs;
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {/* 16-Color Palette */}
          <div>
            <SubsectionLabel>16-Color Palette</SubsectionLabel>
            <div className="grid grid-cols-8 gap-2">
              {COLOR_SEQUENCES.slice(0, 8).map((seq) => (
                <button
                  key={seq.effect}
                  onClick={() => handleColorClick(seq.effect)}
                  className={`h-7 ${
                    activeColor === seq.effect
                      ? 'ring-2 ring-terminal-fg ring-offset-2 ring-offset-terminal-bg'
                      : ''
                  }`}
                  style={{ backgroundColor: seq.color }}
                  title={`${seq.desc} (${seq.display})`}
                />
              ))}
            </div>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {COLOR_SEQUENCES.slice(8).map((seq) => (
                <button
                  key={seq.effect}
                  onClick={() => handleColorClick(seq.effect)}
                  className={`h-7 ${
                    activeColor === seq.effect
                      ? 'ring-2 ring-terminal-fg ring-offset-2 ring-offset-terminal-bg'
                      : ''
                  }`}
                  style={{ backgroundColor: seq.color }}
                  title={`${seq.desc} (${seq.display})`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-terminal-dim mt-2 px-0.5">
              <span>Normal (30-37)</span>
              <span>Bright (90-97)</span>
            </div>
          </div>

          {/* Style Sequences */}
          <div>
            <SubsectionLabel>Style Sequences</SubsectionLabel>
            <div className="flex flex-wrap gap-2">
              {STYLE_SEQUENCES.map((seq) => (
                <button
                  key={seq.effect}
                  onClick={() => toggleEffect(seq.effect)}
                  className={`px-3 py-1.5 border transition-all text-sm ${
                    activeEffects.has(seq.effect)
                      ? 'border-terminal-fg bg-terminal-fg/10 text-terminal-fg'
                      : 'border-terminal-border text-terminal-muted hover:border-terminal-dim hover:text-terminal-fg'
                  }`}
                >
                  <code className="text-terminal-yellow text-xs">
                    {seq.display}
                  </code>
                  <span className="ml-2">{seq.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Sequences */}
          <div>
            <SubsectionLabel>Cursor Sequences</SubsectionLabel>
            <div className="space-y-1">
              {CURSOR_SEQUENCES.map((seq) => (
                <div
                  key={seq.effect}
                  className="flex items-center justify-between px-3 py-2 border border-terminal-border text-sm"
                >
                  <code className="text-terminal-yellow text-xs">
                    {seq.display}
                  </code>
                  <span className="text-terminal-muted">{seq.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SubsectionLabel>Preview</SubsectionLabel>
          <TerminalWindow>
            <div className="min-h-[180px] flex flex-col">
              <div className="text-xs text-terminal-dim mb-4">
                {getActiveSequences().length === 0
                  ? 'No escape sequences active'
                  : `Active: ${getActiveSequences().join(' ')}`}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xl" style={getTextStyle()}>
                  {demoText}
                </span>
              </div>
              <input
                type="text"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                placeholder="Type something..."
                className="w-full bg-terminal-bg border border-terminal-border px-3 py-2 text-sm text-terminal-fg placeholder:text-terminal-dim focus:outline-none focus:border-terminal-muted mt-4"
              />
            </div>
          </TerminalWindow>

          {/* Color info panel */}
          {activeColor && (
            <InfoPanel className="mt-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6"
                  style={{ backgroundColor: getActiveColorObj()?.color }}
                />
                <div>
                  <span className="text-terminal-fg">
                    {getActiveColorObj()?.desc}
                  </span>
                  <code className="text-terminal-yellow ml-2 text-xs">
                    {getActiveColorObj()?.display}
                  </code>
                </div>
              </div>
            </InfoPanel>
          )}
        </div>
      </div>

      <div className="text-terminal-muted text-sm">
        <code className="text-terminal-yellow">^[</code> represents the{' '}
        <code className="text-terminal-yellow">ESC</code> character (byte 0x1B).
        The 16-color palette uses codes 30-37 for normal colors and 90-97 for
        bright variants.
      </div>
    </div>
  );
}
