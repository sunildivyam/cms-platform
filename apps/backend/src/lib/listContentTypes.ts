import * as admin from "firebase-admin";

export const listContentTypes = async (tenantId: string) => {
  const db = admin.firestore();

  const snap = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("contentTypes")
    .get();

  return snap.docs.map((d) => d.data());
};
