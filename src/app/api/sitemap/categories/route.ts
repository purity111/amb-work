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

    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
    const currentDate = new Date().toISOString();

    // Job categories for category pages (without parameters)
    const jobCategories = [
      '鑑定士・査定士',
      'バイヤー', 
      '店舗スタッフ・店長',
      '販売',
      '出張買取、訪問買取',
      'EC運営・通販',
      '買取・査定',
      '個人営業',
      '本社部門'
    ];

    // Major prefecture/location pages (without parameters)
    const majorLocations = [
      '東京',
      '大阪',
      '愛知',
      '神奈川',
      '埼玉',
      '千葉',
      '福岡',
      '北海道',
      '兵庫',
      '京都'
    ];

    // Generate category URLs - these are static category pages, not job detail pages
    const categoryUrls = jobCategories.map(category => ({
      path: `/job-openings/${encodeURIComponent(category)}`,
      priority: '0.7',
      changefreq: 'daily'
    }));

    // Generate location URLs - these are static location pages, not job detail pages
    const locationUrls = majorLocations.map(location => ({
      path: `/job-openings/${encodeURIComponent(location)}`,
      priority: '0.7', 
      changefreq: 'daily'
    }));

    const allCategoryPages = [...categoryUrls, ...locationUrls];

    // Debug logging
    console.log('Generated category URLs:', categoryUrls.length);
    console.log('Generated location URLs:', locationUrls.length);
    console.log('Total category pages:', allCategoryPages.length);
    console.log('Sample URLs:', allCategoryPages.slice(0, 3).map(p => p.path));

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allCategoryPages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating categories sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
