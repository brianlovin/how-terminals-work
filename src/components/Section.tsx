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
    <section id={id} className="py-24">
      <div className="max-w-3xl w-full mx-auto">
        <div className="mb-8">
          <span className="text-terminal-dim text-lg">
            {String(number).padStart(2, '0')}
          </span>
          <h2 className="font-bold text-xl text-terminal-green mt-2 mb-2">
            {title}
          </h2>
          <p className="text-terminal-fg leading-relaxed text-lg">{insight}</p>
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
