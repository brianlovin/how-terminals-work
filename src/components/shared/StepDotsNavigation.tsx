import { Button } from './Button';

interface StepDotsNavigationProps<T extends string> {
  steps: T[];
  currentStep: T;
  onStepChange: (step: T) => void;
  showBorder?: boolean;
}

export function StepDotsNavigation<T extends string>({
  steps,
  currentStep,
  onStepChange,
  showBorder = true,
}: StepDotsNavigationProps<T>) {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div
      className={`flex items-center justify-between ${showBorder ? 'pt-4 border-t border-terminal-border' : ''}`}
    >
      <Button
        size="sm"
        onClick={() => onStepChange(steps[Math.max(0, currentStepIndex - 1)]!)}
        disabled={currentStepIndex === 0}
      >
        Previous
      </Button>
      <div className="flex items-center gap-2">
        {steps.map((step) => (
          <button
            key={step}
            onClick={() => onStepChange(step)}
            className={`w-2 h-2 rounded-full transition-all ${
              step === currentStep
                ? 'bg-terminal-fg scale-125'
                : 'bg-terminal-dim hover:bg-terminal-muted'
            }`}
          />
        ))}
      </div>
      <Button
        size="sm"
        onClick={() =>
          onStepChange(steps[Math.min(steps.length - 1, currentStepIndex + 1)]!)
        }
        disabled={currentStepIndex === steps.length - 1}
      >
        Next
      </Button>
    </div>
  );
}
