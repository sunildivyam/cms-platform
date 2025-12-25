import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";
import { ContentType } from "@cms/shared";
import * as admin from "firebase-admin";

const db = admin.firestore();

export async function createContentTypeHandler(req: AuthedRequest, res: Response) {
  const { name, slug, fields } = req.body;

  if (!name || !slug || !Array.isArray(fields)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const contentType: ContentType = {
    tenantId: req.auth!.tenantId,
    name,
    slug,
    fields,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .add(contentType);

  return res.status(201).json(contentType);
}
