interface SectionProps {
  id: string;
  number: number;
  title: string;
  insight: string;
  children?: React.ReactNode;
}

export function Section({
  id,
  number,
  title,
  insight,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className="py-24 max-w-2xl mx-auto border-b border-terminal-border last:border-b-0"
    >
      <header>
        <div className="text-terminal-dim tabular-nums mb-1">
          {String(number).padStart(2, '0')}
        </div>
        <h2 className="text-terminal-green font-medium mb-3">{title}</h2>
        <p className="text-terminal-muted leading-relaxed text-pretty">
          {insight}
        </p>
      </header>
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}
