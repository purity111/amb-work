'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface PageTitleProps {
  title: string;
  description?: string;
  keywords?: string;
}

export default function PageTitle({ title, description, keywords }: PageTitleProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
    
    // Update meta keywords if provided
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }
  }, [title, description, keywords]);

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Head>
  );
}
