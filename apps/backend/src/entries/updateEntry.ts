import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { validateEntry } from "../validation/validateEntry";
import { ContentType } from "@cms/shared";
import { createVersionSnapshot } from "versions/createVersionSnapshot";

const db = admin.firestore();

export async function updateEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;
  const { data } = req.body;

  const typeSnap = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .where("slug", "==", type)
    .limit(1)
    .get();

  if (typeSnap.empty) {
    return res.status(404).json({ error: "Schema not found" });
  }

  const schema = typeSnap.docs[0].data() as ContentType;
  const entryRef = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id);

  validateEntry(schema, data);

  const snap = await entryRef.get();
  if (snap.data()?.status === "published") {
    return res
      .status(400)
      .json({ error: "Published entries cannot be edited" });
  }

  // Create version snapshot
  await createVersionSnapshot(
    req.auth!.tenantId,
    type,
    id,
    snap.data()!.currentVersion,
    snap.data()!.data,
    snap.data()!.status,
    req.auth!.uid
  );

  // Finally update entry
  await entryRef.update({
    data,
    currentVersion: snap.data()!.currentVersion + 1,
    updatedAt: Date.now(),
  });

  res.json({ success: true });
}
