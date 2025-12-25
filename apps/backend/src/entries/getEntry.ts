import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { filterReadableFields } from "validation/filterReadableFields";

const db = admin.firestore();

export async function getEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;

  const contentTypeRef = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type);

  const snap = await contentTypeRef.collection("items").doc(id).get();

  if (!snap.exists || snap.data()?.isDeleted) {
    return res.status(404).json({ error: "Entry not found" });
  }

  const schemaSnap = await contentTypeRef.get();
  const schema = schemaSnap.data;

  const filtered = filterReadableFields(
    schema,
    snap.data()!.data,
    req.auth!.role
  );

  res.json({
    ...snap.data(),
    data: filtered,
  });
}
