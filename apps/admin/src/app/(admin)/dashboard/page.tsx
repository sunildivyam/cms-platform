"use client"

import { auth } from "@/lib/firebase";
import { IdTokenResult } from "firebase/auth";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    auth.currentUser?.getIdTokenResult().then((token: IdTokenResult) => {
      console.log(token);
    });

  }, []);

  return <h1>Admin Dashboard</h1>;
}
