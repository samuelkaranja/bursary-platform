"use client";

import React from "react";

export function ApplicationsPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{from}</span>–
        <span className="font-semibold text-slate-900">{to}</span> of{" "}
        <span className="font-semibold text-slate-900">{total}</span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-sm font-semibold text-slate-700">
          Page {page} of {totalPages || 1}
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={totalPages === 0 || page >= totalPages}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
