interface SectionProps {
  id: string;
  number: number;
  title: string;
  insight: string;
  children: React.ReactNode;
}

export function Section({
  id,
  number,
  title,
  insight,
  children,
}: SectionProps) {
  return (
    <section id={id} className="py-16 border-b border-terminal-border last:border-b-0">
      <div className="max-w-2xl w-full mx-auto">
        <header className="mb-8">
          <div className="text-terminal-dim tabular-nums mb-1">
            {String(number).padStart(2, '0')}
          </div>
          <h2 className="text-terminal-green font-medium tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-terminal-muted leading-relaxed text-pretty">
            {insight}
          </p>
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}
