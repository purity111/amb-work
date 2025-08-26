import LayoutWrapper from "./layoutWrapper";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-datepicker/dist/react-datepicker.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";
// 👇 Load Google Font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Tag Manager - Script in head */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-587ZVL5');`,
          }}
        />
        {/* End Google Tag Manager */}



        {/* Comprehensive favicon configuration to prevent flashing */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/favicon-180x180.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon-180x180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/favicon-180x180.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AMB" />
        {/* Preload favicon files for faster loading */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
        <link rel="preload" href="/favicon-32x32.png" as="image" type="image/png" />
        {/* Inline favicon as immediate fallback */}
        {/* <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" /> */}
        
        {/* Page Title and SEO */}
        <title>リユース転職｜買取・バイヤーの求人・転職はリユース業界専門サイト</title>
        <meta name="description" content="AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。" />
        <meta name="keywords" content="転職, 求人, キャリア, 就職, 仕事, 転職支援, キャリアコンサルティング, 求人情報" />
        <meta name="author" content="AMB" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amb.com/" />
        <meta property="og:title" content="リユース転職｜買取・バイヤーの求人・転職はリユース業界専門サイト" />
        <meta property="og:description" content="AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:site_name" content="AMB" />
        <meta property="og:locale" content="ja_JP" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://x.com/Reusetenshoku/" />
        <meta name="twitter:title" content="AMB - 転職支援サービス | あなたの次のキャリアチャンスを見つけましょう" />
        <meta name="twitter:description" content="AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。" />
        <meta name="twitter:image" content="/images/logo.png" />
        
        {/* Additional SEO */}
        <meta name="application-name" content="AMB" />
        <meta name="apple-mobile-web-app-title" content="AMB" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://amb.com/" />
        
        {/* External CSS for forms */}
        <link rel="stylesheet" type="text/css" href="https://my183p.com/p/format_css?item_id=gw7V0Ihn&format=div&form_align=&label_align=&radio_float=&checkbox_float=&label_width=0&input_width=0&theme_name=1_1&ver=3" />
        <link rel="stylesheet" type="text/css" href="https://my183p.com/p/mobile_css?item_id=gw7V0Ihn&format=div&form_align=&label_align=&radio_float=&checkbox_float=&label_width=0&input_width=0&theme_name=1_1&ver=3" />
        <link rel="stylesheet" type="text/css" href="https://my183p.com/css/form/myasp-ui-form.css?d=20250810224710" />
      </head>
      {/* 👇 Apply the custom font class to <body> */}
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-587ZVL5"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LayoutWrapper>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LayoutWrapper>
        
        {/* Google tag (gtag.js) - Script at bottom of body */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X2DZ02E2HE"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X2DZ02E2HE');
            `,
          }}
        />
      </body>
    </html>
  );
}
