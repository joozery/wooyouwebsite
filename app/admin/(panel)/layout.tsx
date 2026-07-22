export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Sidebar + Header จาก src/components/layout ของโปรเจคเดิม */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
