export default function ToInquiryCta() {
    return (
        <div className="relative bg-[#1C7DBC] h-[182px] md:h-[290px] w-full">
            <div className="absolute inset-x-0 mx-auto w-fit inset-y-0 translate-y-1/2 -top-5/8">
                <h3 className="text-[31px] text-white font-bold text-center hidden md:block">
                    <span className="text-[#FCFBA4]">詳細の価格表</span>
                    はこちらからお問合せください
                </h3>
                <div className="text-[18px] text-white font-bold text-center md:hidden">
                    <h3 className="">
                        <span className="text-[#FCFBA4]">詳細の価格表</span>は<br />
                        こちらからお問合せください
                    </h3>
                </div>

                <a
                    href="#form"
                    aria-label="申請ボタン"
                    className="block w-[292px] md:w-[460px] h-[56px] md:h-[100px] bg-[url('/images/landing/CTA-btn.png')] bg-[length:100%_100%] bg-no-repeat bg-center mt-4 md:mt-[34px] active:scale-95 mx-auto"
                >
                </a>
            </div>
        </div>
    );
}


