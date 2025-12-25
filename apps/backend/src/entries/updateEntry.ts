import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";
import { validateEntry } from "../validation/validateEntry";
import { ContentType } from "@cms/shared";
import { createVersionSnapshot } from "versions/createVersionSnapshot";
import { emitContentEvent } from "events/emitContentEvent";
import { dispatchWebhooks } from "webhooks/dispatchWebhooks";

admin.initializeApp();
const db = admin.firestore();

export async function updateEntry(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;
  const { data } = req.body;
  const { role, tenantId } = req.auth!;

  const typeSnap = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("contentTypes")
    .where("slug", "==", type)
    .limit(1)
    .get();

  if (typeSnap.empty) {
    return res.status(404).json({ error: "Schema not found" });
  }

  const schema = typeSnap.docs[0].data() as ContentType;

  const entryRef = db
    .collection("tenants")
    .doc(tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id);

  validateEntry(schema, data, role);

  const snap = await entryRef.get();
  if (snap.data()?.status === "published") {
    return res
      .status(400)
      .json({ error: "Published entries cannot be edited" });
  }

  // Create version snapshot
  await createVersionSnapshot(
    tenantId,
    type,
    id,
    snap.data()!.currentVersion,
    snap.data()!.data,
    snap.data()!.status,
    req.auth!.uid
  );

  // Finally update entry
  await entryRef.update({
    data,
    currentVersion: snap.data()!.currentVersion + 1,
    updatedAt: Date.now(),
  });

  // Trigger Cache revalidate (TODO: apply this for only published enteries)
  await emitContentEvent({
    tenant: tenantId,
    type,
    entryId: id,
    slug: snap.data()!.data.slug,
    action: "update",
  });

  //  Dispatch Webhook (TODO: apply this for only published enteries)
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
