import { Request, Response } from "express";
import * as admin from "firebase-admin";

const db = admin.firestore();

export async function listPublicEntries(req: Request, res: Response) {
  const { tenant, type } = req.params;

  const snap = await db
    .collection("tenants")
    .doc(tenant)
    .collection("entries")
    .doc(type)
    .collection("items")
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .get();

  const items = snap.docs.map((d) => ({
    id: d.id,
    ...d.data().data,
  }));

  res.set("Cache-Control", "public, max-age=60, s-maxage=300");
  res.json(items);
}
