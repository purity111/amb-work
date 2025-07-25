import React, { Suspense, useState } from "react";
import RegisterModal from "./Register";
import LoginModal from "./Login";
import { useRouter } from "next/navigation";

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

    const onLoginSuccess = () => {
        // client-side reload only
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get('redirectTo');
            if (redirectTo) {
                router.push(redirectTo);
                onClose()
            } else {
                window.location.reload();
            }
        }
    }

    const onRegisterSuccess = () => {
        setStep('Login');
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