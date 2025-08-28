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
    
    // For production, redirect to the API route
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
    return NextResponse.redirect(`${baseUrl}/api/sitemap`);
    
  } catch (error) {
    console.error('Error in sitemap.xml route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
