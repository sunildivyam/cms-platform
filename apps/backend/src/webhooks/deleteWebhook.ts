import * as admin from "firebase-admin";
import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";

admin.initializeApp();
const db = admin.firestore();

export async function deleteWebhook(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = req.auth!.tenantId;

    if (!id) {
      return res.status(400).json({ error: "Webhook ID is required" });
    }

    // Reference to the specific webhook doc
    const webhookRef = db
      .collection("tenants")
      .doc(tenantId)
      .collection("webhooks")
      .doc(id);

    // Delete the document
    await webhookRef.delete();

    // Firestore delete() is idempotent (doesn't fail if the doc is already gone)
    res.json({ message: "Webhook deleted successfully", id });
  } catch (error) {
    console.error("Error deleting webhook:", error);
    res.status(500).json({ error: "Failed to delete webhook" });
  }
}
