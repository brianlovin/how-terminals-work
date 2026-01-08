import "./index.css";
import { Section } from "./components/Section";
import { GridDemo } from "./components/GridDemo";
import { CellZoom } from "./components/CellZoom";
import { EscapeDemo } from "./components/EscapeDemo";
import { KeyboardDemo } from "./components/KeyboardDemo";
import { MouseDemo } from "./components/MouseDemo";
import { FlowDiagram } from "./components/FlowDiagram";
import { AdvancedTUIDemo } from "./components/AdvancedTUIDemo";
import { IconsDemo } from "./components/IconsDemo";
import { StateManagementDemo } from "./components/StateManagementDemo";
import { TextSelectionDemo } from "./components/TextSelectionDemo";

export function App() {
  return (
    <div className="min-h-screen px-4 lg:px-8">
      {/* Hero */}
      <header className="pt-12 flex flex-col max-w-3xl mx-auto">
        <h1 className="font-bold text-xl mb-2">
          <span className="text-terminal-blue">How Terminals Work</span>
        </h1>
        <p className="text-terminal-fg max-w-3xl mb-8">
          An interactive guide to understanding terminal UIs.
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

      <Section id="advanced-tui" number={6} title="Building Complex TUIs"
        insight="Advanced terminal apps like htop or vim divide the screen into regions—each with its own focus, content, and resize behavior. It's like building a GUI, but with characters instead of pixels.">
        <AdvancedTUIDemo />
      </Section>

      <Section id="icons" number={7} title="Terminal Icons"
        insight="Those file icons in your terminal? They're just Unicode characters from special fonts called Nerd Fonts—thousands of icons mapped to the Private Use Area.">
        <IconsDemo />
      </Section>

      <Section id="state" number={8} title="State Management"
        insight="When you press Shift+Tab to cycle modes in Claude Code, the terminal doesn't remember anything—your app tracks state in memory and redraws the UI whenever it changes.">
        <StateManagementDemo />
      </Section>

      <Section id="selection" number={9} title="Text Selection & Cursor Positioning"
        insight="You can't click to move your cursor because the terminal handles text selection separately from the app's cursor. Option+Click works by simulating arrow keypresses—it's a hack, not native behavior.">
        <TextSelectionDemo />
      </Section>
    </div>
  );
}

export default App;
