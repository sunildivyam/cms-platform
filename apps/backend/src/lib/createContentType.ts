import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { ContentType } from "@cms/shared";

export const createContentType = async (data: ContentType, tenantId: string, role: string )=> {
    if (!["owner", "admin"].includes(role)) {
      throw new functions.https.HttpsError("permission-denied", "Not allowed");
    }

    const contentType: ContentType = data;

    const db = admin.firestore();
    const ref = db
      .collection("tenants")
      .doc(tenantId)
      .collection("contentTypes")
      .doc(contentType.slug);

    await ref.set({
      ...contentType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
}
