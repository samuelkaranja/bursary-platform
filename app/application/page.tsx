"use client";

import { useState } from "react";
import Stepper from "@/components/ApplicationPage/Stepper";
import StepOne from "@/components/ApplicationPage/Steps/StepOne";
import StepTwo from "@/components/ApplicationPage/Steps/StepTwo";
import StepThree from "@/components/ApplicationPage/Steps/StepThree";
import StepFour from "@/components/ApplicationPage/Steps/StepFour";
import StepFive from "@/components/ApplicationPage/Steps/StepFive";

export default function ApplicationPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Bursary Application
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Complete all steps to submit your application
        </p>

        <Stepper currentStep={step} />

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
          {/* STEP 1 — REGISTER */}
          {step === 1 && <StepOne nextStep={nextStep} prevStep={prevStep} />}

          {/* STEP 2 — SELECT EDUCATION + CREATE DRAFT */}
          {step === 2 && <StepTwo nextStep={nextStep} />}

          {/* STEP 3 — STUDENT DETAILS */}
          {step === 3 && <StepThree nextStep={nextStep} prevStep={prevStep} />}

          {/* STEP 4 — GUARDIAN DETAILS */}
          {step === 4 && <StepFour nextStep={nextStep} prevStep={prevStep} />}

          {/* STEP 5 — SUBMIT */}
          {step === 5 && <StepFive prevStep={prevStep} />}
        </div>
      </div>
    </div>
  );
}
