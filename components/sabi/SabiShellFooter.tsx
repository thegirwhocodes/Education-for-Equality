import Image from "next/image";
import Link from "next/link";

export default function SabiShellFooter() {
  return (
    <footer className="mt-auto border-t sabi-shell-footer">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/sabi-spark.svg" alt="" width={24} height={26} className="sabi-spark-mark" />
          <div>
            <p className="sabi-wordmark text-base">Sabi</p>
            <p className="sabi-byline mt-1">by Education for Equality</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--sabi-muted)]">
          <Link href="/sabi" className="hover:text-[var(--sabi-ink)] transition-colors">
            For families
          </Link>
          <Link href="/sabi/pricing" className="hover:text-[var(--sabi-ink)] transition-colors">
            API &amp; pricing
          </Link>
          <a href="mailto:info@eduforequality.org" className="hover:text-[var(--sabi-ink)] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
