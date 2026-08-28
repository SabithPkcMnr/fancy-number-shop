import { confirmationByToken } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() || "";
  if (!token) {
    return Response.json({ error: "Missing confirmation token." }, { status: 400 });
  }
  const result = await confirmationByToken(token);
  if (!result) {
    return Response.json({ error: "This confirmation link is invalid." }, { status: 404 });
  }
  return Response.json(result);
}
