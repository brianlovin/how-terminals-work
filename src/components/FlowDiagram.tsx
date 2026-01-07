import { useState, useEffect } from "react";
import { TerminalWindow } from "./TerminalWindow";

type Step = "idle" | "user" | "terminal" | "pty" | "program" | "program-process" | "pty-back" | "terminal-back" | "display";

const STEPS: { step: Step; label: string; desc: string }[] = [
  { step: "idle", label: "Ready", desc: "Waiting for input..." },
  { step: "user", label: "You", desc: "You press a key" },
  { step: "terminal", label: "Terminal", desc: "Terminal converts key to bytes" },
  { step: "pty", label: "PTY", desc: "Pseudo-terminal forwards to program" },
  { step: "program", label: "Program", desc: "Program receives input" },
  { step: "program-process", label: "Program", desc: "Program decides what to do" },
  { step: "pty-back", label: "PTY", desc: "Program sends output through PTY" },
  { step: "terminal-back", label: "Terminal", desc: "Terminal interprets escape sequences" },
  { step: "display", label: "Display", desc: "Screen updates with new content" },
];

export function FlowDiagram() {
  const [currentStep, setCurrentStep] = useState<Step>("idle");
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const startAnimation = () => { if (!isAnimating) { setIsAnimating(true); setStepIndex(1); } };

  useEffect(() => {
    if (!isAnimating) return;
    if (stepIndex >= STEPS.length) { setIsAnimating(false); setStepIndex(0); setCurrentStep("idle"); return; }
    setCurrentStep(STEPS[stepIndex]!.step);
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 800);
    return () => clearTimeout(timer);
  }, [isAnimating, stepIndex]);

  const currentInfo = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  const isActive = (box: string) => {
    const map: Record<string, Step[]> = {
      you: ["user"], terminal: ["terminal", "terminal-back"], pty: ["pty", "pty-back"],
      program: ["program", "program-process"], display: ["display"],
    };
    return map[box]?.includes(currentStep);
  };

  const boxClass = (box: string) => `px-4 py-3 rounded-lg border-2 text-center transition-all duration-300 ${isActive(box) ? "border-terminal-green bg-terminal-green/20 scale-105" : "border-terminal-border"}`;

  return (
    <div className="space-y-8">
      <TerminalWindow title="data-flow">
        <div className="p-4 space-y-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className={boxClass("you")}><div className="text-2xl mb-1">👤</div><div className="text-sm">You</div></div>
            <div className="text-2xl text-terminal-dim">→</div>
            <div className={boxClass("terminal")}><div className="text-2xl mb-1">🖥️</div><div className="text-sm">Terminal</div></div>
            <div className="text-2xl text-terminal-dim">→</div>
            <div className={boxClass("pty")}><div className="text-2xl mb-1">🔌</div><div className="text-sm">PTY</div></div>
            <div className="text-2xl text-terminal-dim">→</div>
            <div className={boxClass("program")}><div className="text-2xl mb-1">⚙️</div><div className="text-sm">Program</div></div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className={boxClass("display")}><div className="text-2xl mb-1">📺</div><div className="text-sm">Display</div></div>
            <div className="text-2xl text-terminal-dim">←</div>
            <div className="px-4 py-3 text-center text-terminal-dim text-sm">interprets</div>
            <div className="text-2xl text-terminal-dim">←</div>
            <div className="px-4 py-3 text-center text-terminal-dim text-sm">sends output</div>
            <div className="text-2xl text-terminal-dim">←</div>
            <div className="px-4 py-3 text-center text-terminal-dim text-sm">responds</div>
          </div>

          <div className="text-center py-4">
            <div className="text-terminal-green text-lg font-bold">{currentInfo?.label}</div>
            <div className="text-terminal-dim">{currentInfo?.desc}</div>
          </div>

          <div className="flex justify-center">
            <button onClick={startAnimation} disabled={isAnimating}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${isAnimating ? "bg-terminal-dim text-terminal-bg cursor-not-allowed" : "bg-terminal-green text-terminal-bg hover:opacity-90"}`}>
              {isAnimating ? "Animating..." : "Watch the flow"}
            </button>
          </div>
        </div>
      </TerminalWindow>

      <div className="bg-terminal-highlight border border-terminal-border rounded-lg p-6">
        <h4 className="text-terminal-green font-bold mb-3">How Claude Code draws its UI</h4>
        <p className="text-terminal-dim">When Claude Code needs to update the screen, it doesn't move things around pixel by pixel. It sends escape sequences to:</p>
        <ol className="list-decimal list-inside mt-3 space-y-2 text-terminal-fg">
          <li>Clear the screen or parts of it</li>
          <li>Move the cursor to specific positions</li>
          <li>Print text with colors and styles</li>
          <li>Repeat for every "frame" of the UI</li>
        </ol>
        <p className="text-terminal-dim mt-3">It's like a video game, but the "pixels" are characters in a grid.</p>
      </div>
    </div>
  );
}
