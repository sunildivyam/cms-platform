import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

const db = admin.firestore();

export async function listEntries(req: AuthedRequest, res: Response) {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Missing content type" });
  }

  const snap = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type as string)
    .collection("items")
    .where("isDeleted", "==", false)
    .orderBy("updatedAt", "desc")
    .get();

  res.json(snap.docs.map((d) => d.data()));
}
