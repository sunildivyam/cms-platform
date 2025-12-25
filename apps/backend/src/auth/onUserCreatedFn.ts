import {
  AuthBlockingEvent,
  beforeUserCreated,
} from "firebase-functions/v2/identity";
import * as admin from "firebase-admin";
import {} from "firebase-functions";

admin.initializeApp();

export const onUserCreatedFn = beforeUserCreated(
  async (event: AuthBlockingEvent) => {
    const user = event.data;

    // Guard clause: Ensure user data exists
    if (!user) return;

    const db = admin.firestore();

    // TEMP: first user becomes tenant owner
    const tenantRef = db.collection("tenants").doc();
    const tenantId = tenantRef.id;

    const tenantData = {
      name: "Default Tenant",
      slug: tenantId,
      plan: "free",
      ownerId: user.uid,
      createdAt: Date.now(),
    };

    // 2. Create the user within that tenant's subcollection
    const userData = {
      email: user.email,
      role: "owner",
      status: "active",
      tenantId: tenantId,
      createdAt: Date.now(),
    };

    await tenantRef.set(tenantData);
    await tenantRef.collection("users").doc(user.uid).set(userData);

    // ❌ DO NOT DO THIS: because claims can not be set,
    // before a new user is saved to firebase auth
    // await admin.auth().setCustomUserClaims(user.uid, { tenantId });

    // ✅ DO THIS INSTEAD:
    return {
      customClaims: {
        tenantId: tenantId,
        role: "owner",
      },
    };
  }
);
