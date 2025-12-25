import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import { UserRole } from "@cms/shared";

export interface AuthContext {
  uid: string;
  tenantId: string;
  role: UserRole;
}

export interface AuthedRequest extends Request {
  auth?: AuthContext;
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  const decoded = await admin.auth().verifyIdToken(token);

  req.auth = {
    uid: decoded.uid,
    tenantId: decoded.tenantId,
    role: decoded.role,
  };

  next();
}
