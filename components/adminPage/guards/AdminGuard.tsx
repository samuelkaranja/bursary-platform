"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { hydrateAuth } from "@/redux/features/authSlice";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, role, hydrated } = useSelector(
    (state: RootState) => state.auth,
  );

  // ✅ hydrate on mount
  useEffect(() => {
    if (!hydrated) dispatch(hydrateAuth());
  }, [dispatch, hydrated]);

  // ✅ redirect only after hydration
  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (
      String(role ?? "")
        .toLowerCase()
        .trim() !== "admin"
    ) {
      router.replace("/status");
    }
  }, [hydrated, isAuthenticated, role, router]);

  // ✅ while hydrating, show something (or a loader), not null
  if (!hydrated) {
    return <div className="p-6 text-slate-600">Loading admin session…</div>;
  }

  if (
    !isAuthenticated ||
    String(role ?? "")
      .toLowerCase()
      .trim() !== "admin"
  ) {
    return null;
  }

  return <>{children}</>;
}
