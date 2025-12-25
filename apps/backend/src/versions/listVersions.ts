import { Response } from "express";
import * as admin from "firebase-admin";
import { AuthedRequest } from "../auth/requireAuth";

const db = admin.firestore();

export async function listVersions(req: AuthedRequest, res: Response) {
  const { type, id } = req.params;

  const snap = await db
    .collection("tenants")
    .doc(req.auth!.tenantId)
    .collection("entryVersions")
    .doc(type)
    .collection(id)
    .orderBy("version", "desc")
    .get();

  res.json(snap.docs.map((d) => d.data()));
}
