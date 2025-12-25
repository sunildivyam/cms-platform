"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { useState } from "react";

export default function ContentTypes() {
  const [json, setJson] = useState("");

  async function create() {
    const fn = httpsCallable(functions, "createContentType");
    await fn(JSON.parse(json));
    alert("Created");
  }

  return (
    <div>
      <textarea
        rows={20}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button onClick={create}>Create Content Type</button>
    </div>
  );
}
