"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Settings, FileText,
  LogOut, BookOpen, Image as ImageIcon, UserCircle, Receipt,
  ScrollText, Calculator, ShieldCheck, KeyRound,
  FolderKanban, ChevronRight, PanelLeftClose
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "ภาพรวม",
    items: [
      { name: "แดชบอร์ด", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "จัดการลูกค้า & งาน",
    items: [
      { name: "ลูกค้า",            href: "/admin/customers",            icon: Users },
      { name: "โปรเจกต์",           href: "/admin/projects",             icon: FolderKanban, badge: "กำลังทำ", badgeColor: "bg-indigo-50 text-indigo-600 border border-indigo-200/50" },
      { name: "Credential ลูกค้า", href: "/admin/customer-credentials", icon: KeyRound },
    ],
  },
  {
    label: "เอกสารทางการเงิน",
    items: [
      { name: "ใบเสนอราคา",          href: "/admin/quotations",   icon: FileText },
      { name: "ใบแจ้งหนี้",          href: "/admin/invoices",     icon: Receipt },
      { name: "ใบกำกับภาษี",         href: "/admin/tax-invoices", icon: Receipt },
      { name: "ใบเสร็จรับเงิน",      href: "/admin/receipts",     icon: ScrollText },
      { name: "บัญชีรายรับ-รายจ่าย", href: "/admin/accounting",   icon: Calculator },
    ],
  },
  {
    label: "เนื้อหาเว็บ & สื่อ",
    items: [
      { name: "Client Logos", href: "/admin/clients", icon: ImageIcon },
      { name: "บทความ / บล็อก",href: "/admin/blogs",   icon: BookOpen },
    ],
  },
  {
    label: "การตั้งค่า & ทีมงาน",
    items: [
      { name: "พนักงาน",     href: "/admin/employees", icon: UserCircle },
      { name: "ผู้ดูแลระบบ", href: "/admin/admins",    icon: ShieldCheck },
      { name: "ตั้งค่าระบบ", href: "/admin/settings",  icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full select-none bg-[#FAFAFA] border-r border-slate-200/70">

      {/* ── Logo & Brand Bar ── */}
      <div className="h-[64px] flex items-center justify-between px-4 shrink-0 border-b border-slate-200/60 bg-white">
        {collapsed ? (
          <div className="w-full flex items-center justify-center">
            <img
              src="/logo/logolong.svg"
              alt="Wooyou Logo"
              className="h-7 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onToggle}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <img
              src="/logo/logolong.svg"
              alt="Wooyou Creative"
              className="h-8 w-auto object-contain max-w-[140px]"
            />
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider shrink-0 border border-slate-200/60">
              ADMIN
            </span>
          </div>
        )}

        {/* Toggle Button */}
        {onToggle && !collapsed && (
          <button
            onClick={onToggle}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all duration-200"
            title="ย่อเมนู"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Nav List ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">

            {/* Section Header */}
            <div className={cn(
              "overflow-hidden transition-all duration-300 px-2",
              collapsed ? "max-h-0 opacity-0 mb-0" : "max-h-6 opacity-100 mb-1.5"
            )}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {section.label}
              </span>
            </div>

            {/* Nav Items */}
            <div className="space-y-[2px]">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <div key={item.href} className="relative group/item">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-150",
                        collapsed ? "justify-center px-2 py-2.5" : "px-2.5 py-2",
                        isActive
                          ? "bg-slate-900 text-white font-medium shadow-sm shadow-slate-900/10"
                          : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                      )}
                    >
                      {/* Unified Single-Color Icon */}
                      <Icon className={cn(
                        "w-4 h-4 shrink-0 transition-colors duration-150",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover/item:text-slate-700"
                      )} />

                      {/* Label */}
                      <span className={cn(
                        "overflow-hidden transition-all duration-300 flex-1 leading-none tracking-tight",
                        collapsed ? "w-0 opacity-0" : "opacity-100"
                      )}>
                        {item.name}
                      </span>

                      {/* Badge if present */}
                      {!collapsed && item.badge && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-semibold",
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor || "bg-slate-200/60 text-slate-600"
                        )}>
                          {item.badge}
                        </span>
                      )}

                      {/* Chevron Arrow on Hover when not active */}
                      {!collapsed && !item.badge && !isActive && (
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-slate-400" />
                      )}
                    </Link>

                    {/* Collapsed Tooltip */}
                    {collapsed && (
                      <div className="
                        pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                        px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap
                        shadow-xl opacity-0 -translate-x-2
                        group-hover/item:opacity-100 group-hover/item:translate-x-0
                        transition-all duration-200 flex items-center gap-2
                      ">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white text-[9px]">
                            {item.badge}
                          </span>
                        )}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer / User Profile Card ── */}
      <div className="shrink-0 p-3 border-t border-slate-200/60 bg-white">
        <div className="relative group/user">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg transition-all duration-150 bg-slate-50 border border-slate-200/60 hover:bg-slate-100/70",
            collapsed ? "justify-center p-2" : "px-2.5 py-2"
          )}>
            {/* User Avatar - Unified Monochrome */}
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {/* User Info */}
            <div className={cn(
              "overflow-hidden transition-all duration-300 flex-1 min-w-0",
              collapsed ? "w-0 opacity-0" : "opacity-100"
            )}>
              <p className="text-[12.5px] font-semibold text-slate-800 truncate leading-tight">
                Wooyou Admin
              </p>
              <p className="text-[10px] font-medium text-slate-400 truncate leading-tight mt-0.5">
                Super Admin
              </p>
            </div>

            {/* Logout Button */}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="ออกจากระบบ"
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapsed Logout Tooltip */}
          {collapsed && (
            <button
              onClick={handleLogout}
              className="
                pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                px-3 py-1.5 rounded-lg bg-slate-900 text-rose-400 text-xs font-medium whitespace-nowrap
                shadow-xl opacity-0 -translate-x-2
                group-hover/user:opacity-100 group-hover/user:translate-x-0
                transition-all duration-200 flex items-center gap-1.5
              "
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}


