# Automated Blog System Setup

This document explains the automated blog system that generates and publishes Japanese learning content every Monday.

## Overview

The blog system automatically:
- Generates high-quality blog posts about Japanese learning topics using Claude AI
- Publishes them every Monday at 9 AM UTC
- Includes SEO optimization with meta tags, sitemaps, and structured content
- Tracks analytics (view counts, reading time)

## Architecture

### Database (Supabase)
- **Table**: `blog_posts`
- **Schema**: Located in `supabase/blog-schema.sql`
- **Features**:
  - Full-text content storage with HTML formatting
  - Tag support for categorization
  - View counting via RPC function
  - Row Level Security (RLS) for public read access

### Frontend Pages
- **Blog List**: `/app/blog/page.tsx` - Shows all published posts
- **Individual Post**: `/app/blog/[slug]/page.tsx` - Displays full post content
- **Styling**: Tailwind CSS with dark theme matching landing page

### API Routes
- **Generation**: `/app/api/generate-blog/route.ts` - AI-powered content generation
- **Cron Endpoint**: `/app/api/cron/generate-blog/route.ts` - Vercel Cron trigger

### Automation
- **Schedule**: Every Monday at 9 AM UTC
- **Configuration**: `vercel.json` - Vercel Cron setup
- **Security**: CRON_SECRET environment variable for authorization

## Setup Instructions

### 1. Database Setup
The blog schema has already been applied to your Supabase project. To verify:

```sql
SELECT * FROM blog_posts LIMIT 1;
```

### 2. Environment Variables
Add these to your `.env.local` and Vercel project settings:

```bash
# Anthropic API (get from https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Cron Secret (generate a random string)
CRON_SECRET=$(openssl rand -base64 32)
```

### 3. Vercel Setup
1. Deploy to Vercel
2. Add environment variables in Project Settings → Environment Variables:
   - `ANTHROPIC_API_KEY`
   - `CRON_SECRET`
3. Vercel will automatically detect `vercel.json` and set up the cron job

### 4. Testing

#### Manual Blog Generation
Test the generation endpoint locally:

```bash
curl -X POST http://localhost:3000/api/generate-blog \
  -H "Authorization: Bearer your-cron-secret" \
  -H "Content-Type: application/json"
```

#### Check Cron Logs
After deployment, monitor cron execution in Vercel dashboard:
- Project → Deployments → [Latest] → Functions → Cron

## Content Topics

The AI generates posts about:
- Effective kanji learning strategies
- How to master Japanese IME typing
- JLPT preparation tips
- Understanding Japanese grammar patterns
- Common mistakes Japanese learners make
- How to improve Japanese reading speed
- Building sustainable study routines
- The importance of context in kanji learning
- Comparing different learning methods
- Cultural insights for Japanese learners

## Customization

### Change Publishing Schedule
Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-blog",
      "schedule": "0 9 * * 1"  // Change this cron expression
    }
  ]
}
```

Cron format: `minute hour day-of-month month day-of-week`
- Current: Monday 9 AM UTC (`0 9 * * 1`)
- Daily: `0 9 * * *`
- Twice a week: `0 9 * * 1,4` (Mon & Thu)

### Modify Content Topics
Edit the `topics` array in `/app/api/generate-blog/route.ts:54`

### Adjust AI Model
Change the model in `/app/api/generate-blog/route.ts:73`:
```typescript
model: 'claude-3-5-sonnet-20241022', // or 'claude-opus-4-6' for higher quality
```

## SEO Features

### Automatic Sitemap
Blog posts are automatically included in `/sitemap.xml` via `/app/sitemap.ts`

### Meta Tags
- Title: `{post.title} | Kanjii Blog`
- Description: Post excerpt
- Open Graph tags inherited from layout

### Internal Linking
- Blog link in main nav
- Blog link in footer
- "Back to blog" links on post pages

## Analytics

### View Tracking
View counts are automatically incremented when a post is viewed:
```sql
SELECT slug, title, view_count FROM blog_posts ORDER BY view_count DESC;
```

### Reading Time
Automatically calculated based on word count (200 words/minute)

## Troubleshooting

### Cron Not Running
1. Check Vercel logs for errors
2. Verify `CRON_SECRET` matches in both route and Vercel env vars
3. Ensure cron job is enabled in Vercel dashboard

### Blog Not Generating
1. Check `ANTHROPIC_API_KEY` is valid
2. Verify Supabase connection (check service role key)
3. Check API logs in Vercel Functions tab

### Posts Not Displaying
1. Verify posts have `status = 'published'`
2. Check `published_at` is set (not null)
3. Test Supabase RLS policies:
```sql
SET ROLE anon;
SELECT * FROM blog_posts WHERE status = 'published';
```

## Manual Operations

### Create Draft Post
```sql
INSERT INTO blog_posts (title, slug, content, excerpt, status)
VALUES (
  'My Post Title',
  'my-post-title',
  '<h2>Content here</h2>',
  'Short excerpt',
  'draft'
);
```

### Publish Draft
```sql
UPDATE blog_posts
SET status = 'published', published_at = NOW()
WHERE slug = 'my-post-title';
```

### Delete Post
```sql
UPDATE blog_posts SET status = 'archived' WHERE slug = 'post-slug';
-- or permanently delete:
DELETE FROM blog_posts WHERE slug = 'post-slug';
```

## Cost Considerations

### Anthropic API
- Claude Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Typical blog post: ~1,500 output tokens (~$0.02 per post)
- Weekly cost: ~$0.08/month

### Vercel Cron
- Free tier: 100 invocations/day
- Pro: Unlimited cron jobs

### Supabase
- Free tier: 500MB database
- Blog posts are small (~5-10KB each)
- Thousands of posts fit in free tier

## Future Enhancements

Possible improvements:
- [ ] Add categories/series for related posts
- [ ] RSS feed generation
- [ ] Email newsletter integration
- [ ] Related posts suggestions
- [ ] Comments system
- [ ] Social sharing buttons
- [ ] Search functionality
- [ ] Draft preview mode
- [ ] Author profiles
- [ ] Featured images

## Support

For issues or questions:
- Check logs in Vercel dashboard
- Review Supabase logs
- Test API endpoints manually
- Contact: Your team
