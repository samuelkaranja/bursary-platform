import React from "react";
import { Download } from "lucide-react";

export function ApplicationsHeader({
  total,
  onExportApproved,
}: {
  total: number;
  onExportApproved?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="text-base font-semibold text-slate-900">
          All Applications
        </div>
        <div className="text-sm text-slate-500">
          {total} of {total} applications
        </div>
      </div>

      <button
        type="button"
        onClick={onExportApproved}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173B8F] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
      >
        <Download className="h-4 w-4" />
        Export Approved (CSV)
      </button>
    </div>
  );
}
