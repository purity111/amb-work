import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '登録完了 | リユース転職',
    description: 'ご登録ありがとうございます。登録確認メールをお送りしました。',
};

export default function RegisterThanksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
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

            {children}
        </>
    );
}
