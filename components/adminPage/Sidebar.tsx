"use client";

import React from "react";
import {
  LayoutDashboard,
  FileText,
  School,
  Download,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: <FileText className="h-5 w-5" />,
  },
  // {
  //   label: "Schools",
  //   href: "/admin/schools",
  //   icon: <School className="h-5 w-5" />,
  // },
  // {
  //   label: "Exports",
  //   href: "/admin/exports",
  //   icon: <Download className="h-5 w-5" />,
  // },
  // {
  //   label: "Settings",
  //   href: "/admin/settings",
  //   icon: <Settings className="h-5 w-5" />,
  // },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    // try {
    //   🔥 Replace with your real logout logic
    //   Example if using cookies:
    //   await fetch("/api/auth/logout", { method: "POST" });
    //   Example if using localStorage token:
    //   localStorage.removeItem("token");
    //   router.push("/login");
    // } catch (err) {
    //   console.error("Logout failed", err);
    // }
  }

  return (
    <aside className="flex h-full flex-col w-[280px] bg-[#173B8F] text-white">
      <div className="px-6 py-6">
        <div className="text-lg font-semibold">Admin Portal</div>
        <div className="text-xs text-white/70">Bursary Management</div>
      </div>

      <nav className="px-3">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
                active ? "bg-white/15" : "hover:bg-white/10",
              ].join(" ")}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto px-3 pb-6 space-y-2">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-red-500/20 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>

        {/* Back to Website */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Website
        </Link>
      </div>
    </aside>
  );
}
