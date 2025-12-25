import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getEntries } from "../lib";

export const getEntriesFn = onCall(async (data) => {
  if (!data.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  try {
    const { tenantId } = data.auth.token;

    return await getEntries(tenantId);
  } catch (error) {
    throw error;
  }
});
