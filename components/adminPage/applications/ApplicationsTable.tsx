import React from "react";
import { Eye } from "lucide-react";
import type { ApplicationRow } from "./types";
import { StatusPill } from "./StatusPill";

export function ApplicationsTable({ rows }: { rows: ApplicationRow[] }) {
  return (
    <div className="mt-5 hidden md:block">
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-[900px] w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                Applicant Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                School/Institution
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                Submitted
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {row.applicantName}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.school}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.level}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.submitted}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/applications/${row.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
