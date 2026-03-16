import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex flex-1 items-start">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick?.(index)}
                  disabled={isUpcoming}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    isCompleted && "bg-green-500 text-white hover:bg-green-600",
                    isCurrent && "bg-blue-600 text-white ring-4 ring-blue-100",
                    isUpcoming && "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </button>
                <div className="mt-2 text-center hidden sm:block">
                  <p className={cn(
                    "text-sm font-medium",
                    isCompleted && "text-green-600",
                    isCurrent && "text-blue-600",
                    isUpcoming && "text-slate-400"
                  )}>
                    {step.title}
                  </p>
                  <p className={cn(
                    "text-xs mt-0.5 max-w-[120px]",
                    isCompleted && "text-green-500",
                    isCurrent && "text-slate-600",
                    isUpcoming && "text-slate-400"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center pt-5 px-2">
                  <div className={cn(
                    "h-1 w-full rounded-full transition-all",
                    isCompleted ? "bg-green-500" : "bg-slate-200"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step title */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-lg font-semibold text-blue-600">
          {steps[currentStep]?.title}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {steps[currentStep]?.description}
        </p>
      </div>
    </div>
  );
}
