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
    <div className="min-h-screen bg-[#0A0A0A] text-[#EFEFEF]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-5 flex items-center justify-between bg-gradient-to-b from-[rgba(10,10,10,0.95)] to-transparent">
        <Link href="/" className="text-[22px] font-extrabold tracking-tight text-[#EFEFEF]">
          Kanj<span className="text-[#E85D3A]">ii</span>
        </Link>
        <Link href="/blog" className="text-sm font-semibold text-[#666] hover:text-[#EFEFEF] transition-colors">
          ← Back to Blog
        </Link>
      </nav>

      {/* ARTICLE */}
      <article className="pt-36 pb-32 px-12">
        <div className="max-w-3xl mx-auto">
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
          <h1 className="text-[56px] font-extrabold tracking-[-2px] leading-[1.05] mb-8">
            {post.title}
          </h1>

          {/* TAGS */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-[rgba(232,93,58,0.12)] text-[#E85D3A] border border-[rgba(232,93,58,0.3)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CONTENT */}
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div
              className="entry-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* BACK TO BLOG */}
          <div className="mt-16 pt-12 border-t border-[#222]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#666] hover:text-[#E85D3A] transition-colors font-semibold"
            >
              ← Back to all posts
            </Link>
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
    </div>
  );
}
