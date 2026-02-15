"use client";

import React, { useMemo, useState } from "react";
import { AdminShell } from "@/components/adminPage/AdminShell";
import { ApplicationsHeader } from "@/components/adminPage/applications/ApplicationsHeader";
import { ApplicationsMobileList } from "@/components/adminPage/applications/ApplicationsMobileList";
import { ApplicationsTable } from "@/components/adminPage/applications/ApplicationsTable";
import { ApplicationsToolbar } from "@/components/adminPage/applications/ApplicationsToolbar";
import { ApplicationRow } from "@/components/adminPage/applications/types";

const demoData: ApplicationRow[] = [
  {
    id: "1",
    applicantName: "Samuel Karanja",
    school: "Nairobi Technical",
    level: "University",
    status: "pending",
    submitted: "2/12/2026",
  },
  {
    id: "2",
    applicantName: "Samuel Karanja",
    school: "Kiranga High",
    level: "Secondary",
    status: "pending",
    submitted: "2/12/2026",
  },
  {
    id: "3",
    applicantName: "Samuel Karanja",
    school: "Kiranga High",
    level: "Secondary",
    status: "pending",
    submitted: "2/12/2026",
  },
  {
    id: "4",
    applicantName: "Samuel Njuguna Karanja",
    school: "Nairobi Technical",
    level: "University",
    status: "pending",
    submitted: "2/12/2026",
  },
  {
    id: "5",
    applicantName: "Daniel Ochieng Otieno",
    school: "Moi University",
    level: "University",
    status: "pending",
    submitted: "2/7/2026",
  },
  {
    id: "6",
    applicantName: "Mercy Chebet Koech",
    school: "Kenya High School",
    level: "Secondary",
    status: "pending",
    submitted: "2/5/2026",
  },
  {
    id: "7",
    applicantName: "Brian Kipchoge Rotich",
    school: "Kenyatta University",
    level: "University",
    status: "pending",
    submitted: "2/3/2026",
  },
  {
    id: "8",
    applicantName: "Jane Wanjiku Maina",
    school: "Starehe Girls Centre",
    level: "Secondary",
    status: "pending",
    submitted: "2/1/2026",
  },
  {
    id: "9",
    applicantName: "Kevin Mutua Musyoka",
    school: "Technical University of Kenya",
    level: "University",
    status: "approved",
    submitted: "1/30/2026",
  },
  {
    id: "10",
    applicantName: "John Kariuki Njoroge",
    school: "University of Nairobi",
    level: "University",
    status: "approved",
    submitted: "1/28/2026",
  },
  {
    id: "11",
    applicantName: "Grace Akinyi Omondi",
    school: "Alliance Girls High School",
    level: "Secondary",
    status: "approved",
    submitted: "1/25/2026",
  },
  {
    id: "12",
    applicantName: "Faith Wambui Kamau",
    school: "Loreto High School Limuru",
    level: "Secondary",
    status: "rejected",
    submitted: "1/20/2026",
  },
];

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return demoData;
    return demoData.filter((r) => {
      return (
        r.applicantName.toLowerCase().includes(q) ||
        r.school.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <AdminShell
      title="Applications"
      subtitle="Review and manage all bursary applications"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <ApplicationsHeader
          total={filtered.length}
          onExportApproved={() => console.log("export")}
        />
        <ApplicationsToolbar search={search} onSearchChange={setSearch} />
        <ApplicationsTable rows={filtered} />
        <ApplicationsMobileList rows={filtered} />
      </section>
    </AdminShell>
  );
}
