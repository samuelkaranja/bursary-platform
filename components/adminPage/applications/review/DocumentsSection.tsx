"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import type { ReviewDocument } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type DocState = {
  url?: string; // blob URL
  loading: boolean;
  error?: string | null;
  contentType?: string | null;
  filename?: string | null;
};

export function DocumentsSection({
  documents,
}: {
  documents: ReviewDocument[];
}) {
  const token = useSelector((s: RootState) => s.auth.accessToken);

  const initial = useMemo(() => {
    const m: Record<string, DocState> = {};
    documents.forEach((d) => (m[d.id] = { loading: true }));
    return m;
  }, [documents]);

  const [map, setMap] = useState<Record<string, DocState>>(initial);

  useEffect(() => {
    // Reset when documents change
    setMap(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  useEffect(() => {
    const controllers: Record<string, AbortController> = {};
    const BACKEND_ORIGIN = "https://api.kandarabursary.com";
    documents.forEach((doc) => {
      const href = doc.href || "";
      if (!href) {
        setMap((m) => ({
          ...m,
          [doc.id]: { loading: false, error: "No URL" },
        }));
        return;
      }

      const fetchUrl = href.startsWith("http")
        ? href
        : `${BACKEND_ORIGIN}${href.startsWith("/") ? "" : "/"}${href}`;

      const controller = new AbortController();
      controllers[doc.id] = controller;

      (async () => {
        try {
          const res = await fetch(fetchUrl, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            signal: controller.signal,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            setMap((m) => ({
              ...m,
              [doc.id]: {
                loading: false,
                error: text || `Request failed (${res.status})`,
              },
            }));
            return;
          }

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const contentType = res.headers.get("content-type") || null;
          const disposition = res.headers.get("content-disposition") || "";
          let filename: string | null = null;
          const m = disposition.match(
            /filename\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\n]+))/i,
          );
          if (m) filename = m[1] || m[2] || m[3] || null;

          setMap((m) => ({
            ...m,
            [doc.id]: {
              loading: false,
              url,
              error: null,
              contentType,
              filename,
            },
          }));
        } catch (err: any) {
          if (err.name === "AbortError") return;
          setMap((m) => ({
            ...m,
            [doc.id]: { loading: false, error: err?.message || String(err) },
          }));
        }
      })();
    });

    return () => {
      // abort inflight and revoke blob urls
      Object.values(controllers).forEach((c) => c.abort());
      Object.values(map).forEach((s) => {
        if (s.url) URL.revokeObjectURL(s.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, token]);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">
          Uploaded Documents
        </div>
        <div className="text-xs text-slate-500">
          Review all submitted documents
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const state = map[doc.id] ?? { loading: true };
          const href = doc.href || "";
          const BACKEND_ORIGIN = "https://api.kandarabursary.com";
          const fetchUrl = href.startsWith("http")
            ? href
            : `${BACKEND_ORIGIN}${href.startsWith("/") ? "" : "/"}${href}`;
          const ext =
            fetchUrl.split("?")[0].split(".").pop()?.toLowerCase() || "";
          const isImage =
            (state.contentType && state.contentType.startsWith("image/")) ||
            ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext);
          const isPdf =
            (state.contentType && state.contentType === "application/pdf") ||
            ext === "pdf";

          return (
            <div
              key={doc.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-sm"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  <FileText className="h-5 w-5 text-slate-600" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800">
                    {state.filename ?? doc.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {state.contentType ?? (ext ? ext.toUpperCase() : "FILE")}
                  </div>
                </div>

                <a
                  href={state.url || fetchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 mr-3 rounded-full px-3 py-1 text-xs font-medium text-sky-600 hover:underline"
                >
                  Open
                </a>
              </div>

              {state.loading && (
                <div className="px-4 pb-4 text-sm text-slate-500">
                  Loading preview...
                </div>
              )}

              {state.error && (
                <div className="px-4 pb-4 text-sm text-rose-600">
                  {state.error}
                </div>
              )}

              {!state.loading && !state.error && state.url && isImage && (
                <div className="px-4 pb-4">
                  <img
                    src={state.url}
                    alt={doc.label}
                    className="w-full rounded-md object-contain"
                  />
                </div>
              )}

              {!state.loading && !state.error && state.url && isPdf && (
                <div className="h-64 px-4 pb-4">
                  <iframe
                    src={state.url}
                    className="h-full w-full rounded-md"
                    title={doc.label}
                  />
                </div>
              )}

              {!state.loading &&
                !state.error &&
                state.url &&
                !isImage &&
                !isPdf && (
                  <div className="px-4 pb-4 text-sm text-slate-600">
                    Preview not available for this file type.
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
