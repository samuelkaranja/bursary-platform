import React from "react";

export function StatCard({
  title,
  value,
  sub,
  icon,
  accentClass,
}: {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  accentClass: string; // e.g. "border-amber-500"
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-700">{title}</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{sub}</div>
        </div>

        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl border",
            accentClass,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
