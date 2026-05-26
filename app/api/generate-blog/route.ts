import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// Only allow this route to be called from Vercel Cron or with auth header
export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface BlogPostContent {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  reading_time_minutes: number;
  featured_image_url: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function generateBlogPost(): Promise<BlogPostContent> {
  const topics = [
    { topic: 'effective kanji learning strategies', imageQuery: 'japanese calligraphy writing' },
    { topic: 'how to master Japanese IME typing', imageQuery: 'japanese keyboard typing' },
    { topic: 'JLPT preparation tips and techniques', imageQuery: 'student studying japanese' },
    { topic: 'understanding Japanese grammar patterns', imageQuery: 'japanese textbook learning' },
    { topic: 'common mistakes Japanese learners make', imageQuery: 'frustrated student studying' },
    { topic: 'how to improve Japanese reading speed', imageQuery: 'person reading japanese book' },
    { topic: 'building a sustainable Japanese study routine', imageQuery: 'organized study desk japanese' },
    { topic: 'the importance of context in kanji learning', imageQuery: 'japanese characters context' },
    { topic: 'comparing different Japanese learning methods', imageQuery: 'language learning methods' },
    { topic: 'cultural insights for Japanese learners', imageQuery: 'japanese culture temple' }
  ];

  const randomTopicObj = topics[Math.floor(Math.random() * topics.length)];
  const randomTopic = randomTopicObj.topic;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are a Japanese language learning expert writing for the Kanjii blog. Kanjii is an app that teaches Japanese through typing real sentences with a Japanese IME (Input Method Editor), focusing on kanji mastery and JLPT progression.

Write a comprehensive, engaging blog post about: "${randomTopic}"

Requirements:
1. Write in a friendly, encouraging tone
2. Include practical, actionable advice
3. Reference how Kanjii's approach (typing practice, IME usage, kanji library, JLPT structure) relates to the topic when relevant
4. Use HTML formatting (h2, h3, p, strong, em, ul, ol tags only)
5. Make it 600-1000 words
6. Include 2-4 relevant tags (lowercase, no spaces, use hyphens)

Format your response as JSON:
{
  "title": "Engaging blog post title (50-70 characters)",
  "content": "Full HTML content of the blog post",
  "excerpt": "Compelling 150-character summary",
  "tags": ["tag1", "tag2", "tag3"]
}`
      }
    ],
  });

  const textContent = response.content[0].type === 'text' ? response.content[0].text : '';

  // Extract JSON from the response (handle potential markdown code blocks)
  const jsonMatch = textContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  const blogData = JSON.parse(jsonMatch[0]);
  const reading_time = estimateReadingTime(blogData.content);

  // Pick a relevant Unsplash image
  const imageUrl = `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1528164344705-47542687000d' : '1490376840353-1171d95b27a4'}?w=1200&h=500&fit=crop&q=80`;

  return {
    ...blogData,
    reading_time_minutes: reading_time,
    featured_image_url: imageUrl
  };
}

export async function POST(request: Request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate blog post content
    const blogPost = await generateBlogPost();
    const slug = slugify(blogPost.title);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      // Add timestamp to make slug unique
      const uniqueSlug = `${slug}-${Date.now()}`;

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: blogPost.title,
          slug: uniqueSlug,
          content: blogPost.content,
          excerpt: blogPost.excerpt,
          tags: blogPost.tags,
          reading_time_minutes: blogPost.reading_time_minutes,
          featured_image_url: blogPost.featured_image_url,
          status: 'published',
          published_at: new Date().toISOString(),
          meta_title: blogPost.title,
          meta_description: blogPost.excerpt
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        post: data,
        message: 'Blog post generated and published successfully'
      });
    }

    // Insert new blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: blogPost.title,
        slug,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        tags: blogPost.tags,
        reading_time_minutes: blogPost.reading_time_minutes,
        featured_image_url: blogPost.featured_image_url,
        status: 'published',
        published_at: new Date().toISOString(),
        meta_title: blogPost.title,
        meta_description: blogPost.excerpt
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      post: data,
      message: 'Blog post generated and published successfully'
    });

  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
