import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { ContentType } from "@cms/shared";

const db = admin.firestore();

export async function updateContentType(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { name, fields } = req.body;

  const ref = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .doc(id);

  const snap = await ref.get();

  if (!snap.exists || snap.data()?.isDeleted) {
    return res.status(404).json({ error: "Content type not found" });
  }

  const existing = snap.data() as ContentType;

  if (existing.status !== "draft") {
    return res
      .status(400)
      .json({ error: "Published schemas cannot be modified" });
  }

  await ref.update({
    name: name ?? existing.name,
    fields: fields ?? existing.fields,
    version: existing.version + 1,
    updatedAt: Date.now(),
  });

  res.json({ success: true });
}
