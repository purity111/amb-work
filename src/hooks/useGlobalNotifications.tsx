"use client";

import { useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNotificationContext } from './useNotificationContext';
import { useLoginNotifications } from './useLoginNotifications';
import { getChats } from '@/lib/api';

/**
 * Global notification hook
 * Polls for new chat messages and shows real-time toast notifications
 */
export function useGlobalNotifications() {
  const { profile } = useAuthContext();
  const { showMessageNotification, updateMessageCount } = useNotificationContext();
  
  // Load existing unread notifications on login
  useLoginNotifications();
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdsRef = useRef<{ [chatId: number]: number }>({});

  useEffect(() => {
    console.log('💬 useGlobalNotifications: Setting up chat polling');
    
    if (!profile || !profile.id) {
      console.log('💬 No profile, skipping chat polling');
      return;
    }

    console.log('💬 Profile loaded:', { id: profile.id, role: profile.role });

    const isJobSeeker = profile.role === 'jobseeker' || profile.role === 'JobSeeker';

    const pollForNewMessages = async () => {
      try {
        const response = await getChats();
        const chats = response?.data || [];
        
        console.log('💬 Poll response - Total chats:', chats.length);

        let totalUnreadCount = 0;

        chats.forEach((chat: any) => {
          const chatId = chat.id;
          const messages = chat.messages || [];
          const unreadCount = chat.unreadCount || 0;
          
          totalUnreadCount += unreadCount;

          if (messages.length === 0) return;

          // Get the latest message
          const latestMessage = messages[messages.length - 1];
          const latestMessageId = latestMessage.id;
          
          // Check if this is a new message
          const lastSeenMessageId = lastMessageIdsRef.current[chatId];
          
          // Determine if the message is from the opponent (not from current user)
          const currentUserSender = isJobSeeker ? 1 : 2;
          const isFromOpponent = latestMessage.sender !== currentUserSender;

          console.log('💬 Chat', chatId, '- Latest message:', {
            messageId: latestMessageId,
            lastSeen: lastSeenMessageId,
            sender: latestMessage.sender,
            currentUserSender,
            isFromOpponent,
            isNew: lastSeenMessageId && latestMessageId > lastSeenMessageId
          });

          // If this is the first time, just initialize
          if (!lastSeenMessageId) {
            lastMessageIdsRef.current[chatId] = latestMessageId;
            return;
          }

          // If there's a new message from opponent, show notification
          if (latestMessageId > lastSeenMessageId && isFromOpponent) {
            console.log('✅ New message detected in chat', chatId);

            // Determine sender name
            let senderName = '';
            if (latestMessage.sender === 1) {
              senderName = chat.jobSeeker?.name || '求職者';
            } else if (latestMessage.sender === 2) {
              if (isJobSeeker) {
                senderName = chat.jobInfo?.employer?.clinic_name || '企業';
              } else {
                senderName = '管理者';
              }
            }

            console.log('💬 Showing toast for new message from:', senderName);
            showMessageNotification(senderName);

            // Update the last seen message ID
            lastMessageIdsRef.current[chatId] = latestMessageId;
          } else if (latestMessageId > lastSeenMessageId) {
            // Update last seen even if it's our own message
            lastMessageIdsRef.current[chatId] = latestMessageId;
          }
        });

        // Update the message badge count
        console.log('💬 Total unread messages:', totalUnreadCount);
        updateMessageCount(totalUnreadCount);

      } catch (error) {
        console.error('❌ Error polling for messages:', error);
      }
    };

    // Expose testing function
    if (typeof window !== 'undefined') {
      (window as any).testChatPolling = pollForNewMessages;
      (window as any).resetChatTracker = () => {
        lastMessageIdsRef.current = {};
        console.log('🧪 Reset chat message tracker');
      };
      console.log('💬 Test functions exposed:');
      console.log('  - window.testChatPolling() - Manually trigger chat poll');
      console.log('  - window.resetChatTracker() - Reset message tracker');
    }

    // Initial poll after 2 seconds
    const initialTimeout = setTimeout(() => {
      console.log('💬 Running initial chat poll...');
      pollForNewMessages();
    }, 2000);

    // Poll every 3 seconds
    console.log('💬 Setting up chat polling interval: every 3 seconds');
    pollingIntervalRef.current = setInterval(() => {
      pollForNewMessages();
    }, 3000);

    // Cleanup
    return () => {
      console.log('💬 Cleaning up chat polling');
      clearTimeout(initialTimeout);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [profile?.id, profile?.role, showMessageNotification, updateMessageCount]);
}
