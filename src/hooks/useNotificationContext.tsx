"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useAuthContext } from './useAuthContext';
import { toast } from 'react-toastify';

interface NotificationCounts {
  applications: number;
  messages: number;
  total: number;
}

interface NotificationContextType {
  counts: NotificationCounts;
  updateApplicationCount: (count: number) => void;
  updateMessageCount: (count: number) => void;
  incrementMessageCount: (increment?: number) => void;
  clearApplicationCount: () => void;
  clearMessageCount: () => void;
  clearAllCounts: () => void;
  showApplicationNotification: (applicantName: string, jobTitle: string) => void;
  showMessageNotification: (senderName: string) => void;
  showApplicationResponseNotification: (companyName: string, jobTitle: string, status: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuthContext();
  const [counts, setCounts] = useState<NotificationCounts>({
    applications: 0,
    messages: 0,
    total: 0
  });

  // Update total count whenever applications or messages change
  useEffect(() => {
    setCounts(prev => ({
      ...prev,
      total: prev.applications + prev.messages
    }));
  }, [counts.applications, counts.messages]);

  // Load saved counts from localStorage on mount
  useEffect(() => {
    if (profile?.id) {
      const savedCounts = localStorage.getItem(`notification_counts_${profile.id}`);
      if (savedCounts) {
        try {
          const parsed = JSON.parse(savedCounts);
          // For job seekers, don't load application counts (they shouldn't see badges for their own applications)
          if (profile?.role === 'jobseeker' || profile?.role === 'JobSeeker') {
            setCounts({
              applications: 0, // Always 0 for job seekers
              messages: parsed.messages || 0,
              total: parsed.messages || 0
            });
            // Also clear any existing application count in localStorage for job seekers
            if (parsed.applications > 0) {
              const cleanedCounts = {
                applications: 0,
                messages: parsed.messages || 0,
                total: parsed.messages || 0
              };
              localStorage.setItem(`notification_counts_${profile.id}`, JSON.stringify(cleanedCounts));
            }
          } else {
            setCounts(parsed);
          }
        } catch (error) {
          console.error('Error parsing saved notification counts:', error);
        }
      }
    }
  }, [profile?.id, profile?.role]);

  // Save counts to localStorage whenever they change
  useEffect(() => {
    if (profile?.id && (counts.applications > 0 || counts.messages > 0)) {
      // For job seekers, don't save application counts
      if (profile?.role === 'jobseeker' || profile?.role === 'JobSeeker') {
        const jobSeekerCounts = {
          applications: 0, // Always 0 for job seekers
          messages: counts.messages,
          total: counts.messages
        };
        localStorage.setItem(`notification_counts_${profile.id}`, JSON.stringify(jobSeekerCounts));
      } else {
        localStorage.setItem(`notification_counts_${profile.id}`, JSON.stringify(counts));
      }
    }
  }, [counts, profile?.id, profile?.role]);

  const updateApplicationCount = useCallback((count: number) => {
    // Don't update application counts for job seekers
    if (profile?.role === 'jobseeker' || profile?.role === 'JobSeeker') {
      return;
    }
    
    setCounts(prev => ({
      ...prev,
      applications: Math.max(0, count)
    }));
  }, [profile?.role]);

  const updateMessageCount = useCallback((count: number) => {
    setCounts(prev => ({
      ...prev,
      messages: Math.max(0, count)
    }));
  }, []);

  const incrementMessageCount = useCallback((increment: number = 1) => {
    setCounts(prev => ({
      ...prev,
      messages: Math.max(0, prev.messages + increment)
    }));
  }, []);

  const clearApplicationCount = useCallback(() => {
    // Always clear application count for everyone
    setCounts(prev => ({
      ...prev,
      applications: 0
    }));
  }, []);

  const clearMessageCount = useCallback(() => {
    setCounts(prev => ({
      ...prev,
      messages: 0
    }));
  }, []);

  const clearAllCounts = useCallback(() => {
    setCounts({
      applications: 0,
      messages: 0,
      total: 0
    });
    if (profile?.id) {
      localStorage.removeItem(`notification_counts_${profile.id}`);
    }
  }, [profile?.id]);

  const showApplicationNotification = useCallback((applicantName: string, jobTitle: string) => {
    console.log('🔔 showApplicationNotification called:', { applicantName, jobTitle, profileRole: profile?.role });
    
    // Only show notifications to employers, admins, and subadmins
    // Do not show notifications to job seekers when they apply for jobs
    if (profile?.role === 'employer' || profile?.role === 'admin' || profile?.role === 'subadmin') {
      // Show application notification with applicant name
      const message = `${applicantName}さんから応募がありました。`;
      
      console.log('🔔 Showing application toast:', message);
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      console.log('🔔 Application toast notification displayed');
    } else {
      console.log('🔔 Not showing notification - user role:', profile?.role);
    }
    // For job seekers, do nothing - no notification when they apply for jobs
  }, [profile?.role]);

  const showMessageNotification = useCallback((senderName: string) => {
    console.log('showMessageNotification called:', { senderName, profileRole: profile?.role });
    console.log('Toast object available:', typeof toast, toast);
    
    // Check if this is a combined login notification (contains "件の" or "があります")
    const isLoginNotification = senderName.includes('件の') || senderName.includes('があります');
    
    let message;
    if (isLoginNotification) {
      // For login notifications, show simple format
      message = `お知らせ：${senderName}`;
    } else {
      // Different messages for employers vs job seekers for regular notifications
      message = profile?.role === 'employer' || profile?.role === 'admin' || profile?.role === 'subadmin'
        ? `新しいメッセージ: ${senderName}さんからメッセージが届きました`
        : `新しいメッセージ: ${senderName}からメッセージが届きました`;
    }
    
    console.log('Showing toast message:', message);
    console.log('About to call toast.info...');
    
    try {
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log('toast.info called successfully');
    } catch (error) {
      console.error('Error calling toast.info:', error);
    }
  }, [profile?.role]);

  // New function for company responses to applications
  const showApplicationResponseNotification = useCallback((companyName: string, jobTitle: string, status: string) => {
    const statusText = status === 'accepted' ? '採用' : status === 'rejected' ? '不採用' : '検討中';
    toast.info(`応募結果: ${companyName}から「${jobTitle}」の応募結果（${statusText}）が届きました`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const value: NotificationContextType = useMemo(() => ({
    counts,
    updateApplicationCount,
    updateMessageCount,
    incrementMessageCount,
    clearApplicationCount,
    clearMessageCount,
    clearAllCounts,
    showApplicationNotification,
    showMessageNotification,
    showApplicationResponseNotification
  }), [
    counts,
    updateApplicationCount,
    updateMessageCount,
    incrementMessageCount,
    clearApplicationCount,
    clearMessageCount,
    clearAllCounts,
    showApplicationNotification,
    showMessageNotification,
    showApplicationResponseNotification
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
