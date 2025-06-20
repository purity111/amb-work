import { useAuthContext } from '@/app/layout';
import { useUnsavedChangesPrompt } from '@/hooks/useUnsavedChangesWarning';
import { BASE_URL } from '@/utils/config';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import Dialog from './Dialog';

// Export MenuItem type
export type MenuItem = {
  label: string;
  path?: string;
  icon?: string; // Optional icon path or name
};

// Move menuItemsByRole outside the component and export it
export const menuItemsByRole: Record<string, MenuItem[]> = {
  jobseeker: [
    { label: '応募管理', path: '/mypage/application_mng', icon: 'application.png' },
    { label: 'チャット管理', path: '/mypage/chat_mng', icon: 'chat.png' },
    { label: '気に入り', path: '/mypage/favourites', icon: 'star3.png' },
    { label: 'プロフィール', path: '/mypage/profile', icon: 'man1.png' },
    { label: 'ログアウト', path: '/logout', icon: 'logout.png' },
  ],
  employer: [
    { label: '求人管理', path: '/mypage/job_mng', icon: 'job.png' },
    { label: '応募管理', path: '/mypage/application_mng', icon: 'application.png' },
    { label: '応募者管理', path: '/mypage/applicant_mng', icon: 'applicants.png' },
    { label: 'チャット管理', path: '/mypage/chat_mng', icon: 'chat.png' },
    { label: 'プロフィール', path: '/mypage/profile', icon: 'man1.png' },
    { label: 'ログアウト', path: '/logout', icon: 'logout.png' },
  ],
  admin: [
    { label: '特徴', path: '/mypage/feature_mng', icon: 'feature.png' },
    { label: '募集条件', path: '/mypage/criteria_mng', icon: 'criteria.png' },
    { label: '求人管理', path: '/mypage/job_mng', icon: 'job.png' },
    { label: '応募管理', path: '/mypage/application_mng', icon: 'application.png' },
    { label: '応募者管理', path: '/mypage/applicant_mng', icon: 'applicants.png' },
    { label: '企業管理', path: '/mypage/company_mng', icon: 'company.png' },
    { label: 'チャット管理', path: '/mypage/chat_mng', icon: 'chat.png' },
    { label: 'プロフィール', path: '/mypage/profile', icon: 'man1.png' },
    { label: 'ログアウト', path: '/logout', icon: 'logout.png' },
  ],
  subadmin: [
    { label: '企業管理', path: '/mypage/company_mng', icon: 'company.png' },
    { label: 'プロフィール', path: '/mypage/profile', icon: 'man1.png' },
    { label: 'ログアウト', path: '/logout', icon: 'logout.png' },
  ],
};

// Add props for isOpen and setIsOpen
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { profile, isAuthenticated, logout } = useAuthContext();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoutModalShown, setLogoutModalShown] = useState(false)

  const { formIsDirty } = useAuthContext();
  const { navigate } = useUnsavedChangesPrompt(formIsDirty);

  useEffect(() => {
    setIsMounted(true); // Component is mounted on the client

    const handleResize = () => {
      const mobileStatus = window.innerWidth < 768;
      setIsMobile(mobileStatus);
    };

    // Only run handleResize and event listener if window is defined (client-side)
    if (typeof window !== 'undefined') {
      handleResize(); // Set initial state
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMounted]); // Dependency on isMounted for initial load

  // Only calculate menu items if mounted and profile role is available
  const menuItems = useMemo(() => {
    if (!isMounted || !profile?.role) {
      return [];
    }
    const roleKey = profile.role.toLowerCase();
    return menuItemsByRole[roleKey] || [];
  }, [isMounted, profile?.role]); // Depend on isMounted and profile.role

  // Don't render anything on the server or if not authenticated/no role/no menu items after mounted
  if (!isMounted || !isAuthenticated || !profile?.role || menuItems.length === 0) {
    // console.log('Sidebar Not Rendered:', { isMounted, isAuthenticated, hasRole: Boolean(profile?.role), menuItemsCount: menuItems.length });
    return null;
  }

  const goNavigation = (url: string) => {
    navigate(url);
    if (isMobile) setIsOpen(false)
  }

  const onClickLogout = () => {
    setLogoutModalShown(true)
  }

  const onConfirmLogout = () => {
    logout(); // Call logout function
    if (isMobile) setIsOpen(false); // Close sidebar on mobile
  }

  return (
    <>
      {/* Overlay for mobile - Render only if mounted and if mobile and open*/}
      {isMounted && isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-white opacity-60 bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Conditional classes based on isOpen, applied after mounted */}
      <aside
        className={`w-64 xl:w-80 h-[calc(100vh-80px)] z-20 bg-gray-300 fixed top-20 md:top-25 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Toggle Button - Positioned absolutely inside the sidebar - Render only after mounted */}
        {isMounted && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer absolute top-1/2 transform -translate-y-1/2 -right-5 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg"
            aria-label="Toggle Sidebar"
          >
            {/* SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
        <nav className="p-4 h-full overflow-y-auto">
          <p
            onClick={() => goNavigation(`${BASE_URL}/mypage`)}
            className='cursor-pointer text-white mx-auto my-6 text-[20px] text-center flex justify-center hover:text-blue'
          >
            マイページ
          </p>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                {item.path === '/logout' ? (
                  <button
                    onClick={onClickLogout}
                    className={`cursor-pointer flex items-center p-2 rounded-lg transition-colors text-base md:text-[18px] text-gray-700 hover:bg-red-500 w-full text-left`}
                    aria-label={item.label}
                  >
                    {/* Icon placeholder */}
                    {item.icon && (
                      <img
                        src={`/images/icons/${item.icon}`}
                        alt={item.label}
                        className="w-6 h-6 mr-3"
                      />
                    )}
                    {item.label}
                  </button>
                ) : (
                  <p
                    onClick={() => goNavigation(item.path as string)}
                    className={`cursor-pointer flex items-center p-2 rounded-lg transition-colors text-base md:text-[18px] ${pathname === item.path ? 'bg-blue-200 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`}
                  >
                    {/* Icon placeholder */}
                    {item.icon && (
                      <img
                        src={`/images/icons/${item.icon}`}
                        alt={item.label}
                        className="w-6 h-6 mr-3"
                      />
                    )}
                    {item.label}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {logoutModalShown && (
          <Dialog
            title="警告"
            description='本当にログアウトしますか?'
            onPressCancel={() => setLogoutModalShown(false)}
            onPressOK={onConfirmLogout}
            okButtonTitle='ログアウト'
          />
        )}
      </aside>
    </>
  );
} 