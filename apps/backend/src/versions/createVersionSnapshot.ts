import * as admin from "firebase-admin";
import { ContentVersion } from "@cms/shared";

const db = admin.firestore();

export async function createVersionSnapshot(
  tenantId: string,
  type: string,
  entryId: string,
  version: number,
  data: Record<string, any>,
  status: "draft" | "published",
  userId: string
) {
  const snapshot: ContentVersion = {
    version,
    data,
    status,
    createdBy: userId,
    createdAt: Date.now(),
  };

  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("entryVersions")
    .doc(type)
    .collection(entryId)
    .doc(String(version))
    .set(snapshot);
}
