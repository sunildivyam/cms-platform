import { onCall, HttpsError } from "firebase-functions/v2/https";
import { listContentTypes } from "../lib";

export const listContentTypesFn = onCall(async (data) => {
  if (!data.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  try {
    const { tenantId } = data.auth.token;
    return await listContentTypes(tenantId);
  } catch (error) {
    throw error;
  }
});
