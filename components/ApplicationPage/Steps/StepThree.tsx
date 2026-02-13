"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import StepThreeSecondary from "./StepThreeSecondary";
import StepThreeUniversity from "./StepThreeUniversity";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepThree({ nextStep, prevStep }: Props) {
  const educationLevel = useSelector(
    (state: RootState) => state.application.educationLevel,
  );

  if (educationLevel === "secondary") {
    return <StepThreeSecondary nextStep={nextStep} prevStep={prevStep} />;
  }

  return <StepThreeUniversity nextStep={nextStep} prevStep={prevStep} />;
}
