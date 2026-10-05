"use client";

import { useState, useEffect, useSyncExternalStore, type CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

let sessionCollapsed = false;
function getCollapsedPreference() {
  try { return localStorage.getItem("sidebar_collapsed") === "true"; } catch { return sessionCollapsed; }
}
function subscribeToPreference(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("wooyou-sidebar-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("wooyou-sidebar-change", onChange);
  };
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribeToPreference, getCollapsedPreference, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function toggle() {
    const next = !collapsed;
    sessionCollapsed = next;
    try { localStorage.setItem("sidebar_collapsed", String(next)); } catch { /* Keep the session preference. */ }
    window.dispatchEvent(new Event("wooyou-sidebar-change"));
  }

  const sidebarW = collapsed ? 72 : 256;

  return (
    <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
      <div className="min-h-dvh bg-[#f4f5f7] text-slate-900" style={{ "--sidebar-width": `${sidebarW}px` } as CSSProperties}>
        <aside style={{ width: sidebarW }} className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-slate-200/80 bg-white transition-[width] duration-300 lg:flex lg:flex-col">
          <Sidebar collapsed={collapsed} onToggle={toggle} />
          {collapsed && <button type="button" onClick={toggle} aria-label="ขยายเมนู" className="absolute top-[18px] right-3 z-50 flex size-8 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"><ChevronRight aria-hidden="true" className="size-4" /></button>}
        </aside>

        <DialogContent showCloseButton={false} className="top-0 left-0 flex h-dvh max-h-none w-[min(320px,90vw)] max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-w-none data-open:animate-none data-closed:animate-none" aria-describedby="admin-menu-description">
          <DialogTitle className="sr-only">เมนูระบบภายในบริษัท</DialogTitle>
          <DialogDescription id="admin-menu-description" className="sr-only">เลือกหน้าที่ต้องการใช้งาน</DialogDescription>
          <Sidebar onToggle={() => setMobileOpen(false)} mobile onNavigate={() => setMobileOpen(false)} />
        </DialogContent>

        <div className="flex min-h-dvh min-w-0 flex-col transition-[margin-left] duration-300 lg:ml-[var(--sidebar-width)]">
          <Header />
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 [&_[data-slot=card]]:min-w-0 [&_[data-slot=card-content]]:min-w-0 [&_input]:min-w-0 [&_textarea]:min-w-0 [&_table_button]:min-h-11 [&_table_button]:min-w-11 sm:[&_table_button]:min-h-0 sm:[&_table_button]:min-w-0">
            {children}
          </main>
        </div>
      </div>
    </Dialog>
  );
}
