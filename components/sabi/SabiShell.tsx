"use client";

import SabiRouteBodyClass from "@/components/sabi/SabiRouteBodyClass";
import SabiShellFooter from "@/components/sabi/SabiShellFooter";
import SabiShellNav from "@/components/sabi/SabiShellNav";

export default function SabiShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`sabi-shell ${className}`}>
      <SabiRouteBodyClass />
      <SabiShellNav />
      {children}
      <SabiShellFooter />
    </div>
  );
}
