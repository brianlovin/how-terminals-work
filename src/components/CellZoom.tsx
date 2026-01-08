import { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';

// Standard 16-color ANSI palette (matching index.css theme)
const COLORS = {
  // Normal colors (0-7)
  black: '#0a0a0a',
  red: '#f85149',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6',
  magenta: '#a855f7',
  cyan: '#06b6d4',
  white: '#e5e5e5',
  // Bright colors (8-15)
  brightBlack: '#525252',
  brightRed: '#ff7b72',
  brightGreen: '#4ade80',
  brightYellow: '#facc15',
  brightBlue: '#60a5fa',
  brightMagenta: '#c084fc',
  brightCyan: '#22d3ee',
  brightWhite: '#fafafa',
};
const BG_COLORS = {
  none: 'transparent',
  dim: '#171717',
  green: '#22c55e33',
  red: '#f8514933',
  blue: '#3b82f633',
  yellow: '#eab30833',
  magenta: '#a855f733',
  cyan: '#06b6d433',
};

export function CellZoom() {
  const [char, setChar] = useState('A');
  const [fg, setFg] = useState<keyof typeof COLORS>('green');
  const [bg, setBg] = useState<keyof typeof BG_COLORS>('none');
  const [bold, setBold] = useState(false);
  const [underline, setUnderline] = useState(false);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'.split('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <TerminalWindow className="flex-shrink-0">
          <div className="flex items-center justify-center p-6">
            <div
              className={`w-28 h-40 flex items-center justify-center text-7xl border border-terminal-border transition-all duration-200 ${bold ? 'font-bold' : ''} ${underline ? 'underline' : ''}`}
              style={{ color: COLORS[fg], backgroundColor: BG_COLORS[bg] }}
            >
              {char}
            </div>
          </div>
        </TerminalWindow>

        <div className="flex-1 space-y-5">
          <div>
            <label className="block text-terminal-dim text-xs uppercase tracking-wider mb-2">
              Character
            </label>
            <div className="flex flex-wrap gap-1">
              {chars.slice(0, 20).map((c) => (
                <button
                  key={c}
                  onClick={() => setChar(c)}
                  className={`w-7 h-7 flex items-center justify-center border text-sm transition-colors
                    ${char === c ? 'border-terminal-fg bg-terminal-fg/10 text-terminal-fg' : 'border-terminal-border text-terminal-muted hover:border-terminal-dim hover:text-terminal-fg'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-terminal-dim text-xs uppercase tracking-wider mb-2">
              Foreground
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setFg(color)}
                    className={`w-6 h-6 transition-all focus:outline-none ${fg === color ? 'ring-2 ring-terminal-fg ring-offset-2 ring-offset-terminal-bg' : 'hover:scale-110'}`}
                    style={{ backgroundColor: COLORS[color] }}
                    title={color}
                  />
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-terminal-dim text-xs uppercase tracking-wider mb-2">
              Background
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(BG_COLORS) as Array<keyof typeof BG_COLORS>).map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setBg(color)}
                    className={`w-6 h-6 border transition-all focus:outline-none ${bg === color ? 'ring-2 ring-terminal-fg ring-offset-2 ring-offset-terminal-bg' : 'border-terminal-border hover:scale-110'}`}
                    style={{
                      backgroundColor:
                        color === 'none' ? '#0a0a0a' : BG_COLORS[color],
                    }}
                    title={color}
                  />
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-terminal-dim text-xs uppercase tracking-wider mb-2">
              Attributes
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={(e) => setBold(e.target.checked)}
                  className="w-4 h-4 accent-terminal-fg"
                />
                <span className={`text-terminal-muted ${bold ? 'font-bold text-terminal-fg' : ''}`}>Bold</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={underline}
                  onChange={(e) => setUnderline(e.target.checked)}
                  className="w-4 h-4 accent-terminal-fg"
                />
                <span className={`text-terminal-muted ${underline ? 'underline text-terminal-fg' : ''}`}>Underline</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-terminal-highlight border border-terminal-border px-4 py-3 text-sm">
        <span className="text-terminal-dim">Cell: </span>
        <span className="text-terminal-fg font-medium">"{char}"</span>
        <span className="text-terminal-dim"> / </span>
        <span style={{ color: COLORS[fg] }}>{fg}</span>
        {bg !== 'none' && (
          <>
            <span className="text-terminal-dim"> on </span>
            <span className="text-terminal-muted">{bg}</span>
          </>
        )}
        {bold && (
          <>
            <span className="text-terminal-dim"> / </span>
            <span className="font-bold text-terminal-fg">bold</span>
          </>
        )}
        {underline && (
          <>
            <span className="text-terminal-dim"> / </span>
            <span className="underline text-terminal-fg">underlined</span>
          </>
        )}
      </div>
    </div>
  );
}
