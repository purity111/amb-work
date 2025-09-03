import React, { Suspense, useState } from "react";
import RegisterModal from "./Register";
import LoginModal from "./Login";
import { useRouter } from "next/navigation";
import { Profile } from "@/hooks/useAuth";

interface RegisterModalProps {
    initialStep: 'Login' | 'Register';
    onClose: () => void;
    jobId?: number | null;
}

export default function AuthModal({ initialStep, onClose, jobId }: RegisterModalProps) {
    const [step, setStep] = useState<'Login' | 'Register'>(initialStep);
    const router = useRouter();

    const onNavigateLogin = () => {
        setStep('Login');
    }

    const onNavigateRegister = () => {
        setStep('Register');
    }

    const onLoginSuccess = (profile: Profile) => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get('redirectTo');
            const currentPath = window.location.pathname || '';
            const isOnJobOpenings = currentPath.startsWith('/job-openings');
            onClose()
            
            // If jobId is provided and user is a JobSeeker, redirect to the specific job detail page
            if (jobId && profile.role === 'JobSeeker') {
                router.push(`/job-openings/recruit/${jobId}`);
                return;
            }
            
            // Special handling for job-openings and its child pages
            if (isOnJobOpenings && profile.role === 'JobSeeker') {
                if (profile?.service_content) {
                    // service_content = 1 → stay on the current job-openings page
                    return;
                } else {
                    // service_content = null → redirect to career counseling
                    router.push('/career-counseling');
                    return;
                }
            }

            if (redirectTo) {
                router.push(redirectTo);
            } else if (profile.role !== 'JobSeeker') {
                router.push('/mypage');
            } else if (profile?.service_content) {
                router.push('/mypage');
            } else {
                router.push('/career-counseling')
            }

        }
    }

    const onRegisterSuccess = () => {
        onClose();
    }

    return (
        <Suspense>
            <div
                className="fixed inset-0 z-[9999] flex  justify-center bg-gray-300/80"
            >
                {step === 'Register' && (
                    <RegisterModal
                        onClose={onClose}
                        onSuccess={onRegisterSuccess}
                        onNavigateLogin={onNavigateLogin}
                    />
                )}
                {step === 'Login' && (
                    <LoginModal
                        onClose={onClose}
                        onSuccess={onLoginSuccess}
                        onNavigateRegister={onNavigateRegister}
                    />
                )}
            </div>
        </Suspense>
    );
}