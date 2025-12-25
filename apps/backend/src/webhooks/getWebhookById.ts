import * as admin from "firebase-admin";
import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";

admin.initializeApp();
const db = admin.firestore();

export async function getWebhookById(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = req.auth!.tenantId;

    const doc = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("webhooks")
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error("Error fetching webhook:", error);
    res.status(500).json({ error: "Failed to fetch webhook" });
  }
}
