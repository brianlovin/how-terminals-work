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

      <Section id="flow" number={5} title="The Round Trip"
        insight="Every keystroke travels down through the terminal stack to the program, then output flows back up to render on screen.">
        <FlowDiagram />
      </Section>
    </div>
  );
}

export default App;
