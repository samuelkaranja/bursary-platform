"use client";

import React from "react";
import { Search, ChevronDown, ArrowDownUp } from "lucide-react";

function SelectLike({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}

export function ApplicationsToolbar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <>
      {/* Search */}
      <div className="mt-5">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search by name, phone, or school..."
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectLike label="All Statuses" />
        <SelectLike label="All Levels" />
        <SelectLike label="Date Submitted" />
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowDownUp className="h-4 w-4 text-slate-500" />
          Descending
        </button>
      </div>
    </>
  );
}
