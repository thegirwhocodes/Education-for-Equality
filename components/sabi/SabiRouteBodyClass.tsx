"use client";

import { useEffect } from "react";

/** Hides the global E4E navbar/footer while any /sabi route is mounted. */
export default function SabiRouteBodyClass() {
  useEffect(() => {
    document.body.classList.add("sabi-route");
    return () => document.body.classList.remove("sabi-route");
  }, []);
  return null;
}
