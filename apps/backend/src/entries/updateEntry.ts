import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { validateEntry } from "../validation/validateEntry";
import { ContentType } from "@cms/shared";

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
  validateEntry(schema, data);

  await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id)
    .update({
      data,
      updatedAt: Date.now(),
    });

  res.json({ success: true });
}
