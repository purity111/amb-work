"use client";

import { useAuthContext } from '@/app/layout';
import LinkButton from "@/components/LinkButton";
import { useMemo } from 'react';
import { menuItemsByRole, MenuItem } from '@/components/Sidebar';

export default function MyPage() {
  const { profile, logout } = useAuthContext();

  const menuItems = useMemo(() => {
    if (!profile?.role) {
      return [];
    }
    const lowerCaseRole = profile.role.toLowerCase();
    return menuItemsByRole[lowerCaseRole] || [];
  }, [profile?.role]);

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-6">My Page</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item: MenuItem) => (
          item.path === '/logout' ? (
            <button
              key={item.path}
              onClick={() => logout()}
              className="border border-red-600 text-black hover:bg-red-600 hover:text-white px-6 py-3 rounded-lg text-base md:text-[18px] flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
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
            <LinkButton
              key={item.path}
              text={item.label}
              to={item.path}
              icon={item.icon}
              className="border border-blue-600 text-black hover:bg-blue-600 px-6 py-3"
            />
          )
        ))}
      </div>
    </div >
  );
}

