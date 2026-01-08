import { useState, useRef, useCallback, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow';

type SelectionMode = 'terminal' | 'app';

const SAMPLE_TEXT = [
  '~/projects $ ls -la',
  'total 24',
  'drwxr-xr-x  5 user staff  160 Jan  7 10:00 .',
  'drwxr-xr-x 12 user staff  384 Jan  6 15:30 ..',
  '-rw-r--r--  1 user staff  234 Jan  7 09:45 README.md',
  '-rw-r--r--  1 user staff 1024 Jan  7 10:00 index.ts',
  'drwxr-xr-x  3 user staff   96 Jan  5 14:20 src',
  '~/projects $ echo "Hello, World!"',
  'Hello, World!',
  '~/projects $ _',
];

interface CursorPosition {
  row: number;
  col: number;
}

type ExplainerStep =
  | 'overview'
  | 'terminal-selection'
  | 'cursor-positioning'
  | 'option-click'
  | 'why-different';

const EXPLAINER_STEPS: Record<
  ExplainerStep,
  { title: string; description: string }
> = {
  overview: {
    title: 'Two Types of Selection',
    description:
      "In terminals, there are two completely different 'selections': terminal-level text selection (what the terminal emulator handles) and cursor position (where the app thinks the cursor is). They're independent and often confuse people.",
  },
  'terminal-selection': {
    title: 'Terminal-Level Selection',
    description:
      "When you click and drag in a terminal, the terminal emulator (iTerm, Terminal.app, etc.) handles selection. It's highlighting text on screen for copy/paste. The running program doesn't know you're selecting—it just sees characters on a grid.",
  },
  'cursor-positioning': {
    title: 'App Cursor Position',
    description:
      "The blinking cursor in vim or your shell prompt is controlled by the app, not the terminal. The app sends escape sequences like ESC[5;10H to move the cursor to row 5, column 10. Clicking on the screen doesn't automatically move this cursor.",
  },
  'option-click': {
    title: 'Option+Click: The Bridge',
    description:
      "Some terminals support Option+Click (or Alt+Click) to move the cursor. When you do this, the terminal calculates where you clicked and sends arrow key sequences to move the cursor there. It's simulating keypresses, not directly moving the cursor!",
  },
  'why-different': {
    title: "Why They're Separate",
    description:
      "The terminal is just a character display. It doesn't know if you're in vim (where clicking should move cursor) or running 'cat' (where there's no cursor). The app must opt into mouse handling. Without it, clicks are just for terminal-level selection.",
  },
};

export function TextSelectionDemo() {
  const [mode, setMode] = useState<SelectionMode>('terminal');
  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    row: 9,
    col: 15,
  });
  const [selectedRange, setSelectedRange] = useState<{
    start: CursorPosition;
    end: CursorPosition;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<CursorPosition | null>(null);
  const [showArrowKeys, setShowArrowKeys] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('overview');
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellMouseDown = useCallback(
    (row: number, col: number, e: React.MouseEvent) => {
      e.preventDefault();

      if (mode === 'terminal') {
        // Terminal selection mode - start drag selection
        setIsDragging(true);
        setDragStart({ row, col });
        setSelectedRange({ start: { row, col }, end: { row, col } });
      } else {
        // App mode with option click - show cursor movement
        if (e.altKey) {
          // Option+click - calculate arrow keys needed
          const arrows: string[] = [];
          const rowDiff = row - cursorPos.row;
          const colDiff = col - cursorPos.col;

          if (rowDiff > 0) for (let i = 0; i < rowDiff; i++) arrows.push('↓');
          if (rowDiff < 0) for (let i = 0; i < -rowDiff; i++) arrows.push('↑');
          if (colDiff > 0) for (let i = 0; i < colDiff; i++) arrows.push('→');
          if (colDiff < 0) for (let i = 0; i < -colDiff; i++) arrows.push('←');

          setShowArrowKeys(arrows);
          setCursorPos({ row, col });

          // Clear arrow display after animation
          setTimeout(() => setShowArrowKeys([]), 1500);
        }
      }
    },
    [mode, cursorPos]
  );

  const handleCellMouseMove = useCallback(
    (row: number, col: number) => {
      if (isDragging && dragStart && mode === 'terminal') {
        setSelectedRange({ start: dragStart, end: { row, col } });
      }
    },
    [isDragging, dragStart, mode]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const isInSelection = useCallback(
    (row: number, col: number): boolean => {
      if (!selectedRange) return false;

      // Normalize selection direction (start should be before end in reading order)
      let startRow = selectedRange.start.row;
      let startCol = selectedRange.start.col;
      let endRow = selectedRange.end.row;
      let endCol = selectedRange.end.col;

      // Swap if selection is backwards
      if (startRow > endRow || (startRow === endRow && startCol > endCol)) {
        [startRow, endRow] = [endRow, startRow];
        [startCol, endCol] = [endCol, startCol];
      }

      // Line-based selection like real terminals:
      // - First row: from startCol to end of line
      // - Middle rows: entire line
      // - Last row: from start to endCol
      if (startRow === endRow) {
        // Single row selection
        return row === startRow && col >= startCol && col <= endCol;
      } else {
        // Multi-row selection
        if (row === startRow) {
          // First row: from start column to end of line
          return col >= startCol;
        } else if (row === endRow) {
          // Last row: from start of line to end column
          return col <= endCol;
        } else if (row > startRow && row < endRow) {
          // Middle rows: entire line
          return true;
        }
        return false;
      }
    },
    [selectedRange]
  );

  const getSelectedText = useCallback((): string => {
    if (!selectedRange) return '';

    // Normalize selection direction
    let startRow = selectedRange.start.row;
    let startCol = selectedRange.start.col;
    let endRow = selectedRange.end.row;
    let endCol = selectedRange.end.col;

    if (startRow > endRow || (startRow === endRow && startCol > endCol)) {
      [startRow, endRow] = [endRow, startRow];
      [startCol, endCol] = [endCol, startCol];
    }

    const lines: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      const line = SAMPLE_TEXT[r] || '';
      if (startRow === endRow) {
        // Single row
        lines.push(line.slice(startCol, endCol + 1));
      } else if (r === startRow) {
        // First row: from startCol to end
        lines.push(line.slice(startCol));
      } else if (r === endRow) {
        // Last row: from start to endCol
        lines.push(line.slice(0, endCol + 1));
      } else {
        // Middle rows: entire line
        lines.push(line);
      }
    }
    return lines.join('\n');
  }, [selectedRange]);

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const currentStepIndex = steps.indexOf(currentStep);
  const stepContent = EXPLAINER_STEPS[currentStep];

  // Get max line length for grid
  const maxCols = Math.max(...SAMPLE_TEXT.map((line) => line.length), 40);

  return (
    <div className="space-y-8">
      {/* Interactive Demo */}
      <div className="space-y-4">
        <TerminalWindow>
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-terminal-dim">Mode:</span>
              <button
                onClick={() => {
                  setMode('terminal');
                  setSelectedRange(null);
                  setShowArrowKeys([]);
                }}
                className={`px-3 py-1 transition-colors ${
                  mode === 'terminal'
                    ? 'bg-terminal-blue text-terminal-bg'
                    : 'border border-terminal-border hover:border-terminal-blue'
                }`}
              >
                Terminal Selection
              </button>
              <button
                onClick={() => {
                  setMode('app');
                  setSelectedRange(null);
                }}
                className={`px-3 py-1 transition-colors ${
                  mode === 'app'
                    ? 'bg-terminal-green text-terminal-bg'
                    : 'border border-terminal-border hover:border-terminal-green'
                }`}
              >
                App Cursor (Option+Click)
              </button>
            </div>

            {/* Terminal Grid */}
            <div
              ref={gridRef}
              className="font-mono text-sm bg-terminal-bg rounded border border-terminal-border overflow-x-auto"
              style={{ userSelect: 'none' }}
            >
              {SAMPLE_TEXT.map((line, row) => (
                <div key={row} className="flex whitespace-pre">
                  {Array(maxCols)
                    .fill(null)
                    .map((_, col) => {
                      const char = line[col] || ' ';
                      const isSelected =
                        mode === 'terminal' && isInSelection(row, col);
                      const isCursor =
                        mode === 'app' &&
                        cursorPos.row === row &&
                        cursorPos.col === col;

                      return (
                        <span
                          key={col}
                          onMouseDown={(e) => handleCellMouseDown(row, col, e)}
                          onMouseMove={() => handleCellMouseMove(row, col)}
                          className={`inline-block w-[0.6em] h-[1.4em] leading-[1.4em] text-center transition-colors
                            ${isSelected ? 'bg-white text-black' : ''}
                            ${isCursor ? 'bg-terminal-green text-terminal-bg' : ''}
                            ${mode === 'terminal' ? 'cursor-text' : 'cursor-pointer'}
                          `}
                        >
                          {char === '_' &&
                          row === SAMPLE_TEXT.length - 1 &&
                          col === 15 ? (
                            <span>_</span>
                          ) : (
                            char
                          )}
                        </span>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Status Area */}
            <div className="bg-terminal-bg rounded p-4 min-h-[80px]">
              {mode === 'terminal' ? (
                selectedRange ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-terminal-dim text-sm">
                        Selected:
                      </span>
                      <code className="text-terminal-blue text-sm">
                        ({selectedRange.start.row},{selectedRange.start.col}) to
                        ({selectedRange.end.row},{selectedRange.end.col})
                      </code>
                    </div>
                    <div className="text-terminal-dim text-sm">
                      The app doesn't know about this selection. It's handled
                      entirely by the terminal emulator for copy/paste.
                    </div>
                    {getSelectedText() && (
                      <div className="mt-2">
                        <span className="text-terminal-dim text-sm">
                          Would copy:{' '}
                        </span>
                        <code className="text-terminal-yellow text-xs bg-terminal-highlight px-2 py-1">
                          {getSelectedText().slice(0, 50)}
                          {getSelectedText().length > 50 ? '...' : ''}
                        </code>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-terminal-dim text-pretty text-center text-sm">
                    Click and drag to select text. This is handled by the
                    terminal, not the running program.
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-terminal-dim text-sm">
                      Cursor position:
                    </span>
                    <code className="text-terminal-green text-sm">
                      row {cursorPos.row + 1}, col {cursorPos.col + 1}
                    </code>
                  </div>
                  {showArrowKeys.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-terminal-dim text-sm">
                        Arrow keys sent by terminal:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {showArrowKeys.map((arrow, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 bg-terminal-yellow/20 text-terminal-yellow text-xs font-mono"
                          >
                            {arrow}
                          </span>
                        ))}
                      </div>
                      <div className="text-terminal-dim text-xs">
                        The terminal simulates {showArrowKeys.length} keypresses
                        to move the cursor!
                      </div>
                    </div>
                  ) : (
                    <div className="text-terminal-dim text-sm">
                      Hold{' '}
                      <kbd className="bg-terminal-highlight px-1 rounded">
                        Option
                      </kbd>{' '}
                      and click anywhere to move the cursor. Watch the arrow key
                      simulation!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TerminalWindow>

        <div className="text-terminal-dim text-sm bg-terminal-bg border border-terminal-border p-3">
          <span className="text-terminal-magenta">Try it:</span> In terminal
          mode, drag to select text. In app mode, hold{' '}
          <kbd className="bg-terminal-highlight px-1 rounded">Option</kbd> (Alt)
          and click to see how the terminal simulates arrow keys to move the
          cursor.
        </div>
      </div>

      {/* How it works explanation */}
      <div className="space-y-4">
        <div className="bg-terminal-highlight border border-terminal-border px-4 py-4 space-y-4">
          <div className="h-[200px] overflow-hidden space-y-4">
            <div className="text-terminal-red font-medium text-sm">
              {stepContent.title}
            </div>
            <p className="text-terminal-muted text-sm leading-relaxed">
              {stepContent.description}
            </p>

            {currentStep === 'terminal-selection' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // Terminal emulator handles selection
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-terminal-yellow">1.</span> You click
                    at position (5, 10)
                  </div>
                  <div>
                    <span className="text-terminal-yellow">2.</span> Terminal
                    emulator stores selection start
                  </div>
                  <div>
                    <span className="text-terminal-yellow">3.</span> You drag to
                    (5, 20)
                  </div>
                  <div>
                    <span className="text-terminal-yellow">4.</span> Terminal
                    highlights cells &amp; stores in clipboard
                  </div>
                  <div className="mt-2 text-terminal-dim">
                    // The running program sees NOTHING
                  </div>
                  <div className="text-terminal-dim">
                    // (unless it enabled mouse tracking)
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'cursor-positioning' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // App controls cursor with escape sequences
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-terminal-green">ESC[H</span>{' '}
                    <span className="text-terminal-dim">
                      — move cursor to (1,1)
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-green">ESC[5;10H</span>{' '}
                    <span className="text-terminal-dim">
                      — move to row 5, col 10
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-green">ESC[A</span>{' '}
                    <span className="text-terminal-dim">
                      — move cursor up one line
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-green">ESC[C</span>{' '}
                    <span className="text-terminal-dim">
                      — move cursor right one col
                    </span>
                  </div>
                  <div className="mt-2 text-terminal-dim">
                    // Terminal just obeys these commands
                  </div>
                  <div className="text-terminal-dim">
                    // It doesn't move cursor on click!
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'option-click' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // Option+Click at (5, 15), cursor at (3, 5)
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-terminal-yellow">1.</span> Terminal
                    calculates: need to go down 2, right 10
                  </div>
                  <div>
                    <span className="text-terminal-yellow">2.</span> Terminal
                    sends:{' '}
                    <span className="text-terminal-cyan">ESC[B ESC[B</span>{' '}
                    <span className="text-terminal-dim">(2x down)</span>
                  </div>
                  <div>
                    <span className="text-terminal-yellow">3.</span> Terminal
                    sends:{' '}
                    <span className="text-terminal-cyan">ESC[C ESC[C ...</span>{' '}
                    <span className="text-terminal-dim">(10x right)</span>
                  </div>
                  <div>
                    <span className="text-terminal-yellow">4.</span> App
                    receives arrow keys, moves its cursor
                  </div>
                  <div className="mt-2 text-terminal-dim">
                    // It's simulating 12 keypresses!
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'why-different' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // Terminal doesn't know what you're running:
                </div>
                <div className="space-y-1 mt-2">
                  <div>
                    <span className="text-terminal-cyan">$ vim file.txt</span>{' '}
                    <span className="text-terminal-dim">
                      ← click should move cursor
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">
                      $ cat longfile.txt
                    </span>{' '}
                    <span className="text-terminal-dim">
                      ← no cursor to move
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">$ python</span>{' '}
                    <span className="text-terminal-dim">
                      ← cursor in REPL prompt
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">$ htop</span>{' '}
                    <span className="text-terminal-dim">
                      ← click selects process
                    </span>
                  </div>
                  <div className="mt-2 text-terminal-dim">
                    // Each app handles mouse differently
                  </div>
                  <div className="text-terminal-dim">
                    // So terminal can't assume anything!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-terminal-border">
            <button
              onClick={() =>
                setCurrentStep(steps[Math.max(0, currentStepIndex - 1)]!)
              }
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 border border-terminal-border hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
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
      </div>

      {/* Key Insight Box */}
      <div className="border border-terminal-border p-6 space-y-6">
        <h3 className="text-terminal-red text-sm font-bold">
          Why You Can't Just Click to Move the Cursor
        </h3>

        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <div className="bg-terminal-highlight p-4 flex-1">
            <div className="text-terminal-fg font-bold text-sm mb-2">
              What You Expect
            </div>
            <div className="text-terminal-dim text-xs">
              Click at position → cursor moves there instantly, like in a text
              editor or browser.
            </div>
          </div>
          <div className="flex items-center justify-center text-terminal-dim text-2xl">
            ≠
          </div>
          <div className="bg-terminal-highlight p-4 flex-1">
            <div className="text-terminal-fg font-bold text-sm mb-2">
              What Actually Happens
            </div>
            <div className="text-terminal-dim text-xs">
              Click → terminal shows selection OR sends mouse event to app (if
              enabled) → app decides what to do.
            </div>
          </div>
        </div>

        <div className="text-terminal-dim text-sm">
          The terminal is a dumb display. It shows characters where the app
          tells it to. Cursor position is owned by the running program, and the
          terminal can only influence it by sending keypress events that the
          program interprets.
        </div>
      </div>
    </div>
  );
}
