interface TerminalWindowProps {
  children: React.ReactNode;
  className?: string;
}

export function TerminalWindow({
  children,
  className = '',
}: TerminalWindowProps) {
  return (
    <div
      className={`border relative border-terminal-border bg-terminal-surface overflow-hidden ${className}`}
    >
      <div className="flex items-center px-3 py-2 bg-terminal-highlight border-b border-terminal-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-dim/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-dim/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-dim/40" />
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
