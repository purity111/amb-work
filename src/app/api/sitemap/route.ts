import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Only block for explicit staging domains, allow local development
    const isExplicitStaging = process.env.VERCEL_ENV === 'preview';
    
    if (isExplicitStaging) {
      return new NextResponse('Sitemap not available for staging environment', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }
    
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
    const currentDate = new Date().toISOString();

    // Define static pages with their priorities and change frequencies
    const staticPages = [
      // Core pages
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/job-openings', priority: '0.9', changefreq: 'daily' },
      
      // Career counseling services (high priority)
      { path: '/career-counseling', priority: '0.8', changefreq: 'monthly' },
      { path: '/experience', priority: '0.8', changefreq: 'monthly' },
      { path: '/inexperience', priority: '0.8', changefreq: 'monthly' },
      { path: '/mid-high', priority: '0.8', changefreq: 'monthly' },
      
      // Business and industry information
      { path: '/business', priority: '0.7', changefreq: 'monthly' },
      { path: '/business/business-new', priority: '0.7', changefreq: 'monthly' },
      { path: '/works', priority: '0.7', changefreq: 'monthly' },
      { path: '/qualifications', priority: '0.7', changefreq: 'monthly' },
      { path: '/simplified-test', priority: '0.7', changefreq: 'monthly' },
      
      // Interview and content pages
      { path: '/interview/business', priority: '0.7', changefreq: 'weekly' },
      { path: '/interview/career-changer', priority: '0.7', changefreq: 'weekly' },
      { path: '/column', priority: '0.7', changefreq: 'weekly' },
      
      // Company and contact
      { path: '/company', priority: '0.6', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/recruiter', priority: '0.6', changefreq: 'monthly' },
      
      // Legal pages (low priority)
      { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms', priority: '0.3', changefreq: 'yearly' }
    ];

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
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
    console.error('Error generating main sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
