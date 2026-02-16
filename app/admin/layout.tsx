"use client";

import React from "react";
import AdminGuard from "@/components/adminPage/guards/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
