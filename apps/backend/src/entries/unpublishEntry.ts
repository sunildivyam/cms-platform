import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

admin.initializeApp();
const db = admin.firestore();

export async function unpublishEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;

  const ref = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id);

  const snap = await ref.get();

  if (!snap.exists || snap.data()?.isDeleted) {
    return res.status(404).json({ error: "Entry not found" });
  }

  if (snap.data()?.status !== "published") {
    return res.status(400).json({ error: "Entry is not published" });
  }

  await ref.update({
    status: "draft",
    updatedAt: Date.now(),
  });

  res.json({ success: true });
}
