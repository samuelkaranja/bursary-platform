"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { AdminShell } from "@/components/adminPage/AdminShell";
import { ApplicationsHeader } from "@/components/adminPage/applications/ApplicationsHeader";
import { ApplicationsMobileList } from "@/components/adminPage/applications/ApplicationsMobileList";
import { ApplicationsTable } from "@/components/adminPage/applications/ApplicationsTable";
import { ApplicationsToolbar } from "@/components/adminPage/applications/ApplicationsToolbar";
import { ApplicationsPagination } from "@/components/adminPage/applications/ApplicationsPagination";
import { ApplicationRow } from "@/components/adminPage/applications/types";

import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchAdminApplications,
  setQuery,
  exportApprovedCsv,
} from "@/redux/features/adminApplicationsSlice";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function ApplicationsPage() {
  useEffect(() => {
    console.log("✅ ApplicationsPage mounted");
    return () => console.log("🧹 ApplicationsPage unmounted");
  }, []);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const token = useSelector((s: RootState) => s.auth.accessToken);
  const role = useSelector((s: RootState) => s.auth.role);

  const { data, query, loading, error, exporting } = useSelector(
    (s: RootState) => s.adminApplications,
  );

  // local search input (debounced into query.q)
  const [search, setSearch] = useState(query.q ?? "");

  // prevents debounce from firing on initial mount
  const didMountRef = useRef(false);

  // role gate + initial fetch (only if needed)
  useEffect(() => {
    const r = String(role ?? "")
      .toLowerCase()
      .trim();

    if (r && r !== "admin") {
      router.push("/status");
      return;
    }

    if (!token) return;

    // ✅ Avoid refetch if we already have data for current query
    if (data?.items?.length) return;

    dispatch(fetchAdminApplications());
  }, [dispatch, token, role, router, data?.items?.length]);

  // debounced search -> set query -> fetch (skip first render)
  useEffect(() => {
    if (!token) return;

    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const t = setTimeout(() => {
      const nextQ = search.trim() || undefined;

      // ✅ only update/refetch if q actually changed
      if ((query.q ?? undefined) === nextQ) return;

      dispatch(setQuery({ q: nextQ, page: 1 }));
      dispatch(fetchAdminApplications());
    }, 300);

    return () => clearTimeout(t);
  }, [search, dispatch, token, query.q]);

  // Handlers for filters
  const handleStatusChange = (value: string | undefined) => {
    dispatch(setQuery({ status: value, page: 1 }));
    dispatch(fetchAdminApplications());
  };

  const handleLevelChange = (value: string | undefined) => {
    dispatch(setQuery({ level: value, page: 1 }));
    dispatch(fetchAdminApplications());
  };

  const handleSortDirChange = (value: "asc" | "desc") => {
    dispatch(setQuery({ sort_dir: value, page: 1 }));
    dispatch(fetchAdminApplications());
  };

  const rows: ApplicationRow[] = useMemo(() => {
    const items = data?.items ?? [];
    return items.map((x) => ({
      id: String(x.id),
      applicantName: x.applicant_name,
      school: x.school,
      level: x.level === "secondary" ? "Secondary" : "University",
      status: x.status,
      submitted: x.submitted_at ? formatDate(x.submitted_at) : "-",
    }));
  }, [data]);

  const page = data?.page ?? query.page;
  const totalPages = data?.total_pages ?? 0;
  const total = data?.total ?? 0;
  const pageSize = query.page_size;

  const goPrev = () => {
    if (query.page <= 1) return;
    dispatch(setQuery({ page: query.page - 1 }));
    dispatch(fetchAdminApplications());
  };

  const goNext = () => {
    if (totalPages && query.page >= totalPages) return;
    dispatch(setQuery({ page: query.page + 1 }));
    dispatch(fetchAdminApplications());
  };

  const onExportApproved = async () => {
    // thunk now returns a serializable data URL string (e.g. "data:text/csv;base64,...")
    const dataUrl = await dispatch(exportApprovedCsv()).unwrap();
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "approved-applications.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <AdminShell
      title="Applications"
      subtitle="Review and manage all bursary applications"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <ApplicationsHeader total={total} onExportApproved={onExportApproved} />

        <ApplicationsToolbar
          search={search}
          onSearchChange={setSearch}
          status={query.status}
          onStatusChange={handleStatusChange}
          level={query.level}
          onLevelChange={handleLevelChange}
          sortDir={query.sort_dir ?? "desc"}
          onSortDirChange={handleSortDirChange}
        />

        {loading && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-600">
            Loading applications...
          </div>
        )}

        {!loading && error && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-red-600">
            {String(error)}
          </div>
        )}

        {!loading && !error && (
          <>
            <ApplicationsTable rows={rows} />
            <ApplicationsMobileList rows={rows} />

            <ApplicationsPagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPrev={goPrev}
              onNext={goNext}
            />

            {exporting && (
              <div className="mt-3 text-sm text-slate-500">Exporting CSV…</div>
            )}
          </>
        )}
      </section>
    </AdminShell>
  );
}
