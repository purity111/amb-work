import { getJobs } from '@/lib/api';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Check if this is the staging domain
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const isStaging = host.startsWith("app.");
    
    // Block sitemap access for staging domain
    if (isStaging) {
      return new NextResponse('Sitemap not available for staging environment', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }
    // Get all jobs for sitemap
    const jobsResponse = await getJobs(
      1, // page
      1000, // limit
      '', // searchTerm
      undefined, // jobType
      '0', // isAdmin
      undefined, // companyID
      undefined, // employer_id
      [], // features
      [], // prefectures
      undefined, // public_status
      undefined, // sortBy
      0 // recommend
    );

    if (!jobsResponse.success || !jobsResponse.data?.jobs) {
      return new NextResponse('Failed to fetch jobs', { status: 500 });
    }

    const jobs = jobsResponse.data.jobs;
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${jobs.map((job: any) => `
  <url>
    <loc>${baseUrl}/job-openings/recruit/${job.id}</loc>
    <lastmod>${new Date(job.created).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
    console.error('Error generating jobs sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
