import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

export async function dispatchWebhooks(
  tenantId: string,
  event: "publish" | "update" | "delete",
  payload: any
) {
  const snap = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("webhooks")
    .where("active", "==", true)
    .where("events", "array-contains", event)
    .get();

  snap.docs.forEach((doc) => {
    const webhook = doc.data();

    // Fire & forget
    sendWebhook(webhook.url, webhook.secret, payload);
  });
}

async function sendWebhook(url: string, secret: string, payload: any) {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cms-signature": secret,
      },
      body: JSON.stringify(payload),
      timeout: 3000,
    });
  } catch (err) {
    console.error("Webhook failed:", url);
  }
}
