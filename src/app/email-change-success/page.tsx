"use client"

import Image from "next/image";

export default function EmailChangeSuccessPage() {

  const handleReLogin = () => {
    // Set flag to indicate logout should happen in profile page    
    try {
        window.close();
    } catch (error) {
        console.log('Could not close window:', error);
        // Fallback: redirect to home page
        window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
      <div className="mb-8">
        <Image
          src="/images/recruiter/message.png"
          alt="メール送信完了"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">メールアドレス変更リクエスト完了</h1>
      <p className="text-center mb-8">
        ご入力いただいたメールアドレス宛に確認メールを送信しました。<br />
        メール内のリンクをクリックして、メールアドレスの変更手続きを完了してください。
      </p>
      <button
        className="bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90"
        onClick={handleReLogin}
      >
        確認
      </button>
    </div>
  );
}
