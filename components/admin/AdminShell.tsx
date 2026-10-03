"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  }

  const sidebarW = collapsed ? 72 : 256;

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">

      {/* ── Sidebar ── */}
      <aside
        style={{ width: sidebarW }}
        className="hidden lg:flex lg:flex-col fixed top-0 left-0 bottom-0 z-30
          bg-white border-r border-slate-200/80
          transition-[width] duration-300 ease-in-out overflow-hidden"
      >
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        {/* Floating toggle button when collapsed */}
        {collapsed && (
          <button
            onClick={toggle}
            className="absolute right-3 top-[18px] z-50
              flex items-center justify-center w-7 h-7 rounded-xl
              bg-indigo-50 border border-indigo-100 shadow-sm
              text-indigo-600 hover:bg-indigo-100 hover:scale-105
              transition-all duration-200"
            title="ขยายเมนู"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </aside>

      {/* ── Main content ── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: sidebarW }}
      >
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
