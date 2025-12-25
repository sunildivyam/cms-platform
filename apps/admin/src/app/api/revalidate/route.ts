import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cms-secret");

  if (secret !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await req.json();

  // Revalidate listing pages
  revalidateTag(`list:${event.tenant}:${event.type}`, "max");

  // Revalidate detail page
  if (event.slug) {
    revalidatePath(`/${event.slug}`);
  }

  return NextResponse.json({ revalidated: true });
}
