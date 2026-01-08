interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'toggle';
  size?: 'sm' | 'md';
  active?: boolean;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  active = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';

  const variantClasses = {
    primary:
      'bg-terminal-fg text-terminal-bg font-medium hover:bg-terminal-bright-white',
    secondary:
      'border border-terminal-border text-terminal-muted hover:text-terminal-fg hover:border-terminal-dim',
    toggle: active
      ? 'border border-terminal-green bg-terminal-green/20 text-terminal-green'
      : 'border border-terminal-border text-terminal-muted hover:text-terminal-fg',
  };

  return (
    <button
      className={`transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
