"use client";

import { useNotificationContext } from './useNotificationContext';
import { useAuthContext } from './useAuthContext';

/**
 * Hook to handle application response notifications
 * This simulates notifications when companies respond to job seeker applications
 */
export function useApplicationResponse() {
  const { showApplicationResponseNotification, updateApplicationCount } = useNotificationContext();
  const { profile } = useAuthContext();

  /**
   * Simulate a company response to a job application
   * In a real app, this would be triggered by the backend when a company updates application status
   */
  const simulateApplicationResponse = (
    companyName: string,
    jobTitle: string,
    status: 'accepted' | 'rejected' | 'pending'
  ) => {
    // Only show notifications for job seekers
    if (profile?.role === 'jobseeker' || profile?.role === 'JobSeeker') {
      showApplicationResponseNotification(companyName, jobTitle, status);
      
      // Update application count (simulate increment)
      // In a real app, this would come from a real-time service like WebSocket
      updateApplicationCount(1);
    }
  };

  /**
   * Simulate multiple application responses (for testing)
   */
  const simulateMultipleResponses = () => {
    if (profile?.role === 'jobseeker' || profile?.role === 'JobSeeker') {
      // Simulate different types of responses
      setTimeout(() => {
        simulateApplicationResponse('株式会社ABC', 'バイヤー', 'accepted');
      }, 1000);
      
      setTimeout(() => {
        simulateApplicationResponse('XYZ商事', '店舗スタッフ', 'rejected');
      }, 3000);
      
      setTimeout(() => {
        simulateApplicationResponse('DEFリサイクル', '鑑定士', 'pending');
      }, 5000);
    }
  };

  return {
    simulateApplicationResponse,
    simulateMultipleResponses
  };
}

