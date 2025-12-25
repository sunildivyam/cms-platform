"use client"
import RequirePermission from "@/components/RequirePermission";

export default function Settings() {
  return (
    <RequirePermission permission="settings:update">
      <h1>Settings</h1>
    </RequirePermission>
  );
}
