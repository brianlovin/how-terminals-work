import { useState } from "react";
import { TerminalWindow } from "./TerminalWindow";

// Standard 16-color ANSI escape codes (SGR - Select Graphic Rendition)
const COLOR_SEQUENCES = [
  // Normal colors (30-37)
  { display: "^[[30m", desc: "Black", effect: "black", color: "#0d1117" },
  { display: "^[[31m", desc: "Red", effect: "red", color: "#f85149" },
  { display: "^[[32m", desc: "Green", effect: "green", color: "#3fb950" },
  { display: "^[[33m", desc: "Yellow", effect: "yellow", color: "#d29922" },
  { display: "^[[34m", desc: "Blue", effect: "blue", color: "#58a6ff" },
  { display: "^[[35m", desc: "Magenta", effect: "magenta", color: "#bc8cff" },
  { display: "^[[36m", desc: "Cyan", effect: "cyan", color: "#39c5cf" },
  { display: "^[[37m", desc: "White", effect: "white", color: "#c9d1d9" },
  // Bright colors (90-97)
  { display: "^[[90m", desc: "Bright Black", effect: "brightBlack", color: "#484f58" },
  { display: "^[[91m", desc: "Bright Red", effect: "brightRed", color: "#ff7b72" },
  { display: "^[[92m", desc: "Bright Green", effect: "brightGreen", color: "#56d364" },
  { display: "^[[93m", desc: "Bright Yellow", effect: "brightYellow", color: "#e3b341" },
  { display: "^[[94m", desc: "Bright Blue", effect: "brightBlue", color: "#79c0ff" },
  { display: "^[[95m", desc: "Bright Magenta", effect: "brightMagenta", color: "#d2a8ff" },
  { display: "^[[96m", desc: "Bright Cyan", effect: "brightCyan", color: "#56d4dd" },
  { display: "^[[97m", desc: "Bright White", effect: "brightWhite", color: "#f0f6fc" },
];

const STYLE_SEQUENCES = [
  { display: "^[[1m", desc: "Bold", effect: "bold" },
  { display: "^[[4m", desc: "Underline", effect: "underline" },
  { display: "^[[0m", desc: "Reset all styles", effect: "reset" },
];

const CURSOR_SEQUENCES = [
  { display: "^[[2J", desc: "Clear entire screen", effect: "clear" },
  { display: "^[[H", desc: "Move cursor to home (0,0)", effect: "home" },
  { display: "^[[5;10H", desc: "Move cursor to row 5, col 10", effect: "move" },
];

export function EscapeDemo() {
  const [demoText, setDemoText] = useState("Hello World");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());

  const handleColorClick = (effect: string) => {
    setActiveColor(activeColor === effect ? null : effect);
  };

  const toggleEffect = (effect: string) => {
    setActiveEffects((prev) => {
      const next = new Set(prev);
      if (effect === "reset") {
        setActiveColor(null);
        return new Set();
      }
      next.has(effect) ? next.delete(effect) : next.add(effect);
      return next;
    });
  };

  const getActiveColorObj = () => COLOR_SEQUENCES.find(c => c.effect === activeColor);

  const getTextStyle = (): React.CSSProperties => ({
    color: getActiveColorObj()?.color,
    fontWeight: activeEffects.has("bold") ? "bold" : undefined,
    textDecoration: activeEffects.has("underline") ? "underline" : undefined,
  });

  const getActiveSequences = () => {
    const seqs: string[] = [];
    if (activeColor) {
      const colorSeq = COLOR_SEQUENCES.find(c => c.effect === activeColor);
      if (colorSeq) seqs.push(colorSeq.display);
    }
    activeEffects.forEach(e => {
      const styleSeq = STYLE_SEQUENCES.find(s => s.effect === e);
      if (styleSeq) seqs.push(styleSeq.display);
    });
    return seqs;
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* 16-Color Palette */}
          <div>
            <h3 className="text-terminal-dim text-sm mb-3">16-Color ANSI Palette</h3>
            <div className="grid grid-cols-8 gap-1">
              {COLOR_SEQUENCES.slice(0, 8).map((seq) => (
                <button
                  key={seq.effect}
                  onClick={() => handleColorClick(seq.effect)}
                  className={`h-8 rounded border-2 transition-transform ${
                    activeColor === seq.effect ? "scale-110 border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: seq.color }}
                  title={`${seq.desc} (${seq.display})`}
                />
              ))}
            </div>
            <div className="grid grid-cols-8 gap-1 mt-1">
              {COLOR_SEQUENCES.slice(8).map((seq) => (
                <button
                  key={seq.effect}
                  onClick={() => handleColorClick(seq.effect)}
                  className={`h-8 rounded border-2 transition-transform ${
                    activeColor === seq.effect ? "scale-110 border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: seq.color }}
                  title={`${seq.desc} (${seq.display})`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-terminal-dim mt-1 px-1">
              <span>Normal (30-37)</span>
              <span>Bright (90-97)</span>
            </div>
          </div>

          {/* Style Sequences */}
          <div>
            <h3 className="text-terminal-dim text-sm mb-3">Style Sequences</h3>
            <div className="flex flex-wrap gap-2">
              {STYLE_SEQUENCES.map((seq) => (
                <button
                  key={seq.effect}
                  onClick={() => toggleEffect(seq.effect)}
                  className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                    activeEffects.has(seq.effect)
                      ? "border-terminal-green bg-terminal-green/10"
                      : "border-terminal-border hover:border-terminal-dim"
                  }`}
                >
                  <code className="text-terminal-yellow font-bold text-xs">{seq.display}</code>
                  <span className="text-terminal-dim ml-2">{seq.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Sequences */}
          <div>
            <h3 className="text-terminal-dim text-sm mb-3">Cursor Sequences</h3>
            <div className="space-y-1">
              {CURSOR_SEQUENCES.map((seq) => (
                <div key={seq.effect} className="flex items-center justify-between px-3 py-2 rounded border border-terminal-border">
                  <code className="text-terminal-yellow font-bold text-xs">{seq.display}</code>
                  <span className="text-terminal-dim text-sm">{seq.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-terminal-dim text-sm mb-4">Live Preview</h3>
          <TerminalWindow title="preview">
            <div className="min-h-[200px] flex flex-col">
              <div className="text-xs text-terminal-dim mb-4">
                {getActiveSequences().length === 0
                  ? "No escape sequences active"
                  : `Active: ${getActiveSequences().join(" ")}`}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-2xl" style={getTextStyle()}>{demoText}</span>
              </div>
              <input
                type="text"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                placeholder="Type something..."
                className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green mt-4"
              />
            </div>
          </TerminalWindow>

          {/* Color info panel */}
          {activeColor && (
            <div className="mt-4 bg-terminal-highlight rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: getActiveColorObj()?.color }}
                />
                <div>
                  <div className="text-terminal-fg font-bold">{getActiveColorObj()?.desc}</div>
                  <code className="text-terminal-yellow text-sm">{getActiveColorObj()?.display}</code>
                </div>
              </div>
              <div className="text-terminal-dim text-xs">
                ANSI code {getActiveColorObj()?.display.replace("^[[", "").replace("m", "")} sets the foreground color.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-terminal-dim text-sm">
        <span className="text-terminal-yellow">^[</span> represents the <span className="text-terminal-yellow">ESC</span> character (byte 0x1B). The 16-color palette uses codes 30-37 for normal colors and 90-97 for bright variants.
      </div>
    </div>
  );
}
