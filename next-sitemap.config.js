/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://reuse-tenshoku.com/',
  generateRobotsTxt: false, // Disable since we have dynamic robots.txt
  generateIndexSitemap: false,
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
  },
  transform: async (config, path) => {
    // Custom transform function for dynamic paths
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      }
    }
    
    // Job-related pages
    if (path.startsWith('/job-openings')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString()
      }
    }
    
    // Column pages
    if (path.startsWith('/column')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      }
    }
    
    // Static pages
    if (['/about', '/business', '/business-new', '/career-counseling', '/company', '/contact', '/experience', '/inexperience', '/interview', '/mid-high', '/qualifications', '/recruiter', '/works'].includes(path)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString()
      }
    }
    
    // Default values
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString()
    }
  }
}