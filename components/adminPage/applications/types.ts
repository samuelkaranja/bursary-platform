export type Status =
  | "submitted"
  | "under_review"
  | "decision_pending"
  | "approved"
  | "rejected"
  | "draft";
export type Level = "Secondary" | "University";

export type ApplicationRow = {
  id: number;
  applicantName: string;
  school: string;
  level: Level;
  status: Status;
  submitted: string;
};
