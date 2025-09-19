import { getInterviews } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment instead of using headers
    const isStaging = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview';
    
    // Block sitemap access for staging/development environment
    if (isStaging) {
      return new NextResponse('Sitemap not available for staging environment', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }

    // Get all interviews for sitemap
    const interviewsResponse = await getInterviews({
      page: 1,
      limit: 1000, // Get all interviews for sitemap
    });

    if (!interviewsResponse.InterviewItems) {
      return new NextResponse('Failed to fetch interviews', { status: 500 });
    }

    const interviews = interviewsResponse.InterviewItems;
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';

    // Generate XML sitemap for individual interview pages
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${interviews.map((interview: any) => {
    // Determine the interview type path based on tag
    const interviewTypePath = interview.tag === 1 ? 'career-changer' : 'business';
    return `
  <url>
    <loc>${baseUrl}/interview/${interviewTypePath}/${interview.id}</loc>
    <lastmod>${new Date(interview.created || interview.modified || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating interviews sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
