import { useState, useEffect, useCallback, useRef } from 'react';
import { TerminalWindow } from './TerminalWindow';

const ROWS = 12;
const CELL_WIDTH = 12; // pixels per cell
const DEMO_TEXT = 'Hello, terminal world!';

export function GridDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(40);
  const [grid, setGrid] = useState<string[][]>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(40).fill(' '))
  );
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  // Measure container and calculate columns
  useEffect(() => {
    const updateCols = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newCols = Math.max(20, Math.floor(width / CELL_WIDTH));
        setCols(newCols);
        setGrid((prev) => {
          // Preserve existing content when resizing
          return Array(ROWS)
            .fill(null)
            .map((_, rowIdx) =>
              Array(newCols)
                .fill(null)
                .map((_, colIdx) => prev[rowIdx]?.[colIdx] ?? ' ')
            );
        });
      }
    };

    updateCols();
    const observer = new ResizeObserver(updateCols);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(
      Array(ROWS)
        .fill(null)
        .map(() => Array(cols).fill(' '))
    );
    setTypingIndex(0);
    setIsTyping(false);
  }, [cols]);

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
        if (typingIndex < cols)
          newGrid[0]![typingIndex] = DEMO_TEXT[typingIndex]!;
        return newGrid;
      });
      setTypingIndex((i) => i + 1);
    }, 80);
    return () => clearTimeout(timer);
  }, [isTyping, typingIndex, cols]);

  const handleCellClick = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      const chars = [' ', '#', '@', '*', 'X', 'O'];
      const idx = chars.indexOf(newGrid[row]![col]!);
      newGrid[row]![col] = chars[(idx + 1) % chars.length]!;
      return newGrid;
    });
  };

  return (
    <div className="space-y-6">
      <TerminalWindow noPadding>
        <div ref={containerRef} className="w-full">
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {grid.map((row, rowIdx) =>
              row.map((char, colIdx) => {
                const isHovered =
                  hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                const isCursor =
                  isTyping && rowIdx === 0 && colIdx === typingIndex;
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`h-5 flex items-center justify-center text-xs border-r border-b border-terminal-border/80 cursor-pointer transition-colors duration-75
                      ${isHovered ? 'bg-terminal-green/20 ring-1 ring-inset ring-terminal-green' : ''}
                      ${isCursor ? 'bg-terminal-green' : 'hover:bg-terminal-border/50'}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    onMouseEnter={() =>
                      setHoveredCell({ row: rowIdx, col: colIdx })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span className={isCursor ? 'text-terminal-bg' : ''}>
                      {char}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </TerminalWindow>

      <div className="bg-terminal-highlight border border-terminal-border px-4 py-3 text-sm">
        {hoveredCell ? (
          <span className="text-terminal-muted">
            Cell{' '}
            <span className="text-terminal-fg font-medium">
              ({hoveredCell.row}, {hoveredCell.col})
            </span>
          </span>
        ) : (
          <span className="text-terminal-dim">Hover over a cell</span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          onClick={startTyping}
          className="bg-terminal-fg text-terminal-bg px-4 py-2 font-medium hover:bg-terminal-bright-white transition-colors"
        >
          Add text
        </button>
        <button
          onClick={clearGrid}
          className="border border-terminal-border px-4 py-2 text-terminal-muted hover:text-terminal-fg hover:border-terminal-dim transition-colors"
        >
          Clear
        </button>
        <span className="text-terminal-dim text-sm">Click cells to draw</span>
      </div>
    </div>
  );
}
