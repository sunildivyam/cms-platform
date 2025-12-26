import * as admin from "firebase-admin";

// No import needed for fetch in Node.js 18+

export async function dispatchWebhooks(
  tenantId: string,
  event: "publish" | "update" | "delete",
  payload: any
) {
  const snap = await admin
    .firestore()
    .collection("tenants")
    .doc(tenantId)
    .collection("webhooks")
    .where("active", "==", true)
    .where("events", "array-contains", event)
    .get();

  // Map each doc to a promise
  const tasks = snap.docs.map((doc) => {
    const webhook = doc.data();
    return sendWebhook(webhook.url, webhook.secret, payload);
  });

  // Wait for all to finish (or fail) before the function terminates
  await Promise.allSettled(tasks);
}

async function sendWebhook(url: string, secret: string, payload: any) {
  try {
    // Native Node.js fetch uses AbortSignal.timeout
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cms-signature": secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000), // Standard 3s timeout
    });

    if (!response.ok) {
      console.warn(`Webhook ${url} returned status ${response.status}`);
    }
  } catch (err: any) {
    if (err.name === "TimeoutError") {
      console.error(`Webhook timed out: ${url}`);
    } else {
      console.error(`Webhook failed for ${url}:`, err.message);
    }
  }
}
