import Link from "next/link";
import { SabiMark } from "@/components/sabi/SabiLogo";

export default function SabiShellFooter() {
  return (
    <footer className="mt-auto sabi-shell-footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <SabiMark size={40} tone="yellow" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed sabi-footer-lede">
              A free tutor any child can reach by calling a phone number. Built in Lagos by{" "}
              <a href="https://eduforequality.org" className="underline underline-offset-4">
                Education for Equality
              </a>
              , a 501(c)(3) nonprofit.
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-7">
            <p className="sabi-footer-heading">Sabi</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link href="/sabi">For families</Link></li>
              <li><Link href="/demo">Talk to Sabi</Link></li>
              <li><Link href="/chat">Chat with Sabi</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="sabi-footer-heading">Build &amp; partner</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link href="/sabi/pricing">API &amp; pricing</Link></li>
              <li><Link href="/sabi/developers">Developer access</Link></li>
              <li><a href="mailto:info@eduforequality.org">info@eduforequality.org</a></li>
            </ul>
          </div>
        </div>

        <p className="sabi-footer-wordmark" aria-hidden="true">sabi</p>

        <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs sabi-footer-meta">
          <span>/sah-bee/ &mdash; &ldquo;to know&rdquo; in Nigerian Pidgin</span>
          <span>&copy; {new Date().getFullYear()} Education for Equality</span>
        </div>
      </div>
    </footer>
  );
}
