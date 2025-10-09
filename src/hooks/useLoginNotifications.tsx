"use client";

import { useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNotificationContext } from './useNotificationContext';
import { useGetApplicants } from './useGetApplicants';
import { useGetChats } from './useGetChats';

/**
 * Hook to load and display existing unread notifications on login
 * This shows toast notifications for unread messages and applications when user logs in
 */
export function useLoginNotifications() {
  const { profile } = useAuthContext();
  const { showApplicationNotification, showMessageNotification, updateApplicationCount, updateMessageCount } = useNotificationContext();
  const hasShownNotifications = useRef(false);

  // Debug: Check if notification functions are available
  console.log('useLoginNotifications initialized:', {
    profile: profile?.role,
    hasShowApplicationNotification: typeof showApplicationNotification === 'function',
    hasShowMessageNotification: typeof showMessageNotification === 'function',
    hasUpdateApplicationCount: typeof updateApplicationCount === 'function',
    hasUpdateMessageCount: typeof updateMessageCount === 'function'
  });

  // Fetch applications for all users
  const { data: applicationsData } = useGetApplicants({
    page: 1,
    limit: 100,
    profile,
    searchTerm: '',
    jobType: undefined
  });

  // Fetch chats for all users
  const { data: chatsData } = useGetChats();

  useEffect(() => {
    console.log('useLoginNotifications effect triggered:', { 
      profileId: profile?.id, 
      profileRole: profile?.role,
      hasShownNotifications: hasShownNotifications.current,
      applicationsDataLoaded: !!applicationsData,
      chatsDataLoaded: !!chatsData
    });
    
    // Only run once per login session and ensure all required data is available
    if (!profile?.id || hasShownNotifications.current) {
      console.log('Skipping login notifications:', { 
        noProfile: !profile?.id, 
        alreadyShown: hasShownNotifications.current
      });
      return;
    }

    // Ensure data is available before proceeding
    if (!applicationsData || !chatsData) {
      console.log('Waiting for data:', {
        hasApplicationsData: !!applicationsData,
        hasChatsData: !!chatsData
      });
      return;
    }

    // Add a small delay to ensure the UI is ready
    const timer = setTimeout(() => {
      console.log('Starting login notification check...');
      let applicationCount = 0;
      let messageCount = 0;

      // Check for applications - only show notifications for applications TO the current user (not FROM them)
      console.log('Applications data structure:', { applicationsData, success: applicationsData?.success, data: applicationsData?.data });
      
      if (applicationsData?.success && applicationsData.data?.applications) {
        const applications = applicationsData.data.applications;
        
        console.log('Applications array:', applications);
        
        // Filter applications based on user role AND unread status:
        // - For employers: show UNREAD applications TO their company
        // - For job seekers: DO NOT show their own applications (no badges/toasts when they apply)
        const relevantApplications = applications.filter((application: any) => {
          let isRelevant = false;
          let isUnread = false;
          
          if (profile?.role === 'employer' || profile?.role === 'admin' || profile?.role === 'subadmin') {
            let isRelevant = false;
            
            if (profile?.role === 'employer') {
              // For employers: only show applications where they are the recipient
              isRelevant = application.jobInfo?.employer_id === profile.id;
            } else if (profile?.role === 'admin' || profile?.role === 'subadmin') {
              // For admins: show applications for agent jobs or where they are the employer
              // Agent jobs are identified by job_detail_page_template_id === 2
              const isAgentJob = application.jobInfo?.job_detail_page_template_id === 2;
              const isToCurrentAdmin = application.jobInfo?.employer_id === profile.id;
              
              // Show applications for agent jobs OR where admin is the employer
              isRelevant = isAgentJob || isToCurrentAdmin;
            }
            
            // For all recipients: only show applications that were created AFTER their last login
            const lastLoginTime = localStorage.getItem(`lastLoginTime_${profile.id}`);
            const applicationCreatedTime = new Date(application.created);
            
            if (lastLoginTime) {
              // Only show applications created after last login
              isUnread = applicationCreatedTime > new Date(lastLoginTime);
            } else {
              // If no last login time, only show applications from today
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              isUnread = applicationCreatedTime > today;
            }
            
            console.log(`Application ${application.id}: employer_id=${application.jobInfo?.employer_id}, currentUser=${profile.id}, isRelevant=${isRelevant}, isUnread=${isUnread}, lastLoginTime=${lastLoginTime}, created=${application.created}, jobTemplate=${application.jobInfo?.job_detail_page_template_id}`);
          } else if (profile?.role === 'jobseeker' || profile?.role === 'JobSeeker') {
            // For job seekers: DO NOT show notifications for their own applications
            // Only show notifications for application responses from companies
            // (This would be handled by a different system for company responses)
            isRelevant = false; // Don't show job seeker's own applications
            isUnread = false;
            
            console.log(`Application ${application.id}: Skipping job seeker's own application (no notification needed)`);
          }
          
          return isRelevant && isUnread;
        });
        
        applicationCount = relevantApplications.length;
        console.log('Relevant application count:', applicationCount);
      }

      // Check for unread messages (for all users) - use backend's unreadCount
      console.log('Chats data structure:', { chatsData, success: chatsData?.success, data: chatsData?.data });
      
      if (chatsData?.success && chatsData.data) {
        // The data structure might be chatsData.data directly, not chatsData.data.chats
        const chats = Array.isArray(chatsData.data) ? chatsData.data : (chatsData.data.chats || []);
        
        console.log('Chats array:', chats);
        
        // Use the backend's unreadCount field instead of manually counting messages
        messageCount = chats.reduce((total: number, chat: any) => {
          const chatUnreadCount = chat.unreadCount || 0;
          console.log(`Chat ${chat.id} unreadCount:`, chatUnreadCount);
          return total + chatUnreadCount;
        }, 0);
        
        console.log('Total opponent message count:', messageCount);
      }

      // Show combined notification if there are any unread items
      if (messageCount > 0 || applicationCount > 0) {
        console.log('Showing combined notification:', { messageCount, applicationCount });
        
        // Build combined message
        const messageParts = [];
        if (messageCount > 0) {
          messageParts.push(`${messageCount}件の未読メッセージがあります`);
        }
        if (applicationCount > 0) {
          messageParts.push(`応募が${applicationCount}件あります`);
        }
        
        const combinedMessage = messageParts.join('、') + '。';
        
        // Use showMessageNotification to display the combined message
        showMessageNotification(combinedMessage);
        
        // Update counts - only for employers/admins, not for job seekers
        if (applicationCount > 0 && (profile?.role === 'employer' || profile?.role === 'admin' || profile?.role === 'subadmin')) {
          updateApplicationCount(applicationCount);
        }
        if (messageCount > 0) {
          updateMessageCount(messageCount);
        }
      } else {
        console.log('No unread items found');
      }

      // Mark that we've shown notifications for this session
      hasShownNotifications.current = true;
      
      console.log('Login notifications loaded:', {
        applicationCount,
        messageCount,
        profile: profile?.role
      });
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [
    profile?.id, 
    profile?.role, 
    applicationsData, 
    chatsData, 
    showApplicationNotification, 
    showMessageNotification, 
    updateApplicationCount, 
    updateMessageCount
  ]);

  // Reset the flag when user changes (logout/login)
  useEffect(() => {
    if (!profile?.id) {
      hasShownNotifications.current = false;
    }
  }, [profile?.id]);

  // Expose test function to manually trigger login notification
  useEffect(() => {
    if (typeof window !== 'undefined' && profile?.id) {
      (window as any).testLoginNotification = () => {
        console.log('🧪 Manual login notification test');
        console.log('🧪 Applications data:', applicationsData);
        console.log('🧪 Chats data:', chatsData);
        console.log('🧪 Has shown notifications:', hasShownNotifications.current);
        
        // Force reset the flag
        hasShownNotifications.current = false;
        
        // Manually count
        let messageCount = 0;
        let applicationCount = 0;
        
        if (chatsData?.success && chatsData.data) {
          const chats = Array.isArray(chatsData.data) ? chatsData.data : (chatsData.data.chats || []);
          messageCount = chats.reduce((total: number, chat: any) => total + (chat.unreadCount || 0), 0);
        }
        
        if (applicationsData?.success && applicationsData.data?.applications) {
          applicationCount = applicationsData.data.applications.length;
        }
        
        console.log('🧪 Counts:', { messageCount, applicationCount });
        
        if (messageCount > 0 || applicationCount > 0) {
          const messageParts = [];
          if (messageCount > 0) {
            messageParts.push(`${messageCount}件の未読メッセージがあります`);
          }
          if (applicationCount > 0) {
            messageParts.push(`応募が${applicationCount}件あります`);
          }
          const combinedMessage = messageParts.join('、') + '。';
          console.log('🧪 Showing notification:', combinedMessage);
          showMessageNotification(combinedMessage);
        } else {
          console.log('🧪 No unread items to show');
        }
      };
      
      (window as any).resetLoginNotificationFlag = () => {
        hasShownNotifications.current = false;
        console.log('🧪 Reset hasShownNotifications flag');
      };
      
      console.log('🧪 Login notification test functions exposed:');
      console.log('  - window.testLoginNotification() - Manually trigger login notification');
      console.log('  - window.resetLoginNotificationFlag() - Reset the shown flag');
    }
  }, [profile?.id, applicationsData, chatsData, showMessageNotification]);

}
