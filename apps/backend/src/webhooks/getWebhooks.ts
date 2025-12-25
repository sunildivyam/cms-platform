import * as admin from "firebase-admin";
import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";

admin.initializeApp();
const db = admin.firestore();

export async function getWebhooks(req: AuthedRequest, res: Response) {
  try {
    const tenantId = req.auth!.tenantId;

    const snapshot = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("webhooks")
      .orderBy("createdAt", "desc")
      .get();

    const webhooks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(webhooks);
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    res.status(500).json({ error: "Failed to fetch webhooks" });
  }
}
