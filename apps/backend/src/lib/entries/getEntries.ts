import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v2/identity";

export const getEntries = async (
  tenantId: string,
  contentType: string,
  limit: number
) => {
  const db = admin.firestore();

  if (!contentType) {
    return new HttpsError("invalid-argument", "Missing contentType");
  }

  const snap = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("entries")
    .doc(contentType)
    .collection("items")
    .where("deleted", "==", false)
    .orderBy("updatedAt", "desc")
    .limit(Number(limit))
    .get();

  const entries = snap.docs.map((d) => d.data());

  return entries;
};
