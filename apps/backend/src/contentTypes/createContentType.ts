import { Response } from "express";
import * as admin from "firebase-admin";
import { randomUUID } from "node:crypto";
import { AuthedRequest } from "../auth/requireAuth";
import { ContentType } from "@cms/shared";

admin.initializeApp();
const db = admin.firestore();

export async function createContentType(req: AuthedRequest, res: Response) {
  const { name, slug, fields } = req.body;

  if (!name || !slug || !Array.isArray(fields)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const existing = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .where("slug", "==", slug)
    .where("isDeleted", "==", false)
    .limit(1)
    .get();

  if (!existing.empty) {
    return res.status(409).json({ error: "Slug already exists" });
  }

  const now = Date.now();
  const id = randomUUID();

  const contentType: ContentType = {
    id,
    tenantId: req.auth!.tenantId,
    name,
    slug,
    fields,
    status: "draft",
    version: 1,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .doc(id)
    .set(contentType);

  res.status(201).json(contentType);
}
