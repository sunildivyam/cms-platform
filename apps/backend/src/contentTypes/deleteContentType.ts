import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

const db = admin.firestore();

export async function deleteContentType(req: AuthedRequest, res: Response) {
  const { id } = req.params;

  const ref = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .doc(id);

  const snap = await ref.get();

  if (!snap.exists || snap.data()?.isDeleted) {
    return res.status(404).json({ error: "Content type not found" });
  }

  // Future: block delete if entries exist
  await ref.update({
    isDeleted: true,
    updatedAt: Date.now(),
  });

  res.json({ success: true });
}
