import { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';
import {
  SubsectionLabel,
  InfoPanel,
  FeatureBox,
  StepDotsNavigation,
} from './shared';

// Actual Nerd Font Unicode glyphs - these render as icons when the font is loaded
// Using the actual codepoints from Nerd Fonts v3
const NERD_GLYPHS = {
  // File icons (Seti-UI + Custom)
  folder: '\ue5ff', //
  folderOpen: '\ue5fe', //
  file: '\uf15b', //

  // Dev icons (Devicons)
  typescript: '\ue628', //
  javascript: '\ue781', //
  react: '\ue7ba', //
  python: '\ue73c', //
  rust: '\ue7a8', //

  // Git/GitHub (Octicons)
  git: '\uf1d3', //
  github: '\uf408', //

  // File types
  json: '\ue60b', //
  markdown: '\ue73e', //
  docker: '\uf308', //

  // System (Font Awesome)
  terminal: '\uf489', //
  gear: '\uf013', //
  lock: '\uf023', //

  // Status (Font Awesome)
  check: '\uf00c', //
  error: '\uf00d', //
  warning: '\uf071', //
  info: '\uf05a', //
};

// Component for rendering a Nerd Font icon
function NerdIcon({
  glyph,
  className = '',
}: {
  glyph: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block text-center leading-none ${className}`}
      style={{ fontFamily: "'JetBrainsMono Nerd Font', monospace" }}
    >
      {glyph}
    </span>
  );
}

// Icon data with actual glyphs and codepoints
const NERD_FONT_ICONS = [
  {
    icon: 'folder',
    glyph: NERD_GLYPHS.folder,
    name: 'Folder',
    codepoint: 'U+E5FF',
    category: 'Files',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'folderOpen',
    glyph: NERD_GLYPHS.folderOpen,
    name: 'Folder Open',
    codepoint: 'U+E5FE',
    category: 'Files',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'file',
    glyph: NERD_GLYPHS.file,
    name: 'File',
    codepoint: 'U+F15B',
    category: 'Files',
    color: 'text-terminal-fg',
  },
  {
    icon: 'typescript',
    glyph: NERD_GLYPHS.typescript,
    name: 'TypeScript',
    codepoint: 'U+E628',
    category: 'Dev',
    color: 'text-terminal-blue',
  },
  {
    icon: 'javascript',
    glyph: NERD_GLYPHS.javascript,
    name: 'JavaScript',
    codepoint: 'U+E781',
    category: 'Dev',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'react',
    glyph: NERD_GLYPHS.react,
    name: 'React',
    codepoint: 'U+E7BA',
    category: 'Dev',
    color: 'text-terminal-cyan',
  },
  {
    icon: 'python',
    glyph: NERD_GLYPHS.python,
    name: 'Python',
    codepoint: 'U+E73C',
    category: 'Dev',
    color: 'text-terminal-blue',
  },
  {
    icon: 'rust',
    glyph: NERD_GLYPHS.rust,
    name: 'Rust',
    codepoint: 'U+E7A8',
    category: 'Dev',
    color: 'text-terminal-fg',
  },
  {
    icon: 'git',
    glyph: NERD_GLYPHS.git,
    name: 'Git',
    codepoint: 'U+F1D3',
    category: 'Dev',
    color: 'text-terminal-red',
  },
  {
    icon: 'github',
    glyph: NERD_GLYPHS.github,
    name: 'GitHub',
    codepoint: 'U+F408',
    category: 'Dev',
    color: 'text-terminal-fg',
  },
  {
    icon: 'docker',
    glyph: NERD_GLYPHS.docker,
    name: 'Docker',
    codepoint: 'U+F308',
    category: 'Dev',
    color: 'text-terminal-cyan',
  },
  {
    icon: 'terminal',
    glyph: NERD_GLYPHS.terminal,
    name: 'Terminal',
    codepoint: 'U+F489',
    category: 'System',
    color: 'text-terminal-green',
  },
  {
    icon: 'gear',
    glyph: NERD_GLYPHS.gear,
    name: 'Gear',
    codepoint: 'U+F013',
    category: 'System',
    color: 'text-terminal-dim',
  },
  {
    icon: 'lock',
    glyph: NERD_GLYPHS.lock,
    name: 'Lock',
    codepoint: 'U+F023',
    category: 'System',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'check',
    glyph: NERD_GLYPHS.check,
    name: 'Check',
    codepoint: 'U+F00C',
    category: 'Status',
    color: 'text-terminal-green',
  },
  {
    icon: 'error',
    glyph: NERD_GLYPHS.error,
    name: 'Error',
    codepoint: 'U+F00D',
    category: 'Status',
    color: 'text-terminal-red',
  },
  {
    icon: 'warning',
    glyph: NERD_GLYPHS.warning,
    name: 'Warning',
    codepoint: 'U+F071',
    category: 'Status',
    color: 'text-terminal-yellow',
  },
  {
    icon: 'info',
    glyph: NERD_GLYPHS.info,
    name: 'Info',
    codepoint: 'U+F05A',
    category: 'Status',
    color: 'text-terminal-blue',
  },
] as const;

type IconName = keyof typeof NERD_GLYPHS;

// File tree structure for the demo
const FILE_TREE: {
  name: string;
  type: 'folder' | 'file';
  icon: IconName;
  color: string;
  indent: number;
  codepoint: string;
}[] = [
  {
    name: 'src',
    type: 'folder',
    icon: 'folder',
    color: 'text-terminal-yellow',
    indent: 0,
    codepoint: 'U+E5FF',
  },
  {
    name: 'components',
    type: 'folder',
    icon: 'folder',
    color: 'text-terminal-yellow',
    indent: 1,
    codepoint: 'U+E5FF',
  },
  {
    name: 'App.tsx',
    type: 'file',
    icon: 'react',
    color: 'text-terminal-cyan',
    indent: 2,
    codepoint: 'U+E7BA',
  },
  {
    name: 'Button.tsx',
    type: 'file',
    icon: 'react',
    color: 'text-terminal-cyan',
    indent: 2,
    codepoint: 'U+E7BA',
  },
  {
    name: 'utils',
    type: 'folder',
    icon: 'folder',
    color: 'text-terminal-yellow',
    indent: 1,
    codepoint: 'U+E5FF',
  },
  {
    name: 'index.ts',
    type: 'file',
    icon: 'typescript',
    color: 'text-terminal-blue',
    indent: 1,
    codepoint: 'U+E628',
  },
  {
    name: 'package.json',
    type: 'file',
    icon: 'json',
    color: 'text-terminal-green',
    indent: 0,
    codepoint: 'U+E60B',
  },
  {
    name: '.gitignore',
    type: 'file',
    icon: 'git',
    color: 'text-terminal-red',
    indent: 0,
    codepoint: 'U+F1D3',
  },
  {
    name: 'README.md',
    type: 'file',
    icon: 'markdown',
    color: 'text-terminal-fg',
    indent: 0,
    codepoint: 'U+E73E',
  },
  {
    name: 'Dockerfile',
    type: 'file',
    icon: 'docker',
    color: 'text-terminal-cyan',
    indent: 0,
    codepoint: 'U+F308',
  },
];

type ExplainerStep = 'what' | 'how' | 'pua' | 'fonts' | 'rendering';

const STEPS: Record<ExplainerStep, { title: string; description: string }> = {
  what: {
    title: 'What Are Terminal Icons?',
    description:
      "Modern terminal apps like file explorers, status bars, and dev tools display icons for files, folders, and status indicators. These aren't images—they're Unicode characters rendered by special fonts.",
  },
  how: {
    title: 'How They Work',
    description:
      'Terminal icons are just regular Unicode characters. The terminal treats them exactly like letters or numbers—one character per cell. The magic is in the font, which maps these codepoints to icon glyphs.',
  },
  pua: {
    title: 'The Private Use Area',
    description:
      'Unicode reserves ranges (U+E000-U+F8FF) called Private Use Areas. Nerd Fonts place thousands of icons here—dev logos, file types, git symbols, and more. Apps output these codepoints; fonts render them as icons.',
  },
  fonts: {
    title: 'Nerd Fonts',
    description:
      'Nerd Fonts are regular programming fonts (like JetBrains Mono or Fira Code) patched with 3,600+ icons. Install one, set it as your terminal font, and icons just work. No terminal configuration needed.',
  },
  rendering: {
    title: 'The Rendering Pipeline',
    description:
      'When an app outputs an icon: 1) It prints a Unicode character (e.g., U+E628 for TypeScript). 2) The terminal looks up the character in its font. 3) The font maps U+E628 to a TypeScript logo glyph. 4) The terminal draws that glyph in a cell.',
  },
};

export function IconsDemo() {
  const [currentStep, setCurrentStep] = useState<ExplainerStep>('what');
  const [selectedIcon, setSelectedIcon] = useState(NERD_FONT_ICONS[0]);
  const [showWithIcons, setShowWithIcons] = useState(true);
  const [hoveredFile, setHoveredFile] = useState<number | null>(null);

  const steps = Object.keys(STEPS) as ExplainerStep[];
  const currentStepIndex = steps.indexOf(currentStep);
  const stepContent = STEPS[currentStep];

  const categories = [...new Set(NERD_FONT_ICONS.map((i) => i.category))];

  // Render icon using actual Nerd Font glyph
  const renderIcon = (iconName: IconName, color: string) => {
    const glyph = NERD_GLYPHS[iconName];
    if (!glyph) return null;
    return <NerdIcon glyph={glyph} className={`text-base ${color}`} />;
  };

  return (
    <div className="space-y-8">
      {/* Main Demo */}
      <div className="grid grid-cols-1 gap-6">
        {/* File Explorer Demo */}
        <div className="space-y-4">
          <TerminalWindow>
            <div className="font-mono text-sm min-h-[280px]">
              {/* Toggle */}
              <div className="flex items-center gap-4 mb-3 pb-2 border-b border-terminal-border">
                <button
                  onClick={() => setShowWithIcons(!showWithIcons)}
                  className={`px-2 py-1 text-xs transition-colors ${
                    showWithIcons
                      ? 'bg-terminal-green/20 text-terminal-green'
                      : 'text-terminal-dim hover:text-terminal-fg'
                  }`}
                >
                  {showWithIcons ? 'Icons ON' : 'Icons OFF'}
                </button>
                <span className="text-terminal-dim text-xs">
                  {showWithIcons
                    ? 'Showing actual Nerd Font glyphs'
                    : 'Plain text only'}
                </span>
              </div>

              {/* File tree */}
              <div className="space-y-0.5">
                {FILE_TREE.map((item, idx) => {
                  const isHovered = hoveredFile === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        isHovered
                          ? 'bg-terminal-green/20'
                          : 'hover:bg-terminal-border/50'
                      }`}
                      style={{ paddingLeft: `${item.indent * 16 + 8}px` }}
                      onMouseEnter={() => setHoveredFile(idx)}
                      onMouseLeave={() => setHoveredFile(null)}
                    >
                      {showWithIcons ? (
                        <span className="flex-shrink-0">
                          {renderIcon(item.icon, item.color)}
                        </span>
                      ) : (
                        <span className="text-terminal-dim w-4 text-center">
                          {item.type === 'folder' ? 'D' : 'F'}
                        </span>
                      )}
                      <span
                        className={
                          isHovered ? 'text-terminal-green' : 'text-terminal-fg'
                        }
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Hovered file info */}
              {hoveredFile !== null && (
                <div className="absolute bottom-4 right-4 border bg-terminal-bg border-terminal-border text-xs z-10">
                  <div className="flex items-center gap-4 bg-terminal-highlight rounded p-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-terminal-bg rounded border border-terminal-border">
                      {renderIcon(
                        FILE_TREE[hoveredFile].icon,
                        FILE_TREE[hoveredFile].color
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-terminal-fg">
                        <span className="text-terminal-cyan">
                          {FILE_TREE[hoveredFile].name}
                        </span>
                      </div>
                      <div className="text-terminal-yellow font-mono">
                        {FILE_TREE[hoveredFile].codepoint}
                      </div>
                    </div>
                    <div className="text-terminal-dim text-right">
                      One character
                      <br />
                      One cell
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>

        {/* Explanation */}
        <div className="space-y-4">
          <InfoPanel className="px-4 py-4 space-y-4">
            <div className="h-[180px] overflow-hidden space-y-4">
              <div className="text-terminal-red font-medium text-sm">
                {stepContent.title}
              </div>
              <p className="text-terminal-muted text-sm leading-relaxed">
                {stepContent.description}
              </p>

              {/* Step-specific content */}
              {currentStep === 'pua' && (
                <div className="bg-terminal-highlight p-3 font-mono text-xs space-y-2">
                  <div className="text-terminal-dim">
                    // Unicode Private Use Area ranges
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-terminal-cyan">
                        U+E000 - U+F8FF
                      </span>{' '}
                      <span className="text-terminal-dim">
                        — Basic Multilingual Plane PUA
                      </span>
                    </div>
                    <div>
                      <span className="text-terminal-cyan">
                        U+F0000 - U+FFFFD
                      </span>{' '}
                      <span className="text-terminal-dim">
                        — Supplementary PUA-A
                      </span>
                    </div>
                    <div>
                      <span className="text-terminal-cyan">
                        U+100000 - U+10FFFD
                      </span>{' '}
                      <span className="text-terminal-dim">
                        — Supplementary PUA-B
                      </span>
                    </div>
                  </div>
                  <div className="text-terminal-yellow mt-2">
                    Nerd Fonts uses ~3,600 codepoints in these ranges
                  </div>
                </div>
              )}

              {currentStep === 'rendering' && (
                <div className="bg-terminal-highlight p-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-terminal-cyan font-mono text-xs">
                        App outputs
                      </span>
                      <span className="text-terminal-yellow font-mono">
                        U+E628
                      </span>
                    </div>
                    <span className="text-terminal-dim">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-terminal-cyan font-mono text-xs">
                        Font lookup
                      </span>
                      <span className="text-terminal-green">Nerd Font</span>
                    </div>
                    <span className="text-terminal-dim">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-terminal-cyan font-mono text-xs">
                        Rendered
                      </span>
                      <div className="w-6 h-6">
                        {renderIcon('typescript', 'text-terminal-blue')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'fonts' && (
                <div className="bg-terminal-highlight p-3 text-xs space-y-2">
                  <div className="text-terminal-dim">Popular Nerd Fonts:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>JetBrainsMono Nerd Font</span>
                    </div>
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>FiraCode Nerd Font</span>
                    </div>
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>Hack Nerd Font</span>
                    </div>
                    <div className="flex items-center gap-2 text-terminal-fg">
                      {renderIcon('check', 'text-terminal-green')}
                      <span>CaskaydiaCove Nerd Font</span>
                    </div>
                  </div>
                  <div className="text-terminal-cyan mt-2">
                    Download: nerdfonts.com
                  </div>
                </div>
              )}
            </div>

            {/* Step navigation */}
            <StepDotsNavigation
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          </InfoPanel>
        </div>
      </div>

      {/* Icon Gallery */}
      <div className="border bg-terminal-highlight border-terminal-border p-6 space-y-6">
        <h3 className="text-terminal-red text-sm font-bold">
          Nerd Font Icon Gallery
        </h3>
        <p className="text-terminal-dim text-sm">
          Click any icon to see its Unicode codepoint and how to use it in code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Icon grid by category */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <SubsectionLabel className="mb-0">{category}</SubsectionLabel>
                <div className="flex flex-wrap gap-2">
                  {NERD_FONT_ICONS.filter((i) => i.category === category).map(
                    (item) => (
                      <button
                        key={item.codepoint}
                        onClick={() => setSelectedIcon(item)}
                        className={`w-10 h-10 flex items-center justify-center border transition-all ${
                          selectedIcon.codepoint === item.codepoint
                            ? 'border-terminal-green bg-terminal-green/20 scale-110'
                            : 'border-terminal-border hover:border-terminal-dim'
                        }`}
                        title={item.name}
                      >
                        {renderIcon(item.icon as IconName, item.color)}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected icon details */}
          <div className="bg-terminal-bg border border-terminal-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-terminal-highlight border border-terminal-border">
                {renderIcon(selectedIcon.icon as IconName, selectedIcon.color)}
              </div>
              <div className="text-terminal-fg font-bold">
                {selectedIcon.name}
              </div>
              <div className="text-terminal-cyan font-mono text-sm">
                {selectedIcon.codepoint}
              </div>
            </div>

            <div className="font-mono text-xs text-terminal-dim space-y-1">
              <div>
                <span className="text-terminal-muted">Shell: </span>
                <span className="text-terminal-green">
                  echo -e "\u
                  {selectedIcon.codepoint.replace('U+', '').toLowerCase()}"
                </span>
              </div>
              <div>
                <span className="text-terminal-muted">Code: </span>
                <span className="text-terminal-magenta">printf</span>
                <span className="text-terminal-yellow">(</span>
                <span className="text-terminal-green">
                  "\\u{selectedIcon.codepoint.replace('U+', '').toLowerCase()}"
                </span>
                <span className="text-terminal-yellow">)</span>
              </div>
              <div>
                <span className="text-terminal-muted">Decimal: </span>
                <span className="text-terminal-cyan">
                  {parseInt(selectedIcon.codepoint.replace('U+', ''), 16)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="border bg-terminal-highlight border-terminal-border p-6 space-y-4">
        <h3 className="text-terminal-red text-sm font-bold">
          Under the Hood: Why One Cell?
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <FeatureBox number={1} title="Single Codepoint">
            <p className="text-sm text-terminal-dim">
              Each Nerd Font icon is a single Unicode codepoint. The terminal
              sees it as one character, just like 'A' or '中'. One character =
              one cell.
            </p>
          </FeatureBox>

          <FeatureBox number={2} title="Font Glyphs">
            <p className="text-sm text-terminal-dim">
              The font file contains a glyph (vector drawing) for each
              codepoint. Nerd Fonts add thousands of icon glyphs sized to fit
              the terminal's cell dimensions.
            </p>
          </FeatureBox>

          <FeatureBox number={3} title="Cell-Sized Design">
            <p className="text-sm text-terminal-dim">
              Icon glyphs are designed to fit within a monospace cell. They're
              square or slightly rectangular to match the terminal's character
              grid perfectly.
            </p>
          </FeatureBox>
        </div>

        {/* Character width comparison */}
        <div className="bg-terminal-highlight border border-terminal-border p-4 space-y-3">
          <div className="text-terminal-fg text-sm font-bold">
            Character Width in Terminals
          </div>
          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-24 text-terminal-dim">Single-width:</div>
              <div className="flex">
                {['A', 'B', 'C'].map((char, i) => (
                  <div
                    key={i}
                    className="w-5 h-6 flex items-center justify-center border border-terminal-border bg-terminal-highlight"
                  >
                    {char}
                  </div>
                ))}
                {[NERD_GLYPHS.folder, NERD_GLYPHS.file, NERD_GLYPHS.check].map(
                  (glyph, i) => (
                    <div
                      key={`icon-${i}`}
                      className="w-5 h-6 flex items-center justify-center border border-terminal-border bg-terminal-highlight"
                    >
                      <NerdIcon
                        glyph={glyph}
                        className="text-sm text-terminal-fg"
                      />
                    </div>
                  )
                )}
              </div>
              <span className="text-terminal-dim text-xs">1 cell each</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-terminal-dim">Double-width:</div>
              <div className="flex">
                {['中', '文', '字'].map((char, i) => (
                  <div
                    key={i}
                    className="w-10 h-6 flex items-center justify-center border border-terminal-border bg-terminal-highlight"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <span className="text-terminal-dim text-xs">
                2 cells each (CJK)
              </span>
            </div>
          </div>
          <p className="text-terminal-dim text-xs">
            Nerd Font icons are single-width characters. CJK characters and some
            emoji are double-width.
          </p>
        </div>
      </div>

      {/* Common Icon Sets Reference */}
      <IconSetsReference />
    </div>
  );
}

// Powerline glyphs
const POWERLINE_GLYPHS = {
  arrowRight: '\ue0b0',
  arrowLeft: '\ue0b2',
  roundedRight: '\ue0b4',
};

function IconSetsReference() {
  const iconSets = [
    {
      name: 'Powerline',
      description: 'Status bar separators and arrows',
      range: 'U+E0A0-E0D4',
      glyphs: [
        POWERLINE_GLYPHS.arrowRight,
        POWERLINE_GLYPHS.arrowLeft,
        POWERLINE_GLYPHS.roundedRight,
      ],
      fontSize: 12,
    },
    {
      name: 'Font Awesome',
      description: 'General purpose icons',
      range: 'U+F000-F2E0',
      glyphs: [
        NERD_GLYPHS.folder,
        NERD_GLYPHS.file,
        NERD_GLYPHS.gear,
        NERD_GLYPHS.lock,
      ],
      fontSize: 14,
    },
    {
      name: 'Devicons',
      description: 'Programming language logos',
      range: 'U+E700-E7C5',
      glyphs: [
        NERD_GLYPHS.typescript,
        NERD_GLYPHS.javascript,
        NERD_GLYPHS.react,
        NERD_GLYPHS.python,
        NERD_GLYPHS.rust,
      ],
      fontSize: 16,
    },
    {
      name: 'Octicons',
      description: 'GitHub-style icons',
      range: 'U+F400-F532',
      glyphs: [NERD_GLYPHS.github, NERD_GLYPHS.git, NERD_GLYPHS.terminal],
      fontSize: 14,
    },
  ];

  return (
    <div className="border bg-terminal-highlight border-terminal-border p-6 space-y-4">
      <h3 className="text-terminal-red text-sm font-bold">
        Icon Sets in Nerd Fonts
      </h3>
      <p className="text-terminal-dim text-sm">
        Nerd Fonts combines multiple icon sets into one font. Each set occupies
        a different Unicode range.
      </p>

      <div className="divide-y divide-terminal-border">
        {iconSets.map((set) => (
          <div
            key={set.name}
            className="flex flex-col md:flex-row md:items-center gap-3 py-3"
          >
            <div className="md:w-32">
              <div className="text-terminal-fg font-bold text-sm">
                {set.name}
              </div>
              <div className="text-terminal-cyan font-mono text-xs">
                {set.range}
              </div>
            </div>
            <div className="text-terminal-dim text-xs flex-1">
              {set.description}
            </div>
            <div className="flex gap-2">
              {set.glyphs.map((glyph, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center overflow-hidden"
                  style={{ width: 20, height: 20 }}
                >
                  <span
                    className="text-terminal-fg"
                    style={{
                      fontFamily: "'JetBrainsMono Nerd Font', monospace",
                      fontSize: set.fontSize,
                      lineHeight: 1,
                    }}
                  >
                    {glyph}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
