import React from "react";
import { DetailCard } from "./DetailCard";
import type { ApplicationReviewData } from "./types";

export function DetailsSection({ data }: { data: ApplicationReviewData }) {
  const studentItems = [
    { label: "Full Name", value: data.student.fullName },
    { label: "Phone Number", value: data.student.phoneNumber },
    { label: "Education Level", value: data.student.educationLevel },
    { label: "Institution Name", value: data.student.institutionName },
    { label: "ID Number", value: data.student.idNumber },
    { label: "Registration Number", value: data.student.registrationNumber },
    { label: "Submission Date", value: data.student.submissionDate },
  ];

  const guardianItems = [
    { label: "Full Name", value: data.guardian.fullName },
    { label: "ID Number", value: data.guardian.idNumber },
    { label: "Phone Number", value: data.guardian.phoneNumber },
    { label: "Year of Birth", value: data.guardian.yearOfBirth },
    { label: "Relationship", value: data.guardian.relationship },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DetailCard
        title="Student Details"
        subtitle="Personal information of the applicant"
        items={studentItems}
      />
      <DetailCard
        title="Parent/Guardian Details"
        subtitle="Information about the parent or guardian"
        items={guardianItems}
      />
    </section>
  );
}
