import React from "react";
//import { AdminShell } from "@/components/admin/AdminShell";
//import { StatCard } from "@/components/admin/StatCard";
// import { StatusPie } from "@/components/admin/charts/StatusPie";
// import { EducationBar } from "@/components/admin/charts/EducationBar";
// import { TopSchoolsBar } from "@/components/admin/charts/TopSchoolsBar";
import { AdminShell } from "@/components/adminPage/AdminShell";
import { StatCard } from "@/components/adminPage/StatCard";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function DashboardPage() {
  // Replace with API data
  const stats = [
    {
      title: "Total Applications",
      value: 12,
      sub: "All time applications",
      icon: <Users className="h-5 w-5" />,
      accent: "border-slate-900/20",
    },
    {
      title: "Pending",
      value: 8,
      sub: "Awaiting review",
      icon: <Clock className="h-5 w-5" />,
      accent: "border-amber-500",
    },
    {
      title: "Approved",
      value: 3,
      sub: "Successfully approved",
      icon: <CheckCircle2 className="h-5 w-5" />,
      accent: "border-emerald-500",
    },
    {
      title: "Rejected",
      value: 1,
      sub: "Not approved",
      icon: <XCircle className="h-5 w-5" />,
      accent: "border-rose-500",
    },
  ];

  //   const statusPie = [
  //     { name: "Pending", value: 8, color: "#F59E0B" },
  //     { name: "Approved", value: 3, color: "#10B981" },
  //     { name: "Rejected", value: 1, color: "#EF4444" },
  //   ];

  //   const educationBars = [
  //     { level: "Secondary", applications: 8 },
  //     { level: "University", applications: 4 },
  //   ];

  //   const topSchools = [
  //     { school: "Nairobi Technical", applications: 2 },
  //     { school: "Kiranga High", applications: 2 },
  //     { school: "Starehe Girls Centre", applications: 2 },
  //     { school: "University of Nairobi", applications: 1 },
  //     { school: "Alliance Girls High School", applications: 1 },
  //   ];

  return (
    <AdminShell
      title="Dashboard Overview"
      subtitle="Monitor and manage bursary applications"
    >
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

      {/* <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
          <div className="text-xs text-slate-500">Applications by school</div>
        </div>
        <TopSchoolsBar data={topSchools} />
      </section> */}
    </AdminShell>
  );
}
