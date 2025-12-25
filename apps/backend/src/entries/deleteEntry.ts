import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { emitContentEvent } from "events/emitContentEvent";
import { dispatchWebhooks } from "webhooks/dispatchWebhooks";

admin.initializeApp();
const db = admin.firestore();

export async function deleteEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;
  const { tenantId } = req.auth!;

  const entryRef = db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id);

  const snap = await entryRef.get();
  if (snap.data()?.isDeleted === true) {
    return res
      .status(404)
      .json({ error: "Entry does not exist or may has been deleted already." });
  }

  await entryRef.update({
    isDeleted: true,
    updatedAt: Date.now(),
  });

  // Trigger Cache revalidate
  await emitContentEvent({
    tenant: tenantId,
    type,
    entryId: id,
    slug: snap.data()!.data.slug,
    action: "delete",
  });

  //  Dispatch Webhook
  await dispatchWebhooks(tenantId, "publish", {
    event: "publish",
    tenant: tenantId,
    type,
    entryId: id,
    slug: snap.data()!.data.slug,
    timestamp: Date.now(),
  });

  res.json({ success: true });
}
