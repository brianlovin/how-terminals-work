import './index.css';
import { Section } from './components/Section';
import { GridDemo } from './components/GridDemo';
import { CellZoom } from './components/CellZoom';
import { EscapeDemo } from './components/EscapeDemo';
import { KeyboardDemo } from './components/KeyboardDemo';
import { MouseDemo } from './components/MouseDemo';
import { SignalsDemo } from './components/SignalsDemo';
import { InputModesDemo } from './components/InputModesDemo';
import { FlowDiagram } from './components/FlowDiagram';
import { AdvancedTUIDemo } from './components/AdvancedTUIDemo';
import { AlternateScreenDemo } from './components/AlternateScreenDemo';
import { IconsDemo } from './components/IconsDemo';
import { StateManagementDemo } from './components/StateManagementDemo';
import { TextSelectionDemo } from './components/TextSelectionDemo';
import { VocabularyDemo } from './components/VocabularyDemo';
import { CapabilityDiscoveryDemo } from './components/CapabilityDiscoveryDemo';

export function App() {
  return (
    <div className="min-h-screen px-5 md:px-8">
      <Section
        id="header"
        number={0}
        title="How Terminals Work"
        insight="An interactive guide to understanding terminals"
      />

      <Section
        id="grid"
        number={1}
        title="The Grid Model"
        insight="A terminal is just a grid of same-sized cells—like a screen with huge pixels that can display the alphabet."
      >
        <GridDemo />
      </Section>

      <Section
        id="cell"
        number={2}
        title="What's in a Cell?"
        insight="Each cell holds one character plus styling info (color, bold, underline). That's it."
      >
        <CellZoom />
      </Section>

      <Section
        id="escape"
        number={3}
        title="Escape Sequences"
        insight={`Special character sequences control the terminal—move cursor, change colors, clear screen. That's why you sometimes see weird characters like "^[[31m".`}
      >
        <EscapeDemo />
      </Section>

      <Section
        id="input"
        number={4}
        title="Input Goes Both Ways"
        insight="When you press a key, the terminal sends bytes to the program. Arrow keys and mouse clicks become escape sequences too."
      >
        <div className="space-y-12">
          <KeyboardDemo />
          <MouseDemo />
        </div>
      </Section>

      <Section
        id="signals"
        number={5}
        title="Signals"
        insight="Ctrl+C doesn't type a character—it triggers a signal. Your terminal sends a byte (0x03), but the kernel's line discipline intercepts it and generates SIGINT before the program ever sees it."
      >
        <SignalsDemo />
      </Section>

      <Section
        id="input-modes"
        number={6}
        title="Raw vs Cooked Mode"
        insight="In cooked mode, you type a full line and press Enter. In raw mode, every keystroke goes straight to the program. That's why vim responds instantly while your shell waits for Enter."
      >
        <InputModesDemo />
      </Section>

      <Section
        id="flow"
        number={7}
        title="The Round Trip"
        insight="Every keystroke travels down through the terminal stack to the program, then output flows back up to render on screen."
      >
        <FlowDiagram />
      </Section>

      <Section
        id="advanced-tui"
        number={8}
        title="Building Complex TUIs"
        insight="Advanced terminal apps like htop or vim divide the screen into regions—each with its own focus, content, and resize behavior. It's like building a GUI, but with characters instead of pixels."
      >
        <AdvancedTUIDemo />
      </Section>

      <Section
        id="alternate-screen"
        number={9}
        title="The Alternate Screen Buffer"
        insight="When you open vim, your terminal history disappears. When you quit, it reappears. That's because terminals have two screens—the normal one (with your scrollback) and an alternate one apps use as a canvas."
      >
        <AlternateScreenDemo />
      </Section>

      <Section
        id="icons"
        number={10}
        title="Terminal Icons"
        insight="Those file icons in your terminal? They're just Unicode characters from special fonts called Nerd Fonts—thousands of icons mapped to the Private Use Area."
      >
        <IconsDemo />
      </Section>

      <Section
        id="state"
        number={11}
        title="State Management"
        insight="When you press Shift+Tab to cycle modes in Claude Code, the terminal doesn't remember anything—your app tracks state in memory and redraws the UI whenever it changes."
      >
        <StateManagementDemo />
      </Section>

      <Section
        id="selection"
        number={12}
        title="Text Selection & Cursor Positioning"
        insight="You can't click to move your cursor because the terminal handles text selection separately from the app's cursor. Option+Click works by simulating arrow keypresses—it's a hack, not native behavior."
      >
        <TextSelectionDemo />
      </Section>

      <Section
        id="capability-discovery"
        number={13}
        title="Capability Discovery"
        insight="Before a program can use mouse tracking or 256 colors, it has to ask: what can this terminal do? The TERM variable and escape sequence queries let programs discover—and enable—terminal features."
      >
        <CapabilityDiscoveryDemo />
      </Section>

      <Section
        id="vocabulary"
        number={14}
        title="Terminal Vocabulary"
        insight="Terminal, shell, console, CLI—these words get thrown around interchangeably, but they mean different things. Understanding the distinction helps you know which tool to configure when something isn't working."
      >
        <VocabularyDemo />
      </Section>
    </div>
  );
}

export default App;
