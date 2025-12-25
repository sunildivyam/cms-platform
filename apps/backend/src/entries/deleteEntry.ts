import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

admin.initializeApp();
const db = admin.firestore();

export async function deleteEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;

  await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id)
    .update({
      isDeleted: true,
      updatedAt: Date.now(),
    });

  res.json({ success: true });
}
