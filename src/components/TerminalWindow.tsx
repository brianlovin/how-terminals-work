interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalWindow({ title = "terminal", children, className = "" }: TerminalWindowProps) {
  return (
    <div className={`rounded-lg border border-terminal-border bg-terminal-highlight overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-terminal-bg border-b border-terminal-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-terminal-red" />
          <div className="w-3 h-3 rounded-full bg-terminal-amber" />
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
        </div>
        <span className="text-terminal-dim text-sm ml-2">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
