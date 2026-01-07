import { useState } from "react";
import { TerminalWindow } from "./TerminalWindow";

const SEQUENCES = [
  { display: "^[[31m", desc: "Set text color to red", effect: "red" },
  { display: "^[[32m", desc: "Set text color to green", effect: "green" },
  { display: "^[[1m", desc: "Set text to bold", effect: "bold" },
  { display: "^[[4m", desc: "Set text to underline", effect: "underline" },
  { display: "^[[0m", desc: "Reset all styles", effect: "reset" },
  { display: "^[[2J", desc: "Clear entire screen", effect: "clear" },
  { display: "^[[H", desc: "Move cursor to home (0,0)", effect: "home" },
  { display: "^[[5;10H", desc: "Move cursor to row 5, col 10", effect: "move" },
];

export function EscapeDemo() {
  const [demoText, setDemoText] = useState("Hello World");
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());

  const toggleEffect = (effect: string) => {
    setActiveEffects((prev) => {
      const next = new Set(prev);
      if (effect === "reset") return new Set();
      next.has(effect) ? next.delete(effect) : next.add(effect);
      return next;
    });
  };

  const getTextStyle = (): React.CSSProperties => ({
    color: activeEffects.has("red") ? "#f85149" : activeEffects.has("green") ? "#3fb950" : undefined,
    fontWeight: activeEffects.has("bold") ? "bold" : undefined,
    textDecoration: activeEffects.has("underline") ? "underline" : undefined,
  });

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-terminal-dim text-sm mb-4">Common Escape Sequences</h3>
          <div className="space-y-2">
            {SEQUENCES.map((seq) => (
              <button key={seq.effect} onClick={() => toggleEffect(seq.effect)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all
                  ${activeEffects.has(seq.effect) ? "border-terminal-green bg-terminal-green/10" : "border-terminal-border hover:border-terminal-dim"}`}
              >
                <div className="flex items-center justify-between">
                  <code className="text-terminal-amber font-bold">{seq.display}</code>
                  <span className="text-terminal-dim text-sm">{seq.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-terminal-dim text-sm mb-4">Live Preview</h3>
          <TerminalWindow title="preview">
            <div className="min-h-[200px] flex flex-col">
              <div className="text-xs text-terminal-dim mb-4">
                {activeEffects.size === 0 ? "No escape sequences active" : `Active: ${[...activeEffects].map(e => SEQUENCES.find(s => s.effect === e)?.display).join(" ")}`}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-2xl" style={getTextStyle()}>{demoText}</span>
              </div>
              <input type="text" value={demoText} onChange={(e) => setDemoText(e.target.value)} placeholder="Type something..."
                className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green mt-4" />
            </div>
          </TerminalWindow>
        </div>
      </div>

      <div className="text-terminal-dim text-sm">
        <span className="text-terminal-green">^[</span> represents the <span className="text-terminal-amber">ESC</span> character (byte 0x1B). Programs send these sequences to control how text appears.
      </div>
    </div>
  );
}
