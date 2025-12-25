import fetch from "node-fetch";

export async function emitContentEvent(event: {
  tenant: string;
  type: string;
  entryId: string;
  slug?: string;
  action: "publish" | "update" | "delete";
}) {
  if (!process.env.REVALIDATE_URL) return;

  await fetch(process.env.REVALIDATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cms-secret": process.env.REVALIDATE_SECRET!,
    },
    body: JSON.stringify(event),
  });
}
