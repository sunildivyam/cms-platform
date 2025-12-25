"use client";

import { usePermission } from "@/lib/usePermission";
import { Permission } from "@cms/shared";

export default function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const allowed = usePermission(permission);

  if (!allowed) return <div>Access denied</div>;

  return <>{children}</>;
}
