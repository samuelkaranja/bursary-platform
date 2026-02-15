import React from "react";
import { FileText } from "lucide-react";
import type { ReviewDocument } from "./types";

export function DocumentsSection({
  documents,
}: {
  documents: ReviewDocument[];
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">
          Uploaded Documents
        </div>
        <div className="text-xs text-slate-500">
          Review all submitted documents
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.href || "#"}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
              <FileText className="h-5 w-5 text-slate-600" />
            </span>
            <span className="truncate">{doc.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
