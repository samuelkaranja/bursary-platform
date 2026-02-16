"use client";

import React, { useRef, useEffect, useState } from "react";
import { Search, ChevronDown, ArrowDownUp } from "lucide-react";

type DropdownState = "status" | "level" | "sort" | null;

function SelectLike({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && children && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

export function ApplicationsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  level,
  onLevelChange,
  sortDir,
  onSortDirChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string | undefined;
  onStatusChange: (v: string | undefined) => void;
  level: string | undefined;
  onLevelChange: (v: string | undefined) => void;
  sortDir: "asc" | "desc";
  onSortDirChange: (v: "asc" | "desc") => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<DropdownState>(null);

  const statuses = [
    { label: "All Statuses", value: undefined },
    { label: "Submitted", value: "submitted" },
    { label: "Under Review", value: "under_review" },
    { label: "Decision Pending", value: "decision_pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Draft", value: "draft" },
  ];

  const levels = [
    { label: "All Levels", value: undefined },
    { label: "Secondary", value: "secondary" },
    { label: "University", value: "university" },
  ];

  const statusLabel =
    statuses.find((s) => s.value === status)?.label || statuses[0].label;
  const levelLabel =
    levels.find((l) => l.value === level)?.label || levels[0].label;

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
        <SelectLike
          label={statusLabel}
          isOpen={openDropdown === "status"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "status" ? null : "status")
          }
        >
          <div className="py-2">
            {statuses.map((s) => (
              <button
                key={s.value || "undefined"}
                type="button"
                onClick={() => {
                  onStatusChange(s.value);
                  setOpenDropdown(null);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 ${
                  status === s.value
                    ? "bg-slate-50 font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </SelectLike>

        <SelectLike
          label={levelLabel}
          isOpen={openDropdown === "level"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "level" ? null : "level")
          }
        >
          <div className="py-2">
            {levels.map((l) => (
              <button
                key={l.value || "undefined"}
                type="button"
                onClick={() => {
                  onLevelChange(l.value);
                  setOpenDropdown(null);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 ${
                  level === l.value
                    ? "bg-slate-50 font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </SelectLike>

        <div className="relative">
          <button
            type="button"
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
          >
            Date Filter (Coming Soon)
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowDownUp className="h-4 w-4 text-slate-500" />
          {sortDir === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
    </>
  );
}
