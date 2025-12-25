import { Response, NextFunction } from "express";
import { AuthedRequest } from "./requireAuth";
import { UserRole } from "@cms/shared";

export function requireRole(roles: Array<UserRole>) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
