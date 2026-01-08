import { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalWindow } from './TerminalWindow';

// Box drawing characters used in TUIs
const BOX = {
  tl: '┌', // top-left
  tr: '┐', // top-right
  bl: '└', // bottom-left
  br: '┘', // bottom-right
  h: '─', // horizontal
  v: '│', // vertical
  t: '┬', // T down
  b: '┴', // T up
  l: '├', // T right
  r: '┤', // T left
  x: '┼', // cross
};

interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  focusable: boolean;
}

interface LayoutState {
  regions: Region[];
  focusedRegion: string;
  cursorPos: { x: number; y: number };
  terminalSize: { cols: number; rows: number };
}

// Simulated TUI data
const SIDEBAR_ITEMS = [
  { id: 'deploy-1', name: 'ci-fe-be-rules', status: 'success' },
  { id: 'deploy-2', name: 'ci-api-test', status: 'running' },
  { id: 'deploy-3', name: 'ci-email-service', status: 'success' },
  { id: 'deploy-4', name: 'ci-auth-core', status: 'failed' },
  { id: 'deploy-5', name: 'ci-db-migration', status: 'pending' },
];

const TABS = ['Continuous', 'Integration', 'Logging'];

type ExplainerStep =
  | 'overview'
  | 'layout-system'
  | 'focus-management'
  | 'resize-handling'
  | 'rendering';

interface StepContent {
  title: string;
  description: string;
  highlightRegions: string[];
}

const EXPLAINER_STEPS: Record<ExplainerStep, StepContent> = {
  overview: {
    title: 'The Layout System',
    description:
      "Advanced TUIs divide the terminal into regions. Each region is a rectangular area with its own content and borders. The TUI framework tracks each region's position and size in the character grid.",
    highlightRegions: ['tabs', 'sidebar', 'content'],
  },
  'layout-system': {
    title: 'Region Coordinates',
    description:
      'Each region stores its position (x, y) and dimensions (width, height) in character cells. Box-drawing characters (like ┌─┐│) create visual borders. The TUI recalculates these when content changes.',
    highlightRegions: [],
  },
  'focus-management': {
    title: 'Focus & Input Routing',
    description:
      "Only one region is 'focused' at a time (shown with a green border). Keystrokes are routed to the focused region. Tab/arrow keys move focus between regions. The cursor position is tracked within the focused region.",
    highlightRegions: ['sidebar'],
  },
  'resize-handling': {
    title: 'Terminal Resize',
    description:
      "When you resize the terminal window, it sends a SIGWINCH signal. The TUI queries the new size with ioctl(), then recalculates every region's dimensions and re-renders the entire screen.",
    highlightRegions: [],
  },
  rendering: {
    title: 'Full-Screen Rendering',
    description:
      "TUIs often use 'alternate screen mode' (CSI ?1049h) for a clean canvas. They position the cursor with escape codes and draw each cell. Double-buffering prevents flicker: draw to memory first, then output all at once.",
    highlightRegions: [],
  },
};

export function AdvancedTUIDemo() {
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('overview');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [focusedRegion, setFocusedRegion] = useState<
    'tabs' | 'sidebar' | 'content'
  >('sidebar');
  const [terminalSize, setTerminalSize] = useState({ cols: 60, rows: 20 });
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation in the demo
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const regions: ('tabs' | 'sidebar' | 'content')[] = [
          'tabs',
          'sidebar',
          'content',
        ];
        const currentIdx = regions.indexOf(focusedRegion);
        setFocusedRegion(regions[(currentIdx + 1) % regions.length]!);
      } else if (
        focusedRegion === 'tabs' &&
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
      ) {
        e.preventDefault();
        setActiveTab((prev) => {
          if (e.key === 'ArrowLeft') return Math.max(0, prev - 1);
          return Math.min(TABS.length - 1, prev + 1);
        });
      } else if (
        focusedRegion === 'sidebar' &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      ) {
        e.preventDefault();
        setSelectedItem((prev) => {
          if (e.key === 'ArrowUp') return Math.max(0, prev - 1);
          return Math.min(SIDEBAR_ITEMS.length - 1, prev + 1);
        });
      }
    },
    [focusedRegion]
  );

  // Simulate resize
  const simulateResize = () => {
    setIsResizing(true);
    const sizes = [
      { cols: 60, rows: 20 },
      { cols: 80, rows: 24 },
      { cols: 50, rows: 16 },
      { cols: 60, rows: 20 },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < sizes.length) {
        setTerminalSize(sizes[i]!);
        i++;
      } else {
        clearInterval(interval);
        setIsResizing(false);
      }
    }, 600);
  };

  // Calculate region dimensions based on terminal size
  const calculateRegions = (): Region[] => {
    const sidebarWidth = Math.floor(terminalSize.cols * 0.35);
    const contentWidth = terminalSize.cols - sidebarWidth;
    const tabHeight = 3;
    const contentHeight = terminalSize.rows - tabHeight;

    return [
      {
        id: 'tabs',
        name: 'Tab Bar',
        x: 0,
        y: 0,
        width: terminalSize.cols,
        height: tabHeight,
        color: 'terminal-magenta',
        focusable: true,
      },
      {
        id: 'sidebar',
        name: 'Sidebar',
        x: 0,
        y: tabHeight,
        width: sidebarWidth,
        height: contentHeight,
        color: 'terminal-blue',
        focusable: true,
      },
      {
        id: 'content',
        name: 'Content',
        x: sidebarWidth,
        y: tabHeight,
        width: contentWidth,
        height: contentHeight,
        color: 'terminal-cyan',
        focusable: true,
      },
    ];
  };

  const regions = calculateRegions();
  const stepContent = EXPLAINER_STEPS[currentStep];

  // Render the simulated TUI
  const renderTUI = () => {
    const selectedDeploy = SIDEBAR_ITEMS[selectedItem]!;
    const sidebarWidth = Math.floor(terminalSize.cols * 0.35);

    // Generate status content
    const statusColor = {
      success: 'text-terminal-green',
      running: 'text-terminal-yellow',
      failed: 'text-terminal-red',
      pending: 'text-terminal-dim',
    }[selectedDeploy.status];

    return (
      <div
        className="font-mono text-xs leading-tight select-none"
        style={{ minWidth: `${terminalSize.cols}ch` }}
      >
        {/* Tab bar */}
        <div
          className={`flex border-b border-terminal-border ${focusedRegion === 'tabs' ? 'ring-1 ring-terminal-green' : ''}`}
          onClick={() => setFocusedRegion('tabs')}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(i);
                setFocusedRegion('tabs');
              }}
              className={`px-3 py-1 border-r border-terminal-border transition-colors ${
                i === activeTab
                  ? 'bg-terminal-green/20 text-terminal-green border-b-2 border-b-terminal-green'
                  : 'text-terminal-dim hover:text-terminal-fg'
              }`}
            >
              {tab}
            </button>
          ))}
          {showCoordinates && (
            <span className="ml-auto text-terminal-magenta text-[10px] pr-2 self-center">
              Region: tabs (0,0) {terminalSize.cols}x3
            </span>
          )}
        </div>

        {/* Main content area */}
        <div
          className="flex"
          style={{ height: `${(terminalSize.rows - 3) * 1.25}em` }}
        >
          {/* Sidebar */}
          <div
            className={`border-r border-terminal-border overflow-hidden ${focusedRegion === 'sidebar' ? 'ring-1 ring-terminal-green' : ''}`}
            style={{ width: `${sidebarWidth}ch` }}
            onClick={() => setFocusedRegion('sidebar')}
          >
            {showCoordinates && (
              <div className="text-terminal-blue text-[10px] px-2 py-1 border-b border-terminal-border">
                Region: sidebar (0,3) {sidebarWidth}x{terminalSize.rows - 3}
              </div>
            )}
            <div className="p-1">
              {SIDEBAR_ITEMS.map((item, i) => {
                const statusIcon = {
                  success: '✓',
                  running: '◐',
                  failed: '✗',
                  pending: '○',
                }[item.status];
                const itemStatusColor = {
                  success: 'text-terminal-green',
                  running: 'text-terminal-yellow',
                  failed: 'text-terminal-red',
                  pending: 'text-terminal-dim',
                }[item.status];

                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(i);
                      setFocusedRegion('sidebar');
                    }}
                    className={`px-2 py-0.5 cursor-pointer truncate flex items-center gap-1 ${
                      i === selectedItem
                        ? 'bg-terminal-green/20 text-terminal-green'
                        : 'hover:bg-terminal-border/50'
                    }`}
                  >
                    <span className={itemStatusColor}>{statusIcon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content area */}
          <div
            className={`flex-1 p-2 overflow-hidden ${focusedRegion === 'content' ? 'ring-1 ring-terminal-green' : ''}`}
            onClick={() => setFocusedRegion('content')}
          >
            {showCoordinates && (
              <div className="text-terminal-cyan text-[10px] mb-2">
                Region: content ({sidebarWidth},3){' '}
                {terminalSize.cols - sidebarWidth}x{terminalSize.rows - 3}
              </div>
            )}
            <div className="text-terminal-fg font-bold mb-2">
              {selectedDeploy.name}
            </div>
            <div className="space-y-1 text-terminal-dim">
              <div>
                Status:{' '}
                <span className={statusColor}>{selectedDeploy.status}</span>
              </div>
              <div>Updated: 2024-01-15 14:32:00 UTC</div>
              {selectedDeploy.status === 'running' && (
                <div className="mt-2 text-terminal-yellow animate-pulse">
                  Building... ████████░░░░░░░░ 52%
                </div>
              )}
              {selectedDeploy.status === 'failed' && (
                <div className="mt-2 text-terminal-red text-[10px]">
                  Error: Test suite failed (3 failures)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-8">
      {/* Main interactive demo */}
      <div className="grid grid-cols-1 gap-6">
        {/* Left: The simulated TUI */}
        <div className="space-y-4">
          <div className="text-sm text-terminal-dim">Interactive TUI Demo</div>
          <TerminalWindow>
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="focus:outline-none"
            >
              {renderTUI()}
            </div>
          </TerminalWindow>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              onClick={() => setShowCoordinates(!showCoordinates)}
              className={`px-3 py-1.5 border transition-colors ${
                showCoordinates
                  ? 'bg-terminal-green/20 border-terminal-green text-terminal-green'
                  : 'border-terminal-border hover:border-terminal-green'
              }`}
            >
              {showCoordinates ? 'Hide' : 'Show'} Coordinates
            </button>
            <button
              onClick={simulateResize}
              disabled={isResizing}
              className={`px-3 py-1.5 border transition-colors ${
                isResizing
                  ? 'border-terminal-yellow text-terminal-yellow animate-pulse'
                  : 'border-terminal-border hover:border-terminal-green'
              }`}
            >
              {isResizing ? 'Resizing...' : 'Simulate Resize'}
            </button>
            <span className="text-terminal-dim self-center">
              Size: {terminalSize.cols}x{terminalSize.rows}
            </span>
          </div>

          <div className="text-terminal-dim text-sm bg-terminal-bg border border-terminal-border p-3">
            <span className="text-terminal-red">Try it:</span> Click to focus a
            region. Use{' '}
            <kbd className="bg-terminal-highlight px-1 rounded">Tab</kbd> to
            cycle focus. Use{' '}
            <kbd className="bg-terminal-highlight px-1 rounded">↑↓</kbd> in
            sidebar,
            <kbd className="bg-terminal-highlight px-1 rounded">←→</kbd> in
            tabs.
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="space-y-4">
          <label className="block text-terminal-dim text-xs uppercase tracking-wider">How It Works</label>

          <div className="bg-terminal-highlight border min-h-[340px] border-terminal-border px-4 py-4 space-y-4">
            <div className="text-terminal-fg font-medium text-sm">
              {stepContent.title}
            </div>
            <p className="text-terminal-muted text-sm leading-relaxed">
              {stepContent.description}
            </p>

            {/* Step-specific visualizations */}
            {currentStep === 'layout-system' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // Region data structure
                </div>
                <div className="text-terminal-fg">
                  {regions.map((r) => (
                    <div key={r.id} className="ml-2">
                      <span className={`text-${r.color}`}>{r.name}</span>:
                      <span className="text-terminal-yellow">
                        {' '}
                        x={r.x}, y={r.y}, w={r.width}, h={r.height}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'focus-management' && (
              <div className="bg-terminal-highlight p-3 space-y-2">
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded border-2 border-terminal-green bg-terminal-green/20"></span>
                    <span>
                      Currently focused:{' '}
                      <span className="text-terminal-green">
                        {focusedRegion}
                      </span>
                    </span>
                  </div>
                  <div className="text-terminal-dim mt-2">
                    Focus determines where keystrokes go. The cursor (if any)
                    lives in the focused region.
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'resize-handling' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // Terminal resize sequence
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-terminal-yellow">1.</span> User drags
                    window edge
                  </div>
                  <div>
                    <span className="text-terminal-yellow">2.</span> OS sends{' '}
                    <span className="text-terminal-cyan">SIGWINCH</span> signal
                  </div>
                  <div>
                    <span className="text-terminal-yellow">3.</span> App calls{' '}
                    <span className="text-terminal-green">
                      ioctl(TIOCGWINSZ)
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-yellow">4.</span> Gets new
                    size:{' '}
                    <span className="text-terminal-magenta">
                      {terminalSize.cols}×{terminalSize.rows}
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-yellow">5.</span> Recalculate
                    all region bounds
                  </div>
                  <div>
                    <span className="text-terminal-yellow">6.</span> Clear
                    screen + redraw everything
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'rendering' && (
              <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                <div className="text-terminal-dim">
                  // Escape sequences for TUI rendering
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-terminal-cyan">\x1b[?1049h</span>{' '}
                    <span className="text-terminal-dim">
                      — Enter alternate screen
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">\x1b[2J</span>{' '}
                    <span className="text-terminal-dim">
                      — Clear entire screen
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">\x1b[H</span>{' '}
                    <span className="text-terminal-dim">
                      — Move cursor to (1,1)
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">
                      \x1b[{'{row}'};{'{col}'}H
                    </span>{' '}
                    <span className="text-terminal-dim">
                      — Move cursor to position
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">\x1b[?25l</span>{' '}
                    <span className="text-terminal-dim">
                      — Hide cursor while drawing
                    </span>
                  </div>
                  <div>
                    <span className="text-terminal-cyan">\x1b[?25h</span>{' '}
                    <span className="text-terminal-dim">
                      — Show cursor when done
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step navigation */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
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
              ← Back
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
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Detailed breakdown: How regions work */}
      <div className="border border-terminal-border p-6 space-y-6">
        <h3 className="text-terminal-red text-sm font-bold">
          Under the Hood: TUI Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="flex text-sm items-center gap-2 text-terminal-magenta font-bold">
              <span>1</span>
              <span>Layout Engine</span>
            </div>
            <p className="text-sm text-terminal-dim">
              The TUI maintains a tree of regions (like a DOM). Each region
              knows its bounds and can have children. When the container
              resizes, bounds propagate down the tree.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="flex text-sm items-center gap-2 text-terminal-blue font-bold">
              <span>2</span>
              <span>Event Dispatch</span>
            </div>
            <p className="text-sm text-terminal-dim">
              Input events (keys, mouse) go to the focused region first. If
              unhandled, they bubble up. Mouse clicks hit-test against region
              bounds to determine which region was clicked.
            </p>
          </div>

          <div className="bg-terminal-highlight p-4 space-y-2">
            <div className="flex text-sm items-center gap-2 text-terminal-cyan font-bold">
              <span>3</span>
              <span>Render Loop</span>
            </div>
            <p className="text-sm text-terminal-dim">
              Each region renders to a buffer (2D array of cells). Buffers merge
              into a final screen buffer. Only changed cells get written to the
              terminal, minimizing escape sequences.
            </p>
          </div>
        </div>

        {/* Box drawing character reference */}
        <div className="bg-terminal-bg border border-terminal-border p-4 space-y-3">
          <div className="text-terminal-red text-sm font-bold">
            Box Drawing Characters
          </div>
          <div className="font-mono text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-terminal-dim">Corners</div>
              <div>┌ ┐ └ ┘</div>
            </div>
            <div className="space-y-1">
              <div className="text-terminal-dim">Lines</div>
              <div>─ │ ═ ║</div>
            </div>
            <div className="space-y-1">
              <div className="text-terminal-dim">T-Junctions</div>
              <div>┬ ┴ ├ ┤</div>
            </div>
            <div className="space-y-1">
              <div className="text-terminal-dim">Crosses</div>
              <div>┼ ╬ ╪ ╫</div>
            </div>
          </div>
          <p className="text-terminal-dim text-xs">
            These Unicode characters create the borders you see in TUIs. They're
            just regular characters—the terminal renders them like any other
            text.
          </p>
        </div>
      </div>

      {/* The cursor position explainer */}
      <CursorPositionDemo />
    </div>
  );
}

// Sub-component for cursor positioning
function CursorPositionDemo() {
  const [cursorPos, setCursorPos] = useState({ row: 1, col: 1 });
  const GRID_ROWS = 5;
  const GRID_COLS = 20;

  return (
    <div className="border border-terminal-border p-6 space-y-4">
      <h3 className="text-terminal-red text-sm font-bold">
        Cursor Positioning
      </h3>
      <p className="text-terminal-dim text-sm">
        The terminal tracks a single cursor position. TUIs constantly move this
        cursor using escape sequences to draw in different regions. Click any
        cell below to see the escape sequence that would move the cursor there.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="font-mono text-xs">
          <div
            className="grid gap-0 border border-terminal-border"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
          >
            {Array(GRID_ROWS)
              .fill(null)
              .map((_, row) =>
                Array(GRID_COLS)
                  .fill(null)
                  .map((_, col) => {
                    const isActive =
                      cursorPos.row === row + 1 && cursorPos.col === col + 1;
                    return (
                      <div
                        key={`${row}-${col}`}
                        onClick={() =>
                          setCursorPos({ row: row + 1, col: col + 1 })
                        }
                        className={`w-4 h-5 flex items-center justify-center border-r border-b border-terminal-border/30 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-terminal-green text-terminal-bg'
                            : 'hover:bg-terminal-border/50'
                        }`}
                      >
                        {isActive ? '█' : '·'}
                      </div>
                    );
                  })
              )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="bg-terminal-highlight p-3 font-mono text-sm">
            <div className="text-terminal-dim text-xs mb-2">
              Escape sequence to move cursor:
            </div>
            <div className="text-terminal-cyan">
              \x1b[{cursorPos.row};{cursorPos.col}H
            </div>
          </div>
          <div className="bg-terminal-highlight p-3 font-mono text-sm">
            <div className="text-terminal-dim text-xs mb-2">In code:</div>
            <div className="text-terminal-fg">
              <span className="text-terminal-magenta">printf</span>
              <span className="text-terminal-yellow">(</span>
              <span className="text-terminal-green">
                "\033[{cursorPos.row};{cursorPos.col}H"
              </span>
              <span className="text-terminal-yellow">)</span>
            </div>
          </div>
          <p className="text-terminal-dim text-xs">
            Position ({cursorPos.row}, {cursorPos.col}) — Row {cursorPos.row},
            Column {cursorPos.col}. Terminal coordinates are 1-indexed (row 1,
            col 1 is top-left).
          </p>
        </div>
      </div>
    </div>
  );
}
