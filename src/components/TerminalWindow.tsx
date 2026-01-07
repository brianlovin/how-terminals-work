interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalWindow({ title = "terminal", children, className = "" }: TerminalWindowProps) {
  return (
    <div className={`rounded-lg border border-terminal-border bg-terminal-highlight overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-3 bg-terminal-bg border-b border-terminal-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
