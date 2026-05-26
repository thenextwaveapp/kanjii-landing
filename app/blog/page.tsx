import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'Blog | Kanjii',
  description: 'Learn Japanese with tips, guides, and insights from the Kanjii team.',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_time_minutes: number;
  tags: string[];
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at, reading_time_minutes, tags')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EFEFEF]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-5 flex items-center justify-between bg-gradient-to-b from-[rgba(10,10,10,0.95)] to-transparent">
        <Link href="/" className="text-[22px] font-extrabold tracking-tight text-[#EFEFEF]">
          Kanj<span className="text-[#E85D3A]">ii</span>
        </Link>
      </nav>

      {/* HEADER */}
      <section className="pt-36 pb-20 px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#E85D3A] mb-5">
            Kanjii Blog
          </p>
          <h1 className="text-[56px] font-extrabold tracking-[-2px] leading-[1.05] mb-5">
            Learn Japanese.<br />
            <span className="text-[#E85D3A]">Get better every day.</span>
          </h1>
          <p className="text-[17px] text-[#666] leading-[1.65] max-w-[520px]">
            Tips, guides, and insights to help you master Japanese kanji, reading, and typing skills.
          </p>
        </div>
      </section>

      {/* BLOG POSTS */}
      <section className="pb-32 px-12">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#666] text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-16">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="border border-[#222] rounded-3xl p-10 bg-[#111] hover:bg-[#181818] hover:border-[#2a2a2a] transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4 text-sm text-[#666]">
                        <time dateTime={post.published_at}>
                          {formatDate(post.published_at)}
                        </time>
                        {post.reading_time_minutes && (
                          <>
                            <span>•</span>
                            <span>{post.reading_time_minutes} min read</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-[32px] font-extrabold tracking-[-1px] leading-[1.1] mb-3 text-[#EFEFEF] group-hover:text-[#E85D3A] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[16px] text-[#666] leading-[1.65] mb-4">
                        {post.excerpt}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
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
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

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
