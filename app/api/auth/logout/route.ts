export async function POST() {
  const headers = new Headers();
  headers.set("Set-Cookie", "admin_token=; HttpOnly; Path=/; Max-Age=0");
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
