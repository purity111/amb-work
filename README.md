This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Favicon Configuration

This project includes comprehensive favicon support for all browsers and devices:

### Favicon Files
- `/public/favicon.ico` - Standard favicon for all browsers
- `/public/favicon-32x32.png` - 32x32 PNG favicon
- `/public/favicon-180x180.png` - 180x180 PNG favicon for high-DPI displays
- `/src/app/favicon.ico` - Next.js app directory favicon

### Web App Manifest
- `/public/manifest.json` - Web app manifest for PWA support

### Browser Support
The favicon configuration includes support for:
- All modern browsers (Chrome, Firefox, Safari, Edge)
- iOS devices (Apple Touch Icons)
- Android devices (Web App Manifest)
- Windows tiles (Microsoft Tile Image)
- High-DPI displays

### Implementation
Favicon configuration is implemented in `src/app/layout.tsx` with comprehensive meta tags and link elements for maximum compatibility across all devices and browsers.

## Page Titles and SEO

This project includes comprehensive title and SEO management:

### Title Configuration
- **Main Layout**: Base title and SEO meta tags in `src/app/layout.tsx`
- **Page Titles**: Dynamic titles defined in `src/utils/titles.ts`
- **PageTitle Component**: Client-side title management in `src/components/PageTitle.tsx`

### SEO Features
- **Dynamic Titles**: Page-specific titles for better SEO
- **Meta Descriptions**: Unique descriptions for each page
- **Keywords**: Targeted keywords for search optimization
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Canonical URLs**: Prevents duplicate content issues

### Usage Examples
```tsx
// Using PageTitle component
import PageTitle from '@/components/PageTitle';
import { getPageTitle } from '@/utils/titles';

export default function MyPage() {
  const pageInfo = getPageTitle('mypage');
  
  return (
    <>
      <PageTitle 
        title={pageInfo.title}
        description={pageInfo.description}
        keywords={pageInfo.keywords}
      />
      {/* Page content */}
    </>
  );
}
```

### Available Page Titles
- `home` - Homepage
- `about` - Company information
- `jobs` - Job listings
- `jobOpenings` - Job openings
- `mypage` - User dashboard
- `mypageProfile` - Profile editing
- `mypageApplications` - Application management
- `mypageFavorites` - Favorite jobs
- `business` - Business services
- `careerCounseling` - Career counseling
- `contact` - Contact page
- `privacy` - Privacy policy
- `terms` - Terms of service
