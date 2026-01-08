interface FeatureBoxProps {
  children: React.ReactNode;
  className?: string;
  number?: number | string;
  title?: string;
}

export function FeatureBox({
  children,
  className = '',
  number,
  title,
}: FeatureBoxProps) {
  return (
    <div className={`bg-terminal-highlight p-4 space-y-2 ${className}`}>
      {(number !== undefined || title) && (
        <div className="flex text-sm items-center gap-2 text-terminal-fg font-bold">
          {number !== undefined && <span>{number}</span>}
          {title && <span>{title}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
