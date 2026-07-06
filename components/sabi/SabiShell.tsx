"use client";

import SabiRouteBodyClass from "@/components/sabi/SabiRouteBodyClass";
import SabiShellFooter from "@/components/sabi/SabiShellFooter";
import SabiShellNav from "@/components/sabi/SabiShellNav";

export default function SabiShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sabi-shell">
      <SabiRouteBodyClass />
      <SabiShellNav />
      {children}
      <SabiShellFooter />
    </div>
  );
}
