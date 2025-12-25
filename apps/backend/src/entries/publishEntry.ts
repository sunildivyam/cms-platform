import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { createVersionSnapshot } from "versions/createVersionSnapshot";
import { emitContentEvent } from "events/emitContentEvent";

admin.initializeApp();
const db = admin.firestore();

export async function publishEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;
  const { tenantId } = req.auth!;

  const ref = db
    .collection("tenants")
    .doc(tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id);

  const snap = await ref.get();

  if (!snap.exists || snap.data()?.isDeleted) {
    return res.status(404).json({ error: "Entry not found" });
  }

  if (snap.data()?.status === "published") {
    return res.status(400).json({ error: "Already published" });
  }

  // Create version snapshot
  await createVersionSnapshot(
    tenantId,
    type,
    id,
    snap.data()!.currentVersion,
    snap.data()!.data,
    "draft",
    req.auth!.uid
  );

  await ref.update({
    status: "published",
    currentVersion: snap.data()!.currentVersion + 1,
    publishedAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Trigger Cache revalidate
  await emitContentEvent({
    tenant: tenantId,
    type,
    entryId: id,
    slug: snap.data()!.data.slug,
    action: "publish",
  });

  res.json({ success: true });
}
