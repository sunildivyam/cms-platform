export interface User {
  id: string;
  email: string;
  role: string;
  status: "active" | "invited" | "disabled";
  tenantId: string;
}

export type UserRole = "admin" | "owner" | "editor" | "author" | "reader";
