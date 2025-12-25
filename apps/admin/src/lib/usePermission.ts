import { useAuth } from "./authContext";
import { Permission } from "@cms/shared";

export function usePermission(permission: Permission) {
  const { claims } = useAuth();

  if (!claims) return false;

  // v1: role-based shortcut
  if (claims.role === "owner" || claims.role === "admin") return true;

  // Later: map role → permissions from Firestore
  console.log(permission);
  return false;
}
