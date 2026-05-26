import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  reading_time_minutes: number;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  // Increment view count
  await supabase.rpc('increment_blog_post_views', { post_slug: slug });

  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Kanjii',
    };
  }

  return {
    title: post.meta_title || `${post.title} | Kanjii Blog`,
    description: post.meta_description || post.excerpt,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-5 flex items-center justify-between bg-gradient-to-b from-[rgba(10,10,10,0.95)] to-transparent backdrop-blur-sm">
        <Link href="/" className="text-[22px] font-extrabold tracking-tight text-[#EFEFEF]">
          Kanj<span className="text-[#E85D3A]">ii</span>
        </Link>
        <Link href="/blog" className="text-sm font-semibold text-[#666] hover:text-[#EFEFEF] transition-colors">
          ← Back to Blog
        </Link>
      </nav>

      {/* HERO IMAGE */}
      <div className="pt-24">
        <div className="w-full h-[400px] bg-gradient-to-br from-[#E85D3A] via-[#ff7a5c] to-[#E85D3A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-white" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              漢字
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE */}
      <article className="relative -mt-20 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* WHITE CONTENT CARD */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            {/* META */}
            <div className="flex items-center gap-3 mb-6 text-sm text-[#666]">
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
              {post.reading_time_minutes && (
                <>
                  <span>•</span>
                  <span>{post.reading_time_minutes} min read</span>
                </>
              )}
              <span>•</span>
              <span>{post.author}</span>
            </div>

            {/* TITLE */}
            <h1 className="text-[48px] md:text-[56px] font-extrabold tracking-[-2px] leading-[1.05] mb-6 text-[#111]">
              {post.title}
            </h1>

            {/* TAGS */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-[#e5e5e5]">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-[#fff5f2] text-[#E85D3A] border border-[#ffd4c9] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CONTENT - Styled with entry-content class */}
            <div
              className="entry-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* BACK TO BLOG */}
            <div className="mt-16 pt-12 border-t border-[#e5e5e5]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#666] hover:text-[#E85D3A] transition-colors font-semibold text-[15px]"
              >
                ← Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* FOOTER */}
      <footer className="border-t border-[#222] px-12 py-10 flex items-center justify-between">
        <div className="text-[18px] font-extrabold text-[#EFEFEF] tracking-tight">
          Kanj<span className="text-[#E85D3A]">ii</span>
        </div>
        <div className="text-[13px] text-[#444]">© 2026 Kanjii</div>
      </footer>

      <style jsx global>{`
        .entry-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif;
          color: #1a1a1a;
        }

        .entry-content p {
          font-size: 18px;
          line-height: 32px;
          margin-bottom: 24px;
          color: #374151;
        }

        .entry-content h2 {
          font-size: 36px;
          font-weight: 800;
          line-height: 1.2;
          margin-top: 48px;
          margin-bottom: 24px;
          color: #111;
          letter-spacing: -0.5px;
        }

        .entry-content h3 {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 36px;
          margin-bottom: 16px;
          color: #1a1a1a;
        }

        .entry-content strong {
          font-weight: 600;
          color: #111;
        }

        .entry-content em {
          font-style: italic;
          color: #4b5563;
        }

        .entry-content a {
          color: #E85D3A;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .entry-content a:hover {
          border-bottom-color: #E85D3A;
        }

        .entry-content ul,
        .entry-content ol {
          margin: 24px 0;
          padding-left: 28px;
        }

        .entry-content li {
          font-size: 18px;
          line-height: 32px;
          margin-bottom: 12px;
          color: #374151;
        }

        .entry-content code {
          background: #f3f4f6;
          color: #E85D3A;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 16px;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }

        .entry-content pre {
          background: #1a1a1a;
          color: #e5e7eb;
          padding: 24px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 32px 0;
        }

        .entry-content pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        .entry-content blockquote {
          border-left: 4px solid #E85D3A;
          padding-left: 24px;
          margin: 32px 0;
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}
