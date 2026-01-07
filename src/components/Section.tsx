interface SectionProps {
  id: string;
  number: number;
  title: string;
  insight: string;
  children: React.ReactNode;
}

export function Section({ id, number, title, insight, children }: SectionProps) {
  return (
    <section id={id} className="py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="text-terminal-dim">
            {String(number).padStart(2, "0")}
          </span>
          <h2 className="font-bold text-terminal-green mt-2 mb-2">
            {title}
          </h2>
          <p className="ttext-terminal-fg leading-relaxed max-w-2xl">
            {insight}
          </p>
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
