import { logger as sendLog } from "@/lib/logger";

const USERS = [
  { email: "alsyamaulizar@gmail.com", password: "123456" },
  { email: "nisa@gmail.com", password: "password123" },
];

export async function POST(req: Request) {
  const body = await req.json();

  // WARNING - Menggunakan sendLog.warning()
  if (!body.email || !body.password) {
    await sendLog.warning("Login gagal: field kosong", {
      email: body.email,
    });

    return Response.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  // ERROR - Menggunakan sendLog.error()
  if (body.password !== "123456") {
    await sendLog.error("Login gagal: password salah", {
      email: body.email,
    });

    return Response.json(
      { error: "Password salah" },
      { status: 401 }
    );
  }

  // INFO - Menggunakan sendLog.info()
  await sendLog.info("Login berhasil", {
    email: body.email,
  });

  return Response.json({ success: true });
}