"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";

import { AdminShell } from "@/components/adminPage/AdminShell";
import { StatCard } from "@/components/adminPage/StatCard";
import { StatusPie } from "@/components/adminPage/charts/StatusPie";
import { EducationBar } from "@/components/adminPage/charts/EducationBar";
import { TopSchoolsBar } from "@/components/adminPage/charts/TopSchoolsBar";

import { AppDispatch, RootState } from "@/redux/store";
import { fetchAdminOverview } from "@/redux/features/adminSlice";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const token = useSelector((s: RootState) => s.auth.accessToken);
  const role = useSelector((s: RootState) => s.auth.role);

  const { overview, loading, error } = useSelector((s: RootState) => s.admin);

  useEffect(() => {
    const r = String(role ?? "")
      .toLowerCase()
      .trim();

    if (r && r !== "admin") {
      router.push("/status");
      return;
    }

    if (!token) return;
    dispatch(fetchAdminOverview());
  }, [dispatch, token, role, router]);

  // Stat cards (top counters)
  const stats = useMemo(() => {
    return [
      {
        title: "Total Applications",
        value: overview?.total_applications ?? 0,
        sub: "All time applications",
        icon: <Users className="h-5 w-5" />,
        accent: "border-slate-900/20",
      },
      {
        title: "Pending",
        value: overview?.pending ?? 0,
        sub: "Awaiting review",
        icon: <Clock className="h-5 w-5" />,
        accent: "border-amber-500",
      },
      {
        title: "Approved",
        value: overview?.approved ?? 0,
        sub: "Successfully approved",
        icon: <CheckCircle2 className="h-5 w-5" />,
        accent: "border-emerald-500",
      },
      {
        title: "Rejected",
        value: overview?.rejected ?? 0,
        sub: "Not approved",
        icon: <XCircle className="h-5 w-5" />,
        accent: "border-rose-500",
      },
    ];
  }, [overview]);

  // Pie chart expects { name, value, color }
  const statusPie = useMemo(() => {
    const items = overview?.applications_by_status ?? [];

    // Map colors by label (fallback if unknown)
    const colorFor = (label: string) => {
      const k = label.toLowerCase().trim();
      if (k.includes("pending")) return "#F59E0B";
      if (k.includes("approved")) return "#10B981";
      if (k.includes("rejected")) return "#EF4444";
      if (k.includes("draft")) return "#64748B";
      if (k.includes("submitted")) return "#0EA5E9";
      return "#94A3B8";
    };

    return items.map((x) => ({
      name: x.label,
      value: x.value,
      color: colorFor(x.label),
    }));
  }, [overview]);

  // Education bar expects { level, applications }
  const educationBars = useMemo(() => {
    const items = overview?.applications_by_education_level ?? [];
    return items.map((x) => ({
      level: x.label,
      applications: x.value,
    }));
  }, [overview]);

  const topSchools = useMemo(() => overview?.top_schools ?? [], [overview]);

  return (
    <AdminShell
      title="Dashboard Overview"
      subtitle="Monitor and manage bursary applications"
    >
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600">
          Loading overview...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-red-600">
          {String(error)}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <StatCard
                key={s.title}
                title={s.title}
                value={s.value}
                sub={s.sub}
                icon={s.icon}
                accentClass={s.accent}
              />
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <div className="text-sm font-semibold text-slate-800">
                  Applications by Status
                </div>
                <div className="text-xs text-slate-500">
                  Distribution of application statuses
                </div>
              </div>
              <StatusPie data={statusPie} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <div className="text-sm font-semibold text-slate-800">
                  Applications by Education Level
                </div>
                <div className="text-xs text-slate-500">
                  Secondary vs University/College
                </div>
              </div>
              <EducationBar data={educationBars} />
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <div className="text-sm font-semibold text-slate-800">
                Top 5 Schools/Institutions
              </div>
              <div className="text-xs text-slate-500">
                Applications by school
              </div>
            </div>
            <TopSchoolsBar data={topSchools} />
          </section>
        </>
      )}
    </AdminShell>
  );
}
