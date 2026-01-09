interface StepDotsNavigationProps<T extends string> {
  steps: T[];
  currentStep: T;
  onStepChange: (step: T) => void;
  showBorder?: boolean;
}

// Chevron icons as inline SVGs
function ChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 12L6 8L10 4" />
    </svg>
  );
}

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 12L10 8L6 4" />
    </svg>
  );
}

export function StepDotsNavigation<T extends string>({
  steps,
  currentStep,
  onStepChange,
}: StepDotsNavigationProps<T>) {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onStepChange(steps[Math.max(0, currentStepIndex - 1)]!)}
        disabled={currentStepIndex === 0}
        className="p-1 text-terminal-dim hover:text-terminal-fg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>
      <span className="text-xs text-terminal-dim tabular-nums min-w-[3ch] text-center">
        {currentStepIndex + 1}/{steps.length}
      </span>
      <button
        onClick={() =>
          onStepChange(steps[Math.min(steps.length - 1, currentStepIndex + 1)]!)
        }
        disabled={currentStepIndex === steps.length - 1}
        className="p-1 text-terminal-dim hover:text-terminal-fg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
