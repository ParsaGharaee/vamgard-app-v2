import { fa } from "@/src/lib/format";

export const Stepper = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => (
  <div className="flex items-center justify-between w-full px-2 mb-8 mt-2 relative">
    <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-line/10 -translate-y-1/2 z-0" />
    <div
      className="absolute top-1/2 right-6 h-0.5 bg-brand transition-all duration-500 ease-out z-0"
      style={{ width: `calc(${(currentStep - 1) / (steps.length - 1)} * calc(100% - 3rem))` }}
    />
    {steps.map((step, index) => {
      const stepNum = index + 1;
      const isActive = stepNum === currentStep;
      const isPassed = stepNum < currentStep;
      return (
        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors duration-300 ${isActive ? "bg-brand text-white ring-4 ring-brand/20" : isPassed ? "bg-brand text-white" : "bg-tile text-silver"}`}>
            {isPassed ? "✓" : fa(stepNum)}
          </div>
          <span className={`text-[10px] absolute -bottom-5 w-max text-center transition-colors ${isActive ? "font-bold text-ink" : "text-silver"}`}>{step}</span>
        </div>
      );
    })}
  </div>
);
