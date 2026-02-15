export type Status = "pending" | "approved" | "rejected";
export type Level = "Secondary" | "University";

export type ApplicationRow = {
  id: string;
  applicantName: string;
  school: string;
  level: Level;
  status: Status;
  submitted: string;
};
