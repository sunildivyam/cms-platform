import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

admin.initializeApp();
const db = admin.firestore();

export async function listContentTypes(req: AuthedRequest, res: Response) {
  const snap = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("contentTypes")
    .where("isDeleted", "==", false)
    .orderBy("updatedAt", "desc")
    .get();

  const types = snap.docs.map((d) => d.data());
  res.json(types);
}
