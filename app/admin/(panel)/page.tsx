"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, FolderKanban, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface DashboardStats {
  customers: { total: number };
  projects: { total: number; active: number };
  quotations: { total: number; pending: number };
  revenue: {
    unpaid: number;
    currentMonth: number;
    yearly: number;
    monthly: { month: number; monthName: string; revenue: number }[];
  };
}

function StatCard({
  title, value, sub, icon: Icon, color,
}: {
  title: string; value: string; sub: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`flex size-8 items-center justify-center rounded-full ${color}`}>
          <Icon className="size-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`)
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `฿${(n / 1_000_000).toFixed(1)}M`
      : `฿${n.toLocaleString("th-TH")}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">ภาพรวมธุรกิจ Wooyou Creative</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="รายได้เดือนนี้" icon={DollarSign} color="bg-emerald-500"
          value={loading ? "..." : fmt(stats?.revenue.currentMonth ?? 0)}
          sub={`รายได้ปีนี้ ${loading ? "..." : fmt(stats?.revenue.yearly ?? 0)}`}
        />
        <StatCard
          title="ลูกค้าทั้งหมด" icon={Users} color="bg-blue-500"
          value={loading ? "..." : `${stats?.customers.total ?? 0} ราย`}
          sub="ลูกค้าที่ลงทะเบียน"
        />
        <StatCard
          title="โปรเจคที่กำลังดำเนินการ" icon={FolderKanban} color="bg-violet-500"
          value={loading ? "..." : `${stats?.projects.active ?? 0} โปรเจค`}
          sub={`ทั้งหมด ${stats?.projects.total ?? 0} โปรเจค`}
        />
        <StatCard
          title="หนี้ค้างชำระ" icon={AlertCircle} color="bg-orange-500"
          value={loading ? "..." : fmt(stats?.revenue.unpaid ?? 0)}
          sub={`ใบเสนอราคารอ ${stats?.quotations.pending ?? 0} รายการ`}
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">รายได้รายเดือน</CardTitle>
          </div>
          <CardDescription>รายรับจากใบเสนอราคาที่ชำระแล้วในปีนี้</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
              กำลังโหลด...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.revenue.monthly ?? []} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="monthName" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                />
                <Tooltip
                  formatter={(v) => [`฿${Number(v).toLocaleString("th-TH")}`, "รายได้"]}
                  cursor={{ fill: "#f5f5f5" }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
