import { useState, useEffect, useCallback } from "react";
import { TerminalWindow } from "./TerminalWindow";

const ROWS = 12;
const COLS = 40;
const DEMO_TEXT = "Hello, terminal world!";

export function GridDemo() {
  const [grid, setGrid] = useState<string[][]>(() =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(" "))
  );
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  const clearGrid = useCallback(() => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(" ")));
    setTypingIndex(0);
    setIsTyping(false);
  }, []);

  const startTyping = useCallback(() => {
    clearGrid();
    setIsTyping(true);
    setTypingIndex(0);
  }, [clearGrid]);

  useEffect(() => {
    if (!isTyping || typingIndex >= DEMO_TEXT.length) {
      if (typingIndex >= DEMO_TEXT.length) setIsTyping(false);
      return;
    }
    const timer = setTimeout(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        if (typingIndex < COLS) newGrid[0]![typingIndex] = DEMO_TEXT[typingIndex]!;
        return newGrid;
      });
      setTypingIndex((i) => i + 1);
    }, 80);
    return () => clearTimeout(timer);
  }, [isTyping, typingIndex]);

  const handleCellClick = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      const chars = [" ", "#", "@", "*", "X", "O"];
      const idx = chars.indexOf(newGrid[row]![col]!);
      newGrid[row]![col] = chars[(idx + 1) % chars.length]!;
      return newGrid;
    });
  };

  return (
    <div className="space-y-6">
      <TerminalWindow title="grid-demo">
        <div className="overflow-x-auto">
          <div className="inline-grid gap-0 border border-terminal-border" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {grid.map((row, rowIdx) =>
              row.map((char, colIdx) => {
                const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                const isCursor = isTyping && rowIdx === 0 && colIdx === typingIndex;
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`w-3 h-5 flex items-center justify-center text-xs border-r border-b border-terminal-border/30 cursor-pointer transition-colors duration-75
                      ${isHovered ? "bg-terminal-green/20 ring-1 ring-terminal-green" : ""}
                      ${isCursor ? "bg-terminal-green" : "hover:bg-terminal-border/50"}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span className={isCursor ? "text-terminal-bg" : ""}>{char}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </TerminalWindow>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="bg-terminal-highlight border border-terminal-border rounded px-4 py-2">
          {hoveredCell ? (
            <span>Cell: <span className="text-terminal-green">({hoveredCell.row}, {hoveredCell.col})</span></span>
          ) : (
            <span className="text-terminal-dim">Hover over a cell</span>
          )}
        </div>
        <button onClick={startTyping} className="bg-terminal-green text-terminal-bg px-4 py-2 rounded font-bold hover:opacity-90">
          Watch text appear
        </button>
        <button onClick={clearGrid} className="border border-terminal-border px-4 py-2 rounded hover:bg-terminal-border">
          Clear
        </button>
        <span className="text-terminal-dim">Click cells to draw</span>
      </div>
    </div>
  );
}
