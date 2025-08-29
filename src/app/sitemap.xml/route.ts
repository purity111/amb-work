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
    
    // For production, redirect to the API route
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
    return NextResponse.redirect(`${baseUrl}/api/sitemap`);
    
  } catch (error) {
    console.error('Error in sitemap.xml route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
