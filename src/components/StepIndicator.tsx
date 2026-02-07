import React from 'react';
import { Check } from 'lucide-react';
import { useCertificateStore } from '@/hooks/useCertificateStore';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { number: 1, title: 'Upload Template', description: 'Upload certificate background' },
  { number: 2, title: 'Position Elements', description: 'Drag to set text positions' },
  { number: 3, title: 'Upload Data', description: 'Add participant names' },
  { number: 4, title: 'Generate', description: 'Preview and download' },
];

export const StepIndicator: React.FC = () => {
  const { currentStep, setCurrentStep, template, participants } = useCertificateStore();

  const canNavigateToStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return true;
      case 2:
        return !!template;
      case 3:
        return !!template;
      case 4:
        return !!template && participants.length > 0;
      default:
        return false;
    }
  };

  const getStepStatus = (stepNumber: number): 'active' | 'completed' | 'pending' => {
    if (stepNumber === currentStep) return 'active';
    if (stepNumber < currentStep) return 'completed';
    return 'pending';
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const canNavigate = canNavigateToStep(step.number);

          return (
            <React.Fragment key={step.number}>
              <button
                onClick={() => canNavigate && setCurrentStep(step.number)}
                disabled={!canNavigate}
                className={`flex flex-col items-center group ${
                  canNavigate ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className={`step-indicator ${status}`}>
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      status === 'active'
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 ${
                    step.number < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
