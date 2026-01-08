interface NumberedStepNavigationProps {
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function NumberedStepNavigation({
  totalSteps,
  currentStep,
  onStepChange,
}: NumberedStepNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <button
          key={i}
          onClick={() => onStepChange(i)}
          className={`w-8 h-8 flex items-center justify-center border text-sm transition-all ${
            i === currentStep
              ? 'border-terminal-green bg-terminal-green/20 text-terminal-green'
              : i < currentStep
                ? 'border-terminal-border text-terminal-muted'
                : 'border-terminal-border text-terminal-muted hover:border-terminal-muted'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
