import React, { useEffect, useState } from "react";
import { requireAuth } from "../../../lib/guards";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requireAuth("admin");
    setReady(true);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
