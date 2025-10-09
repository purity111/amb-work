"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNotificationContext } from './useNotificationContext';
import { useAuthContext } from './useAuthContext';

/**
 * Hook to automatically clear notification counts when visiting relevant pages
 * This ensures badges are cleared when user visits the application or chat management pages
 */
export function useNotificationCleanup() {
  const pathname = usePathname();
  const { profile } = useAuthContext();
  const { clearApplicationCount } = useNotificationContext();

  useEffect(() => {
    // Run for all authenticated users (employers, admins, and job seekers)
    if (!profile || !profile.role) {
      return;
    }

    // Clear application count when visiting application management page
    if (pathname === '/mypage/application_mng') {
      clearApplicationCount();
    }

    // Note: We DON'T clear message count when visiting chat_mng page anymore
    // Instead, we'll update it dynamically based on actual unread counts
  }, [pathname, profile?.role, clearApplicationCount]);
}
