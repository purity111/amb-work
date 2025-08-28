/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://reuse-tenshoku.com/',
  generateRobotsTxt: false, // Disable since we have dynamic robots.txt
  generateIndexSitemap: false, // Disable since we have dynamic sitemaps
  outDir: 'public',
  exclude: [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/404',
    '/500',
    '/mypage/*',
    '/confirm-email',
    '/email-change-success',
    '/reset-password',
    '/register/thanks',
    '/contact/finish',
    '/contact_corp_finish',
    '/recruiter/finish'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/admin/*',
          '/mypage/*',
          '/_next/*',
          '/confirm-email',
          '/email-change-success',
          '/reset-password',
          '/register/thanks',
          '/contact/finish',
          '/contact_corp_finish',
          '/recruiter/finish'
        ]
      }
    ]
  }
}