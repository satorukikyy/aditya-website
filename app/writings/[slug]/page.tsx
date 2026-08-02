import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { writings } from '@/lib/data'
import registry from '@/lib/writingRegistry'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return writings.filter(p => !p.draft).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = writings.find(p => p.slug === slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/writings/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/writings/${post.slug}`,
      publishedTime: `${post.date}-01`,
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  }
}

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default async function WritingPost({ params }: Props) {
  const { slug } = await params
  const post = writings.find(p => p.slug === slug && !p.draft)
  if (!post) notFound()

  const loader = registry[slug]
  if (!loader) notFound()
  const { default: Content } = await loader()

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onerrorkx.pages.dev'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: `${post.date}-01`,
    inLanguage: 'en',
    keywords: post.tags.join(', '),
    url: `${base}/writings/${post.slug}`,
    mainEntityOfPage: `${base}/writings/${post.slug}`,
    author: { '@id': `${base}/#person` },
    publisher: { '@id': `${base}/#person` },
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/writings" className="nb-chip hover:bg-c-yellow transition-colors mb-12 inline-block">
        ← writings
      </Link>

      <div className="mb-10">
        <h1 className="font-body font-bold text-[26px] md:text-[32px] leading-[1.25] tracking-tight text-c-text mb-5">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="nb-chip bg-c-yellow">{formatDate(post.date)}</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] font-bold uppercase border-2 border-c-text px-1.5 py-0.5 bg-c-bg">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-t-[3px] border-c-text mb-10" />

      <div className="prose-writings">
        <Content />
      </div>
    </div>
  )
}
