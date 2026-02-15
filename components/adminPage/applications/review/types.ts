export type Status = "pending" | "approved" | "rejected";

export type ReviewDocument = {
  id: string;
  label: string;
  href?: string; // where to open/download the file
};

export type ApplicationReviewData = {
  id: string;
  status: Status;

  student: {
    fullName: string;
    phoneNumber: string;
    educationLevel: string;
    institutionName: string;
    idNumber: string;
    registrationNumber: string;
    submissionDate: string;
  };

  guardian: {
    fullName: string;
    idNumber: string;
    phoneNumber: string;
    yearOfBirth: string;
    relationship: string;
  };

  documents: ReviewDocument[];
};
