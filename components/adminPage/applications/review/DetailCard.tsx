import React from "react";

export function DetailCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>

      <div className="space-y-5">
        {items.map((it) => (
          <div key={it.label}>
            <div className="text-xs font-semibold text-slate-500">
              {it.label}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {it.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
