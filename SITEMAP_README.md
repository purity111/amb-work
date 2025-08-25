# Sitemap Implementation

This project includes a comprehensive sitemap solution for better SEO and search engine crawling.

## Features

- **Static Sitemap**: Covers all static pages with appropriate priorities
- **Dynamic Job Sitemap**: Automatically generates sitemap entries for all job postings
- **Dynamic Column Sitemap**: Automatically generates sitemap entries for all column articles
- **Robots.txt**: Properly configured with sitemap references
- **Automatic Generation**: Sitemaps are generated automatically after each build

## Configuration

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
SITE_URL=https://yourdomain.com
```

### 2. Build Process

The sitemap generation is automatically triggered after each build:

```bash
npm run build
```

This will:
1. Build your Next.js application
2. Automatically run `next-sitemap` to generate static sitemaps
3. Create sitemap files in the `public` directory

## Sitemap Structure

### Main Sitemap (`/api/sitemap`)
- Static pages (home, about, business, etc.)
- Priority: 0.3 - 1.0
- Change frequency: daily to yearly

### Jobs Sitemap (`/api/sitemap/jobs`)
- All job posting pages
- Priority: 0.8
- Change frequency: daily
- Automatically updated with new jobs

### Columns Sitemap (`/api/sitemap/columns`)
- All column/article pages
- Priority: 0.7
- Change frequency: weekly
- Automatically updated with new columns

### Sitemap Index (`/api/sitemap/index`)
- References all individual sitemaps
- Used by search engines to discover all sitemaps

## URLs

- **Main Sitemap**: `https://yourdomain.com/api/sitemap`
- **Jobs Sitemap**: `https://yourdomain.com/api/sitemap/jobs`
- **Columns Sitemap**: `https://yourdomain.com/api/sitemap/columns`
- **Sitemap Index**: `https://yourdomain.com/api/sitemap/index`
- **Robots.txt**: `https://yourdomain.com/robots.txt`

## Customization

### Adding New Static Pages

Edit `src/app/api/sitemap/route.ts` and add new pages to the `staticPages` array:

```typescript
{ path: '/new-page', priority: '0.6', changefreq: 'monthly' }
```

### Modifying Priorities

Adjust the priority values in the sitemap files:
- **1.0**: Homepage (highest priority)
- **0.8-0.9**: Important pages (jobs, main services)
- **0.6-0.7**: Regular content pages
- **0.3-0.5**: Legal pages, less important content

### Change Frequencies

- **daily**: Homepage, job listings
- **weekly**: Columns, articles
- **monthly**: Static pages, services
- **yearly**: Legal pages, terms

## SEO Benefits

1. **Better Crawling**: Search engines can discover all pages efficiently
2. **Faster Indexing**: New content is found quickly
3. **Priority Indication**: Search engines know which pages are most important
4. **Update Frequency**: Search engines know how often to check for updates

## Testing

After building, you can test the sitemaps by visiting:

1. `http://localhost:3000/api/sitemap` (main sitemap)
2. `http://localhost:3000/api/sitemap/jobs` (jobs sitemap)
3. `http://localhost:3000/api/sitemap/columns` (columns sitemap)
4. `http://localhost:3000/robots.txt` (robots file)

## Troubleshooting

### Sitemap Not Generating
- Ensure `next-sitemap` is installed: `npm install next-sitemap`
- Check that the `postbuild` script is in package.json
- Verify the `next-sitemap.config.js` file exists

### API Routes Not Working
- Ensure the API routes are in the correct directory structure
- Check that the functions are properly exported
- Verify the database connections in the API routes

### Robots.txt Not Accessible
- Ensure the file is in the `public` directory
- Check that the file permissions are correct
- Verify the file is being served by Next.js

## Maintenance

- **Automatic Updates**: Job and column sitemaps update automatically
- **Manual Updates**: Static page sitemap updates when you rebuild
- **Monitoring**: Check sitemap accessibility in Google Search Console
- **Validation**: Use online sitemap validators to ensure proper XML format
