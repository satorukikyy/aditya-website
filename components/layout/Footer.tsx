import Link from 'next/link'
import { personalInfo } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-c-text bg-c-text mt-24">
      <div className="max-w-[760px] mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-[15px] text-c-bg">
          {personalInfo.nickname.toLowerCase()}
          <span className="text-c-yellow">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="/rss.xml"
            className="font-mono text-[11px] font-bold uppercase text-c-bg hover:text-c-yellow transition-colors"
            title="RSS Feed"
          >
            rss
          </a>
          <p className="font-mono text-[11px] text-c-bg/70">
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
