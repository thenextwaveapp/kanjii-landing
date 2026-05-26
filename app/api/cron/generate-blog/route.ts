import { NextResponse } from 'next/server';

export const runtime = 'edge';

// This endpoint is called by Vercel Cron every Monday at 9 AM UTC
export async function GET(request: Request) {
  try {
    // Verify this is coming from Vercel Cron
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the blog generation API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/generate-blog`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Blog generation failed: ${JSON.stringify(data)}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Monday blog post generated successfully',
      data
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
