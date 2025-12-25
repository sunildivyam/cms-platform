import { onCall, HttpsError } from "firebase-functions/v2/https";
import { createEntry } from "../lib";

export const createEntryFn = onCall(async (event) => {
  if (!event?.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { tenantId, role } = event.auth.token;
  const { contentType, status } = event.data;

  if (!["owner", "admin"].includes(role)) {
    throw new HttpsError("permission-denied", "Not allowed");
  }

  try {
    return await createEntry(event.data, tenantId, contentType, status);
  } catch (error) {
    throw error;
  }
});
