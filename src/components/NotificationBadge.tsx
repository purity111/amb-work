"use client";

import { useNotificationContext } from '@/hooks/useNotificationContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import { usePathname } from 'next/navigation';

interface NotificationBadgeProps {
  count: number;
  type: 'application' | 'message' | 'total';
  className?: string;
}

export default function NotificationBadge({ count, type, className = '' }: NotificationBadgeProps) {
  const { profile } = useAuthContext();
  const pathname = usePathname();

  // Show badges for all authenticated users (employers, admins, and job seekers)
  if (!profile || !profile.role) {
    return null;
  }

  // Don't show badge if count is 0
  if (count <= 0) {
    return null;
  }

  // Don't show application badge if on application management page
  if (type === 'application' && pathname === '/mypage/application_mng') {
    return null;
  }

  // Don't show message badge if on chat management page
  if (type === 'message' && pathname === '/mypage/chat_mng') {
    return null;
  }

  // For job seekers, show different badge logic
  if (profile.role === 'jobseeker' || profile.role === 'JobSeeker') {
    // Job seekers see application responses and messages
    if (type === 'application' && pathname === '/mypage/application_mng') {
      return null;
    }
    if (type === 'message' && pathname === '/mypage/chat_mng') {
      return null;
    }
  }

  return (
    <span className={`
      absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 
      flex items-center justify-center px-1 z-10 font-bold
      ${className}
    `}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

// Combined badge for header avatar (shows total count)
export function CombinedNotificationBadge() {
  const { counts } = useNotificationContext();
  const pathname = usePathname();

  // Don't show combined badge if on mypage (since individual badges will show in sidebar)
  if (pathname?.startsWith('/mypage')) {
    return null;
  }

  return (
    <NotificationBadge 
      count={counts.total} 
      type="total" 
      className="bg-red-600 min-w-[24px] h-6 text-sm"
    />
  );
}
