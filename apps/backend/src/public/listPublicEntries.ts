import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { buildPaginatedQuery } from "query/buildQuery";
import { PUBLIC_ENTRIES_CACHE } from "@cms/shared";

admin.initializeApp();
const db = admin.firestore();

export async function listPublicEntries(req: Request, res: Response) {
  const { tenant, type } = req.params;

  const base = db
    .collection("tenants")
    .doc(tenant)
    .collection("entries")
    .doc(type)
    .collection("items")
    .where("status", "==", "published");

  const q = buildPaginatedQuery(base, {
    pageSize: Number(req.query.pageSize),
    cursor: req.query.cursor as string,
    sort: "publishedAt",
    order: "desc",
  });

  const snap = await q.get();

  const resultedEntries = {
    items: snap.docs.map((d) => ({
      id: d.id,
      ...d.data().data,
    })),
    nextCursor: snap.docs.at(-1)?.ref.path,
  };

  res.set("Cache-Control", PUBLIC_ENTRIES_CACHE);

  res.json(resultedEntries);
}
