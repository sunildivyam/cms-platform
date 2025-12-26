import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { PUBLIC_ENTRIES_CACHE } from "../constants/content";

admin.initializeApp();
const db = admin.firestore();

export async function getPublicEntry(req: Request, res: Response) {
  const { tenant, type, slug } = req.params;

  const snap = await db
    .collection("tenants")
    .doc(tenant)
    .collection("entries")
    .doc(type)
    .collection("items")
    .where("status", "==", "published")
    .where("data.slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) {
    return res.status(404).json({ error: "Not found" });
  }

  const doc = snap.docs[0];

  res.set("Cache-Control", PUBLIC_ENTRIES_CACHE);

  res.json({
    id: doc.id,
    ...doc.data().data,
  });
}
