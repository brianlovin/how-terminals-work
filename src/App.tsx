import "./index.css";
import { Section } from "./components/Section";
import { GridDemo } from "./components/GridDemo";
import { CellZoom } from "./components/CellZoom";
import { EscapeDemo } from "./components/EscapeDemo";
import { KeyboardDemo } from "./components/KeyboardDemo";
import { MouseDemo } from "./components/MouseDemo";
import { FlowDiagram } from "./components/FlowDiagram";

export function App() {
  return (
    <div className="min-h-screen px-4 lg:px-8">
      {/* Hero */}
      <header className="py-12 flex flex-col max-w-2xl mx-auto">
        <h1 className="font-bold mb-6">
          <span className="text-terminal-green">How Terminals Work</span>
        </h1>
        <p className="text-terminal-dim max-w-2xl mb-8">
          An interactive guide to understanding terminal UIs.
          <br />
          No code required.
        </p>
      </header>

      <Section id="grid" number={1} title="The Grid Model"
        insight="A terminal is just a grid of same-sized cells—like a screen with huge pixels that can display the alphabet.">
        <GridDemo />
      </Section>

      <Section id="cell" number={2} title="What's in a Cell?"
        insight="Each cell holds one character plus styling info (color, bold, underline). That's it.">
        <CellZoom />
      </Section>

      <Section id="escape" number={3} title="Escape Sequences"
        insight={`Special character sequences control the terminal—move cursor, change colors, clear screen. That's why you sometimes see weird characters like "^[[31m".`}>
        <EscapeDemo />
      </Section>

      <Section id="input" number={4} title="Input Goes Both Ways"
        insight="When you press a key, the terminal sends bytes to the program. Arrow keys and mouse clicks become escape sequences too.">
        <div className="space-y-12">
          <KeyboardDemo />
          <MouseDemo />
        </div>
      </Section>

      <Section id="flow" number={5} title="How Programs Work"
        insight="The program decides what to do with input. It can ignore arrow keys, or use them to navigate a UI like Claude Code.">
        <FlowDiagram />
      </Section>

      <Section id="history" number={6} title="A 1970s Standard"
        insight="The VT100 terminal from 1978 defined conventions we still use today. Your terminal is basically emulating a 50-year-old machine.">
        <div className="flex flex-col items-center gap-8">
          <div className="bg-terminal-highlight border border-terminal-border rounded-lg p-8 max-w-lg">
            <div className="text-center mb-6"><span className="text-6xl">🖥️</span></div>
            <div className="space-y-4 text-terminal-dim">
              <div className="flex items-center gap-4"><span className="text-terminal-green font-bold">1978</span><span>DEC VT100 released</span></div>
              <div className="flex items-center gap-4"><span className="text-terminal-amber font-bold">1984</span><span>xterm created for X Window</span></div>
              <div className="flex items-center gap-4"><span className="text-terminal-blue font-bold">2024</span><span>Your terminal still speaks VT100</span></div>
            </div>
          </div>
          <p className="text-terminal-dim text-center max-w-md">
            Run <code className="bg-terminal-bg px-2 py-1 rounded text-terminal-green">echo $TERM</code> in your terminal.
            It probably says something like <code className="text-terminal-amber">xterm-256color</code>.
          </p>
        </div>
      </Section>
    </div>
  );
}

export default App;
