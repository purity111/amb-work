import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isStaging = host.startsWith("app."); // app.reuse-tenshoku.com

  const prodRobots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/*",
    "Disallow: /admin/*",
    "Disallow: /mypage/*",
    "Disallow: /_next/*",
    "Disallow: /confirm-email",
    "Disallow: /email-change-success",
    "Disallow: /reset-password",
    "Disallow: /register/thanks",
    "Disallow: /contact/finish",
    "Disallow: /contact_corp_finish",
    "Disallow: /recruiter/finish",
    "",
    "Sitemap: https://reuse-tenshoku.com/api/sitemap",
    "Sitemap: https://reuse-tenshoku.com/api/sitemap/jobs",
    "Sitemap: https://reuse-tenshoku.com/api/sitemap/columns",
  ].join("\n");

  const stagingRobots = [
    "User-agent: *", 
    "Disallow: /",
    "",
    "# No sitemaps for staging environment"
  ].join("\n");

  return new Response(isStaging ? stagingRobots : prodRobots, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
