import { Response } from "express";
import * as admin from "firebase-admin";
import { randomUUID } from "node:crypto";
import { AuthedRequest } from "../auth/requireAuth";
import { validateEntry } from "../validation/validateEntry";
import { ContentEntry, ContentType } from "@cms/shared";

admin.initializeApp();
const db = admin.firestore();

export async function createEntry(req: AuthedRequest, res: Response) {
  const { contentType, data } = req.body;

  if (!contentType || !data) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const typeSnap = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .where("slug", "==", contentType)
    .where("isDeleted", "==", false)
    .limit(1)
    .get();

  if (typeSnap.empty) {
    return res.status(404).json({ error: "Content type not found" });
  }

  const schema = typeSnap.docs[0].data() as ContentType;
  validateEntry(schema, data, req.auth!.role);

  const now = Date.now();

  const entry: ContentEntry = {
    id: randomUUID(),
    tenantId: req.auth!.tenantId,
    contentType,
    data,
    status: "draft",
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    currentVersion: 1,
  };

  await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(contentType)
    .collection("items")
    .doc(entry.id)
    .set(entry);

  res.status(201).json(entry);
}
