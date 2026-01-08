import { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';

// Standard 16-color ANSI palette
const COLORS = {
  // Normal colors (0-7)
  black: '#0d1117',
  red: '#f85149',
  green: '#3fb950',
  yellow: '#d29922',
  blue: '#58a6ff',
  magenta: '#bc8cff',
  cyan: '#39c5cf',
  white: '#c9d1d9',
  // Bright colors (8-15)
  brightBlack: '#484f58',
  brightRed: '#ff7b72',
  brightGreen: '#56d364',
  brightYellow: '#e3b341',
  brightBlue: '#79c0ff',
  brightMagenta: '#d2a8ff',
  brightCyan: '#56d4dd',
  brightWhite: '#f0f6fc',
};
const BG_COLORS = {
  none: 'transparent',
  dim: '#161b22',
  green: '#3fb95033',
  red: '#f8514933',
  blue: '#58a6ff33',
  yellow: '#d2992233',
  magenta: '#bc8cff33',
  cyan: '#39c5cf33',
};

export function CellZoom() {
  const [char, setChar] = useState('A');
  const [fg, setFg] = useState<keyof typeof COLORS>('green');
  const [bg, setBg] = useState<keyof typeof BG_COLORS>('none');
  const [bold, setBold] = useState(false);
  const [underline, setUnderline] = useState(false);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'.split('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <TerminalWindow title="cell-anatomy" className="flex-shrink-0">
          <div className="flex items-center justify-center p-8">
            <div
              className={`w-32 h-48 flex items-center justify-center text-8xl border-2 border-terminal-green border-dashed rounded-lg transition-all duration-200 ${bold ? 'font-bold' : ''} ${underline ? 'underline' : ''}`}
              style={{ color: COLORS[fg], backgroundColor: BG_COLORS[bg] }}
            >
              {char}
            </div>
          </div>
        </TerminalWindow>

        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-terminal-dim text-sm mb-2">
              Character
            </label>
            <div className="flex flex-wrap gap-1">
              {chars.slice(0, 20).map((c) => (
                <button
                  key={c}
                  onClick={() => setChar(c)}
                  className={`w-8 h-8 flex items-center justify-center border rounded text-sm transition-colors
                    ${char === c ? 'border-terminal-green bg-terminal-green/20 text-terminal-green' : 'border-terminal-border hover:border-terminal-dim'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-terminal-dim text-sm mb-2">
              Foreground Color
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setFg(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${fg === color ? 'scale-110 border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: COLORS[color] }}
                    title={color}
                  />
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-terminal-dim text-sm mb-2">
              Background Color
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(BG_COLORS) as Array<keyof typeof BG_COLORS>).map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setBg(color)}
                    className={`w-8 h-8 rounded border-2 transition-transform ${bg === color ? 'scale-110 border-terminal-green' : 'border-terminal-border'}`}
                    style={{
                      backgroundColor:
                        color === 'none' ? '#0d1117' : BG_COLORS[color],
                    }}
                    title={color}
                  />
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-terminal-dim text-sm mb-2">
              Style Attributes
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={(e) => setBold(e.target.checked)}
                  className="w-4 h-4 accent-terminal-green"
                />
                <span className={bold ? 'font-bold' : ''}>Bold</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={underline}
                  onChange={(e) => setUnderline(e.target.checked)}
                  className="w-4 h-4 accent-terminal-green"
                />
                <span className={underline ? 'underline' : ''}>Underline</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-terminal-highlight border border-terminal-border rounded-lg p-4">
        <span className="text-terminal-dim">This cell contains: </span>
        <span className="text-terminal-green">"{char}"</span>
        <span className="text-terminal-dim"> with </span>
        <span style={{ color: COLORS[fg] }}>{fg}</span>
        <span className="text-terminal-dim"> foreground</span>
        {bg !== 'none' && (
          <>
            <span className="text-terminal-dim">, </span>
            <span className="text-terminal-yellow">{bg}</span>
            <span className="text-terminal-dim"> background</span>
          </>
        )}
        {bold && (
          <>
            <span className="text-terminal-dim">, </span>
            <span className="font-bold">bold</span>
          </>
        )}
        {underline && (
          <>
            <span className="text-terminal-dim">, </span>
            <span className="underline">underlined</span>
          </>
        )}
      </div>
    </div>
  );
}
