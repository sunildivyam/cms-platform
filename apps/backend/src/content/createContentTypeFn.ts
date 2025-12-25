import { onCall, HttpsError } from "firebase-functions/v2/https";
import { createContentType } from "../lib";

export const createContentTypeFn = onCall(async (data) => {
  if (!data?.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { tenantId, role } = data.auth.token;

  if (!["owner", "admin"].includes(role)) {
    throw new HttpsError("permission-denied", "Not allowed");
  }
  try {
    return await createContentType(data.data, tenantId, role);
  } catch (error) {
    throw error;
  }
});
