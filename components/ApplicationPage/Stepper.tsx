interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
              ${
                currentStep > step
                  ? "bg-blue-900 text-white"
                  : currentStep === step
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2
                ${currentStep > step ? "bg-blue-900" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
