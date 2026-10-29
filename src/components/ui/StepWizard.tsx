import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
}

export const StepWizard: React.FC<StepWizardProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li key={step.name} className="relative flex-1 flex items-center">
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#00D4B2] text-[#0A2540] ring-4 ring-[#00D4B2]/20 font-bold'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </span>
                <span
                  className={`text-xs font-medium hidden sm:inline-block ${
                    isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
