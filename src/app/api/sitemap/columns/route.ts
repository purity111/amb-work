import { getColumns } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all columns for sitemap
    const columnsResponse = await getColumns({
      page: 1,
      limit: 1000, // Get all columns for sitemap
      searchTerm: '',
      category: ''
    });

    if (!columnsResponse.ColumnItems) {
      return new NextResponse('Failed to fetch columns', { status: 500 });
    }

    const columns = columnsResponse.ColumnItems;
    const baseUrl = process.env.SITE_URL || 'https://app.reuse-tenshoku.com';

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${columns.map((column: any) => `
  <url>
    <loc>${baseUrl}/column/column-${column.id}</loc>
    <lastmod>${new Date(column.created || column.modified || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
    console.error('Error generating columns sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
