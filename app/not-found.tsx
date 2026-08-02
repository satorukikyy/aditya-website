import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-40 pb-24 text-center">
      <p className="font-display text-[80px] md:text-[110px] leading-none text-c-text mb-6">
        4
        <span className="inline-block bg-c-yellow border-2 border-c-text shadow-brutal px-4 -rotate-2 mx-1">
          0
        </span>
        4
      </p>
      <p className="nb-label mb-8">Page not found</p>
      <p className="font-body text-[15px] text-c-muted mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="nb-btn">
        ← Back to home
      </Link>
    </div>
  )
}
