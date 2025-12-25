import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v2/https";

import { validateEntryData } from "./validateEntry";
import { Entry, ContentType } from "@cms/shared";

const db = admin.firestore();

export const createEntry = async (
  data: Entry,
  tenantId: string,
  contentType: string,
  status = "draft"
) => {
  const typeSnap = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("contentTypes")
    .where("slug", "==", contentType)
    .limit(1)
    .get();

  if (typeSnap.empty) {
    return new HttpsError("not-found", "Content type not found");
  }

  const schema = typeSnap.docs[0].data() as ContentType;
  validateEntryData(schema, data);

  const entry: Entry = {
    tenantId,
    contentType,
    data,
    status,
    deleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const entryR = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("entries")
    .doc(contentType)
    .collection("items")
    .add(entry);

  return entryR;
};
