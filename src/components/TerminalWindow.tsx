interface TerminalWindowProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function TerminalWindow({
  children,
  className = '',
  noPadding = false,
}: TerminalWindowProps) {
  return (
    <div
      className={`border relative border-terminal-border bg-terminal-surface overflow-hidden ${className}`}
    >
      <div className="flex items-center px-3 py-2 border-b border-terminal-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-dim/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-dim/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-dim/40" />
        </div>
      </div>
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
