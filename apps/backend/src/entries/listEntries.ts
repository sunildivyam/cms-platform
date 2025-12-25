import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { buildPaginatedQuery } from "query/buildQuery";
import { ALLOWED_FILTERS } from "@cms/shared";

admin.initializeApp();
const db = admin.firestore();

export async function listEntries(req: AuthedRequest, res: Response) {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Missing content type" });
  }

  // Base query
  let base = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type as string)
    .collection("items")
    .where("isDeleted", "==", false);

  // Allowed filters (where)
  for (const key of ALLOWED_FILTERS) {
    const value = req.query[`filter[${key}]`];
    if (value) {
      base = base.where(key, "==", value);
    }
  }

  //Paginate query
  const q = buildPaginatedQuery(base, {
    pageSize: Number(req.query.pageSize),
    cursor: req.query.cursor as string,
    sort: req.query.sort as string,
    order: req.query.order as any,
  });

  const snap = await q.get();

  res.json({
    items: snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })),
    nextCursor: snap.docs.at(-1)?.ref.path,
  });
}
