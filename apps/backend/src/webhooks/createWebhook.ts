import * as admin from "firebase-admin";
import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";
import { randomBytes } from "node:crypto";

admin.initializeApp();
const db = admin.firestore();

export async function createWebhook(req: AuthedRequest, res: Response) {
  const secret = randomBytes(24).toString("hex");

  const ref = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("webhooks")
    .add({
      ...req.body,
      secret,
      active: true,
      createdAt: Date.now(),
    });

  res.json({ id: ref.id, secret });
}
