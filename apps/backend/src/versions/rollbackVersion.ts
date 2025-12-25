import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

const db = admin.firestore();

export async function rollbackVersion(req: AuthedRequest, res: Response) {
  const { type, id, version } = req.params;

  const versionSnap = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entryVersions")
    .doc(type)
    .collection(id)
    .doc(version)
    .get();

  if (!versionSnap.exists) {
    return res.status(404).json({ error: "Version not found" });
  }

  await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entries")
    .doc(type)
    .collection("items")
    .doc(id)
    .update({
      data: versionSnap.data()!.data,
      status: "draft",
      currentVersion: Number(version) + 1,
      updatedAt: Date.now(),
    });

  res.json({ success: true });
}
