"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/lib/authContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setLoading(false);
    });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <AuthProvider>{children}</AuthProvider>;
}
