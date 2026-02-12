"use client";

import StepThreeSecondary from "./StepThreeSecondary";
import StepThreeUniversity from "./StepThreeUniversity";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: any) => void;
  educationLevel: string;
}

export default function StepThree(props: Props) {
  if (props.educationLevel === "secondary") {
    return <StepThreeSecondary {...props} />;
  }

  return <StepThreeUniversity {...props} />;
}
