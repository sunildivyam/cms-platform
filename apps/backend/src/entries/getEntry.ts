import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

const db = admin.firestore();

export async function getEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;

  const doc = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id)
    .get();

  if (!doc.exists || doc.data()?.isDeleted) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.json(doc.data());
}
