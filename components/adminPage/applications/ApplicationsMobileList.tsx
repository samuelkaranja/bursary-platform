import React from "react";
import { Eye } from "lucide-react";
import type { ApplicationRow } from "./types";
import { StatusPill } from "./StatusPill";

export function ApplicationsMobileList({ rows }: { rows: ApplicationRow[] }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 md:hidden">
      {rows.map((row) => (
        <div
          key={row.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {row.applicantName}
              </div>
              <div className="mt-1 text-xs text-slate-500">{row.school}</div>
            </div>
            <StatusPill status={row.status} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs font-semibold text-slate-500">Level</div>
              <div className="mt-0.5 font-medium text-slate-800">
                {row.level}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">
                Submitted
              </div>
              <div className="mt-0.5 font-medium text-slate-800">
                {row.submitted}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={`/admin/applications/${row.id}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              View
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
