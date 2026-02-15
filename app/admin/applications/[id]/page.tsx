import { AdminShell } from "@/components/adminPage/AdminShell";
import { ApplicationReviewClient } from "@/components/adminPage/applications/review/ApplicationReviewClient";
import { ApplicationReviewData } from "@/components/adminPage/applications/review/types";
import React from "react";

export default function ApplicationReviewPage() {
  // Replace with params + DB/API fetch
  const data: ApplicationReviewData = {
    id: "2",
    status: "pending",
    student: {
      fullName: "Samuel Karanja",
      phoneNumber: "0719413656",
      educationLevel: "University/College",
      institutionName: "Nairobi Technical",
      idNumber: "32164758",
      registrationNumber: "1234",
      submissionDate: "February 12, 2026",
    },
    guardian: {
      fullName: "Kevin Karanja",
      idNumber: "12345678",
      phoneNumber: "0700000000",
      yearOfBirth: "1954",
      relationship: "Father",
    },
    documents: [
      { id: "d1", label: "Admission Letter", href: "#" },
      { id: "d2", label: "Parent ID (Front)", href: "#" },
      { id: "d3", label: "Parent ID (Back)", href: "#" },
    ],
  };

  return (
    <AdminShell
      title="Application Review"
      subtitle="Review and make a decision on this application"
    >
      <ApplicationReviewClient data={data} />
    </AdminShell>
  );
}
