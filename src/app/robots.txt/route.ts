import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /api/
Disallow: /admin/
Disallow: /mypage/
Disallow: /_next/
Disallow: /confirm-email
Disallow: /email-change-success
Disallow: /reset-password
Disallow: /register/thanks
Disallow: /contact/finish
Disallow: /contact_corp_finish
Disallow: /recruiter/finish

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}