import { NextResponse } from 'next/server';
import { getJobs, getColumns, getInterviews } from '@/lib/api';

export async function GET() {
  try {
    const baseUrl = process.env.SITE_URL || 'https://reuse-tenshoku.com';
    const currentDate = new Date().toISOString();

    // 1. Static pages
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

    // 2. Job categories and locations
    const jobCategories = [
      '鑑定士・査定士', 'バイヤー', '店舗スタッフ・店長', '販売',
      '出張買取、訪問買取', 'EC運営・通販', '買取・査定', '個人営業', '本社部門'
    ];
    const majorLocations = [
      '東京', '大阪', '愛知', '神奈川', '埼玉', '千葉', '福岡', '北海道', '兵庫', '京都'
    ];
    const categoryPages = [
      ...jobCategories.map(cat => ({ path: `/job-openings/${encodeURIComponent(cat)}`, priority: '0.7', changefreq: 'daily' })),
      ...majorLocations.map(loc => ({ path: `/job-openings/${encodeURIComponent(loc)}`, priority: '0.7', changefreq: 'daily' }))
    ];

    // 3. Location-Category combination pages
    const locationCategoryCombinations = [
      // 北海道 combinations
      { location: '北海道', category: '買取' },
      { location: '北海道', category: '買取', subcategory: 'ブランド' },
      { location: '北海道', category: '買取', subcategory: 'アパレル' },
      { location: '北海道', category: '買取', subcategory: 'ジュエリー' },
      { location: '北海道', category: '買取', subcategory: '時計' },
      { location: '北海道', category: '買取', subcategory: '未経験' },
      { location: '北海道', category: '買取', subcategory: 'インセンティブ' },
      { location: '北海道', category: '買取', subcategory: '正社員' },
      { location: '北海道', category: 'バイヤー' },
      { location: '北海道', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '北海道', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '北海道', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '北海道', category: 'バイヤー', subcategory: '時計' },
      { location: '北海道', category: 'バイヤー', subcategory: '未経験' },
      { location: '北海道', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '北海道', category: 'バイヤー', subcategory: '正社員' },
      { location: '北海道', category: '鑑定士' },
      
      // 埼玉 combinations
      { location: '埼玉', category: '買取' },
      { location: '埼玉', category: '買取', subcategory: 'ブランド' },
      { location: '埼玉', category: '買取', subcategory: 'アパレル' },
      { location: '埼玉', category: '買取', subcategory: 'ジュエリー' },
      { location: '埼玉', category: '買取', subcategory: '時計' },
      { location: '埼玉', category: '買取', subcategory: '未経験' },
      { location: '埼玉', category: '買取', subcategory: 'インセンティブ' },
      { location: '埼玉', category: '買取', subcategory: '正社員' },
      { location: '埼玉', category: 'バイヤー' },
      { location: '埼玉', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '埼玉', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '埼玉', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '埼玉', category: 'バイヤー', subcategory: '時計' },
      { location: '埼玉', category: 'バイヤー', subcategory: '未経験' },
      { location: '埼玉', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '埼玉', category: 'バイヤー', subcategory: '正社員' },
      { location: '埼玉', category: '鑑定士' },
      
      // 千葉 combinations
      { location: '千葉', category: '買取' },
      { location: '千葉', category: '買取', subcategory: 'ブランド' },
      { location: '千葉', category: '買取', subcategory: 'アパレル' },
      { location: '千葉', category: '買取', subcategory: 'ジュエリー' },
      { location: '千葉', category: '買取', subcategory: '時計' },
      { location: '千葉', category: '買取', subcategory: '未経験' },
      { location: '千葉', category: '買取', subcategory: 'インセンティブ' },
      { location: '千葉', category: '買取', subcategory: '正社員' },
      { location: '千葉', category: 'バイヤー' },
      { location: '千葉', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '千葉', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '千葉', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '千葉', category: 'バイヤー', subcategory: '時計' },
      { location: '千葉', category: 'バイヤー', subcategory: '未経験' },
      { location: '千葉', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '千葉', category: 'バイヤー', subcategory: '正社員' },
      { location: '千葉', category: '鑑定士' },
      
      // 東京 combinations
      { location: '東京', category: '買取' },
      { location: '東京', category: '買取', subcategory: 'ブランド' },
      { location: '東京', category: '買取', subcategory: 'アパレル' },
      { location: '東京', category: '買取', subcategory: 'ジュエリー' },
      { location: '東京', category: '買取', subcategory: '時計' },
      { location: '東京', category: '買取', subcategory: '未経験' },
      { location: '東京', category: '買取', subcategory: 'インセンティブ' },
      { location: '東京', category: '買取', subcategory: '正社員' },
      { location: '東京', category: 'バイヤー' },
      { location: '東京', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '東京', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '東京', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '東京', category: 'バイヤー', subcategory: '時計' },
      { location: '東京', category: 'バイヤー', subcategory: '未経験' },
      { location: '東京', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '東京', category: 'バイヤー', subcategory: '正社員' },
      { location: '東京', category: '鑑定士' },
      
      // 神奈川 combinations
      { location: '神奈川', category: '買取' },
      { location: '神奈川', category: '買取', subcategory: 'ブランド' },
      { location: '神奈川', category: '買取', subcategory: 'アパレル' },
      { location: '神奈川', category: '買取', subcategory: 'ジュエリー' },
      { location: '神奈川', category: '買取', subcategory: '時計' },
      { location: '神奈川', category: '買取', subcategory: '未経験' },
      { location: '神奈川', category: '買取', subcategory: 'インセンティブ' },
      { location: '神奈川', category: '買取', subcategory: '正社員' },
      { location: '神奈川', category: 'バイヤー' },
      { location: '神奈川', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '神奈川', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '神奈川', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '神奈川', category: 'バイヤー', subcategory: '時計' },
      { location: '神奈川', category: 'バイヤー', subcategory: '未経験' },
      { location: '神奈川', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '神奈川', category: 'バイヤー', subcategory: '正社員' },
      { location: '神奈川', category: '鑑定士' },
      
      // 愛知 combinations
      { location: '愛知', category: '買取' },
      { location: '愛知', category: '買取', subcategory: 'ブランド' },
      { location: '愛知', category: '買取', subcategory: 'アパレル' },
      { location: '愛知', category: '買取', subcategory: 'ジュエリー' },
      { location: '愛知', category: '買取', subcategory: '時計' },
      { location: '愛知', category: '買取', subcategory: '未経験' },
      { location: '愛知', category: '買取', subcategory: 'インセンティブ' },
      { location: '愛知', category: '買取', subcategory: '正社員' },
      { location: '愛知', category: 'バイヤー' },
      { location: '愛知', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '愛知', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '愛知', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '愛知', category: 'バイヤー', subcategory: '時計' },
      { location: '愛知', category: 'バイヤー', subcategory: '未経験' },
      { location: '愛知', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '愛知', category: 'バイヤー', subcategory: '正社員' },
      { location: '愛知', category: '鑑定士' },
      
      // 大阪 combinations
      { location: '大阪', category: '買取' },
      { location: '大阪', category: '買取', subcategory: 'ブランド' },
      { location: '大阪', category: '買取', subcategory: 'アパレル' },
      { location: '大阪', category: '買取', subcategory: 'ジュエリー' },
      { location: '大阪', category: '買取', subcategory: '時計' },
      { location: '大阪', category: '買取', subcategory: '未経験' },
      { location: '大阪', category: '買取', subcategory: 'インセンティブ' },
      { location: '大阪', category: '買取', subcategory: '正社員' },
      { location: '大阪', category: 'バイヤー' },
      { location: '大阪', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '大阪', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '大阪', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '大阪', category: 'バイヤー', subcategory: '時計' },
      { location: '大阪', category: 'バイヤー', subcategory: '未経験' },
      { location: '大阪', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '大阪', category: 'バイヤー', subcategory: '正社員' },
      { location: '大阪', category: '鑑定士' },
      
      // 福岡 combinations
      { location: '福岡', category: '買取' },
      { location: '福岡', category: '買取', subcategory: 'ブランド' },
      { location: '福岡', category: '買取', subcategory: 'アパレル' },
      { location: '福岡', category: '買取', subcategory: 'ジュエリー' },
      { location: '福岡', category: '買取', subcategory: '時計' },
      { location: '福岡', category: '買取', subcategory: '未経験' },
      { location: '福岡', category: '買取', subcategory: 'インセンティブ' },
      { location: '福岡', category: '買取', subcategory: '正社員' },
      { location: '福岡', category: 'バイヤー' },
      { location: '福岡', category: 'バイヤー', subcategory: 'ブランド' },
      { location: '福岡', category: 'バイヤー', subcategory: 'アパレル' },
      { location: '福岡', category: 'バイヤー', subcategory: 'ジュエリー' },
      { location: '福岡', category: 'バイヤー', subcategory: '時計' },
      { location: '福岡', category: 'バイヤー', subcategory: '未経験' },
      { location: '福岡', category: 'バイヤー', subcategory: 'インセンティブ' },
      { location: '福岡', category: 'バイヤー', subcategory: '正社員' },
      { location: '福岡', category: '鑑定士' }
    ];

    const locationCategoryPages = locationCategoryCombinations.map(combo => {
      let path = `/job-openings/${encodeURIComponent(combo.location)}/${encodeURIComponent(combo.category)}`;
      if (combo.subcategory) {
        path += `/${encodeURIComponent(combo.subcategory)}`;
      }
      return {
        path,
        priority: '0.8',
        changefreq: 'daily'
      };
    });

    // 4. General category pages (without location)
    const generalCategoryPages = [
      { path: '/job-openings/買取/ブランド', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/買取/アパレル', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/買取/ジュエリー', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/買取/時計', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/買取/未経験', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/買取/インセンティブ', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/買取/正社員', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/ブランド', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/アパレル', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/ジュエリー', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/時計', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/未経験', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/インセンティブ', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/バイヤー/正社員', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/鑑定士/未経験', priority: '0.7', changefreq: 'daily' },
      { path: '/job-openings/鑑定士/インセンティブ', priority: '0.7', changefreq: 'daily' }
    ];

    // 6. Get dynamic content
    let jobPages: any[] = [];
    let columnPages: any[] = [];
    let interviewPages: any[] = [];

    try {
      // Get jobs
      const jobsResponse = await getJobs(1, 1000, '', undefined, '0', undefined, undefined, [], [], 1, undefined, 0);
      if (jobsResponse.success && jobsResponse.data?.jobs) {
        jobPages = jobsResponse.data.jobs.map((job: any) => ({
          path: `/job-openings/recruit/${job.id}`,
          priority: '0.8',
          changefreq: 'daily',
          lastmod: new Date(job.created).toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching jobs for sitemap:', error);
    }

    try {
      // Get columns
      const columnsResponse = await getColumns({ page: 1, limit: 1000, is_published: true });
      if (columnsResponse.ColumnItems) {
        columnPages = columnsResponse.ColumnItems.map((column: any) => ({
          path: `/column/column-${column.id}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: new Date(column.created || column.modified || Date.now()).toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching columns for sitemap:', error);
    }

    try {
      // Get interviews
      const interviewsResponse = await getInterviews({ page: 1, limit: 1000 });
      if (interviewsResponse.InterviewItems) {
        interviewPages = interviewsResponse.InterviewItems.map((interview: any) => ({
          path: `/interview/${interview.tag === 1 ? 'career-changer' : 'business'}/${interview.id}`,
          priority: '0.6',
          changefreq: 'weekly',
          lastmod: new Date(interview.created || interview.modified || Date.now()).toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching interviews for sitemap:', error);
    }

    // 5. Combine all pages
    const allPages = [...staticPages, ...categoryPages, ...locationCategoryPages, ...generalCategoryPages, ...jobPages, ...columnPages, ...interviewPages];

    // 7. Generate comprehensive XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
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
    console.error('Error generating comprehensive sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}