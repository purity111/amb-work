// hooks/useAuth.ts
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface Profile {
    role: string;
    access?: string;
    business?: string;
    business_form?: number;
    capital_stock?: string;
    city?: string;
    clinic_name: "確認用"
    clinic_name_kana: "パスワード"
    closest_station?: string;
    created: string;
    customer_id?: string;
    deleted?: string;
    director_name?: string;
    email: string;
    employee_number?: number;
    establishment_year?: string;
    home_page_url?: string;
    id: number;
    modified: string;
    paying_status: number;
    prefectures: number;
    reset_token?: string;
    subscription_id?: number;
    subscription_regist_date?: string;
    subscription_release_date?: string;
    tel: string;
    token_expiry?: string;
    zip: string;
};

export function useAuth() {
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    });
    const [profile, setProfile] = useState<Profile | null>(null);
    const [formIsDirty, setFormIsDirty] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedToken = localStorage.getItem('token');
        const savedProfile = localStorage.getItem('profile');

        setToken(savedToken);

        if (!savedToken) {
            router.push('/')
        }

        if (savedProfile) {
            try {
                setProfile(JSON.parse(savedProfile));
            } catch (err) {
                console.error('Invalid profile JSON:', err);
                setProfile(null);
            }
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                setToken(e.newValue);
            }

            if (e.key === 'profile') {
                if (e.newValue) {
                    try {
                        setProfile(JSON.parse(e.newValue));
                    } catch {
                        setProfile(null);
                    }
                } else {
                    setProfile(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // save credentails after login
    const saveCredentails = (newToken: string, newProfile: any) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('profile', JSON.stringify(newProfile));
        setToken(newToken);
        setProfile(newProfile);
    }

    const saveFormStatus = (isDirty: boolean) => {
        setFormIsDirty(isDirty);
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setProfile(null);
        router.push('/')
    }

    return {
        token,
        profile,
        isAdmin: profile?.role === 'admin' || profile?.role === 'subadmin',
        isAuthenticated: !!token,
        logout,
        saveCredentails,
        saveFormStatus,
        formIsDirty
    };
}