import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep this minimal; per-page titles handled by AdminShell
  return children;
}
