import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
    const currentDate = new Date().toISOString();

    // Generate sitemap index XML that references all our dynamic sitemaps
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/sitemap</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/jobs</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/categories</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/columns</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap/interviews</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}