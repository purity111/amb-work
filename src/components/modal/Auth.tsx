import React, { Suspense, useState } from "react";
import RegisterModal from "./Register";
import LoginModal from "./Login";
import { useRouter } from "next/navigation";
import { Profile } from "@/hooks/useAuth";

interface RegisterModalProps {
    initialStep: 'Login' | 'Register';
    onClose: () => void;
}

export default function AuthModal({ initialStep, onClose }: RegisterModalProps) {
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
            onClose()
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