import { useState, useEffect, useRef } from "react";
import { TerminalWindow } from "./TerminalWindow";

const GRID_ROWS = 10;
const CELL_WIDTH = 20; // pixels per cell

interface ClickInfo { x: number; y: number; button: number; sequence: string; bytes: string }

export function MouseDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(20);
  const [lastClick, setLastClick] = useState<ClickInfo | null>(null);
  const [mouseEnabled, setMouseEnabled] = useState(true);

  // Measure container and calculate columns
  useEffect(() => {
    const updateCols = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newCols = Math.max(10, Math.floor(width / CELL_WIDTH));
        setCols(newCols);
      }
    };

    updateCols();
    const observer = new ResizeObserver(updateCols);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    if (!mouseEnabled) return;
    const x = col + 1 + 32, y = row + 1 + 32, button = e.button + 32;
    setLastClick({
      x: col + 1, y: row + 1, button: e.button,
      sequence: `^[[M${String.fromCharCode(button)}${String.fromCharCode(x)}${String.fromCharCode(y)}`,
      bytes: `1b 5b 4d ${button.toString(16)} ${x.toString(16)} ${y.toString(16)}`,
    });
  };

  return (
    <div className="space-y-6">
      <TerminalWindow title="mouse-tracking">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={mouseEnabled} onChange={(e) => setMouseEnabled(e.target.checked)} className="w-4 h-4 accent-terminal-green" />
              <span>Mouse tracking <span className={mouseEnabled ? "text-terminal-green" : "text-terminal-red"}>{mouseEnabled ? "enabled" : "disabled"}</span></span>
            </label>
            <span className="text-terminal-dim">(programs request this with <code className="text-terminal-yellow">^[[?1000h</code>)</span>
          </div>

          <div ref={containerRef} className={`grid gap-0 border border-terminal-border rounded w-full ${mouseEnabled ? "" : "opacity-50"}`}
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array(GRID_ROWS).fill(null).map((_, row) =>
              Array(cols).fill(null).map((_, col) => {
                const isClicked = lastClick?.x === col + 1 && lastClick?.y === row + 1;
                return (
                  <div key={`${row}-${col}`}
                    onClick={(e) => handleCellClick(row, col, e)}
                    onContextMenu={(e) => { e.preventDefault(); handleCellClick(row, col, e); }}
                    className={`h-5 flex items-center justify-center text-xs border-r border-b border-terminal-border/30 cursor-crosshair transition-colors
                      ${isClicked ? "bg-terminal-green text-terminal-bg" : "hover:bg-terminal-border/50"}`}
                  >{isClicked ? "X" : ""}</div>
                );
              })
            )}
          </div>

          {lastClick && mouseEnabled ? (
            <div className="bg-terminal-bg rounded p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><div className="text-terminal-dim text-sm">Position</div><div className="text-terminal-green text-xl">({lastClick.x}, {lastClick.y})</div></div>
                <div><div className="text-terminal-dim text-sm">Button</div><div className="text-terminal-yellow text-xl">{["Left", "Middle", "Right"][lastClick.button]}</div></div>
                <div><div className="text-terminal-dim text-sm">Sequence</div><code className="text-terminal-cyan text-lg">{lastClick.sequence}</code></div>
              </div>
              <div className="text-center"><span className="text-terminal-dim text-sm">Raw bytes: </span><code className="text-terminal-yellow">{lastClick.bytes}</code></div>
            </div>
          ) : (
            <div className="text-terminal-dim text-center py-4">{mouseEnabled ? "Click anywhere in the grid (try right-click too!)" : "Enable mouse tracking to capture clicks"}</div>
          )}
        </div>
      </TerminalWindow>

      <div className="text-terminal-dim text-sm">
        By default, terminals don't send mouse events. Programs like Claude Code request mouse tracking, then clicks become escape sequences with coordinates. That's how CLI tools can have clickable UIs!
      </div>
    </div>
  );
}
