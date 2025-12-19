import logger from "@/lib/logger";

const USERS = [
  { email: "alsyamaulizar@gmail.com", password: "123456" },
  { email: "nisa@gmail.com", password: "password123" },
];

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.email || !body.password) {
    await logger.warning("Login gagal: field kosong", { email: body.email });
    return Response.json({ error: "Email dan password wajib diisi" }, { status: 400 });
  }

  const user = USERS.find(u => u.email === body.email);

  if (!user) {
    await logger.error("Login gagal: email tidak terdaftar", { email: body.email });
    return Response.json({ error: "Email tidak terdaftar" }, { status: 404 });
  }

  if (user.password !== body.password) {
    await logger.error("Login gagal: password salah", { email: body.email });
    return Response.json({ error: "Password salah" }, { status: 401 });
  }

  await logger.info("Login berhasil", { email: body.email });
  return Response.json({ success: true, email: user.email });
}
