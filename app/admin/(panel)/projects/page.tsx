"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Project {
  id: string;
  name: string;
  customer: string;
  status: "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  description?: string;
}

const statusMap = {
  planning:    { label: "วางแผน",           className: "bg-blue-50 text-blue-700 border-blue-200" },
  "in-progress": { label: "กำลังดำเนินการ", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  "on-hold":   { label: "พักชั่วคราว",     className: "bg-orange-50 text-orange-700 border-orange-200" },
  completed:   { label: "เสร็จสิ้น",        className: "bg-green-50 text-green-700 border-green-200" },
  cancelled:   { label: "ยกเลิก",           className: "bg-red-50 text-red-700 border-red-200" },
};

const empty = { name: "", customer: "", status: "planning" as Project["status"], progress: 0, startDate: "", endDate: "", budget: 0, description: "" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);

  async function load() {
    const r = await fetch(`${API}/projects`);
    setProjects(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.customer.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(p: Project) {
    setEditing(p);
    setForm({ name: p.name, customer: p.customer, status: p.status, progress: p.progress, startDate: p.startDate?.slice(0, 10) ?? "", endDate: p.endDate?.slice(0, 10) ?? "", budget: p.budget, description: p.description ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/projects/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/projects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบโปรเจคนี้?")) return;
    await fetch(`${API}/projects/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">โปรเจค</h1>
          <p className="text-muted-foreground text-sm mt-1">จัดการโปรเจคทั้งหมด</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />เพิ่มโปรเจค</Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="ค้นหาชื่อโปรเจค, ลูกค้า..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Briefcase className="size-10 mb-3 opacity-30" /><p>ยังไม่มีโปรเจค</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อโปรเจค</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ความคืบหน้า</TableHead>
                <TableHead>งบประมาณ</TableHead>
                <TableHead>วันสิ้นสุด</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusMap[p.status].className}>
                      {statusMap[p.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{p.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>฿{p.budget?.toLocaleString("th-TH")}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.endDate?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => openEdit(p)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" onClick={() => del(p.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "แก้ไขโปรเจค" : "เพิ่มโปรเจคใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label>ชื่อโปรเจค *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ลูกค้า *</Label>
                <Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>สถานะ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Project["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>งบประมาณ (฿)</Label>
                <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>ความคืบหน้า (%)</Label>
                <Input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>วันเริ่มต้น</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>วันสิ้นสุด</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>รายละเอียด</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.name || !form.customer}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
