interface SubsectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SubsectionLabel({
  children,
  className = '',
}: SubsectionLabelProps) {
  return (
    <div
      className={`text-terminal-dim text-xs uppercase mb-2 ${className}`}
    >
      {children}
    </div>
  );
}
