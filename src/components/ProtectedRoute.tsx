'use client'

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/app/layout';
import AuthModal from './modal/Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      // Set the redirect URL in the URL parameters
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.pathname + window.location.search;
        const loginUrl = `/?auth=login&redirectTo=${encodeURIComponent(currentUrl)}`;
        window.history.replaceState(null, '', loginUrl);
      }
      setShowLoginModal(true);
    }
  }, [isMounted, isAuthenticated]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    // Redirect to home page if user closes the modal
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
  };

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  // If authenticated, render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show login modal
  return (
    <>
      {showLoginModal && (
        <AuthModal
          initialStep="Login"
          onClose={handleCloseModal}
        />
      )}
      {/* Render children but they won't be visible due to the modal overlay */}
      {children}
    </>
  );
} 