"use client";

import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteAdminApplication } from "@/redux/features/adminApplicationsSlice";
import toast from "react-hot-toast";
import type { ApplicationRow } from "./types";
import { StatusPill } from "./StatusPill";

export function ApplicationsTable({ rows }: { rows: ApplicationRow[] }) {
  const dispatch = useDispatch<AppDispatch>();

  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{
    id: string; // ✅ string now
    name: string;
    school?: string;
  } | null>(null);

  const handleDeleteClick = (row: ApplicationRow) => {
    setSelectedApp({
      id: row.id,
      name: row.applicantName,
      school: row.school,
    });
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedApp) return;
    console.log("Deleting ID:", selectedApp?.id);

    try {
      await dispatch(deleteAdminApplication(selectedApp.id)).unwrap();
      toast.success("Application deleted successfully");
    } catch (err: any) {
      toast.error(err || "Failed to delete application");
    } finally {
      setShowModal(false);
      setSelectedApp(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  return (
    <>
      <div className="mt-5 hidden md:block">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-225 w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Applicant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  School/Institution
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                  Submitted
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {row.applicantName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.school}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.level}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.submitted}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/admin/applications/${row.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </a>

                      <button
                        onClick={() => handleDeleteClick(row)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Application
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Do you want to permanently delete{" "}
              <span className="font-semibold text-slate-900">
                {selectedApp?.name}
              </span>
              ?
            </p>

            <p className="mt-1 text-xs text-slate-500">
              ID: {selectedApp?.id} • {selectedApp?.school}
            </p>

            <p className="mt-2 text-xs text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                No
              </button>

              <button
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
