import { sendLog } from "@/lib/logger";

export async function POST(req: Request) {
  const body = await req.json();

  // WARNING
  if (!body.email || !body.password) {
    await sendLog("warning", "Login gagal: field kosong", {
      email: body.email,
    });

    return Response.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  // ERROR
  if (body.password !== "123456") {
    await sendLog("error", "Login gagal: password salah", {
      email: body.email,
    });

    return Response.json(
      { error: "Password salah" },
      { status: 401 }
    );
  }

  // INFO
  await sendLog("info", "Login berhasil", {
    email: body.email,
  });

  return Response.json({ success: true });
}
