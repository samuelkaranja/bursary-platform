import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToApplications() {
  return (
    <div className="mb-4">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Link>
    </div>
  );
}
