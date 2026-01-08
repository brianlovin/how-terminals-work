interface InfoPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoPanel({ children, className = '' }: InfoPanelProps) {
  return (
    <div
      className={`bg-terminal-highlight border border-terminal-border px-4 py-3 text-sm ${className}`}
    >
      {children}
    </div>
  );
}
