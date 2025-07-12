import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Step {
  title: string;
  description?: string;
  icon?: ReactNode;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Steps = ({ steps, currentStep, className }: StepsProps) => {
  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <li key={index} className="flex-1">
                <div className="flex items-center">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium',
                        isCompleted && 'bg-orange-600 border-orange-600 text-white',
                        isCurrent && 'border-orange-600 text-orange-600 bg-white',
                        isUpcoming && 'border-gray-300 text-gray-500 bg-white'
                      )}
                    >
                      {isCompleted ? (
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : step.icon ? (
                        step.icon
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    {/* Step text */}
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          'text-sm font-medium',
                          isCompleted && 'text-orange-600',
                          isCurrent && 'text-orange-600',
                          isUpcoming && 'text-gray-500'
                        )}
                      >
                        {step.title}
                      </div>
                      {step.description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-4 mt-5',
                        index < currentStep ? 'bg-orange-600' : 'bg-gray-300'
                      )}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export { Steps };
export type { StepsProps, Step };