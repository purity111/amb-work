import React, { useState } from "react";
import RegisterForEmployer from "./RegisterForEmployer";
import RegisterForJobSeeker from "./RegisterForJobSeeker";
import { toast } from "react-toastify";

interface RegisterModalProps {
    onClose: () => void;
    onSuccess: () => void;
    onNavigateLogin: () => void;
}

export default function RegisterModal({ onClose, onSuccess, onNavigateLogin }: RegisterModalProps) {
    const [roleIndex, setRoleIndex] = useState(2) // 1: Employer  2: Employee

    const onRegisterSuccess = () => {
        toast.success('登録完了! ログインしてください。');
        onSuccess();
    }

    return (
        <div className="relative flex flex-col bg-white rounded-lg border-none shadow-xl my-auto w-full max-h-3/4 max-w-3xl pt-6 pb-16 relative border-1 border-gray-700 overflow-hidden">
            <p className="text-center text-blue text-2xl">新規登録</p>
            <div className="flex flex-row mt-4">
                <p
                    className={`flex-1 text-lg border-b-2 cursor-pointer text-center py-2
                            ${roleIndex === 2 ? 'text-blue border-b-blue bg-gray-800' : 'text-gray-300 border-b-gray-300'}
                            `}
                    onClick={() => setRoleIndex(2)}
                >
                    求職者様
                </p>
                <p
                    className={`flex-1 text-lg border-b-2 cursor-pointer text-center py-2
                                    ${roleIndex === 1 ? 'text-blue border-b-blue bg-gray-800' : 'text-gray-300 border-b-gray-300'}
                                `}
                    onClick={() => setRoleIndex(1)}
                >
                    企業様
                </p>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto px-6">
                {roleIndex === 1 && (
                    <RegisterForEmployer onSuccess={onRegisterSuccess} />
                )}
                {roleIndex === 2 && (
                    <RegisterForJobSeeker onSuccess={onRegisterSuccess} />
                )}
            </div>
            <div className="pt-4 flex justify-center">
                <p className="text-[12px] underline text-blue cursor-pointer" onClick={onNavigateLogin}>ログインはこちら</p>
            </div>
            <button
                className="absolute top-1 right-2 w-10 h-10 font-bold text-2xl text-gray-500 hover:text-gray-300 rounded-full cursor-pointer"
                onClick={() => onClose()}
            >
                &times;
            </button>
        </div>
    );
}