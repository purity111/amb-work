import CButton from "./common/Button";

export default function JobListAndSupportSection() {
    return (
        <div className='py-25 border-t border-t-gray-700'>
            <p className='text-3xl contact-title text-center relative font-bold text-gray-300'>求人情報・転職支援サービス</p>
            <div className='flex flex-col items-center md:flex-row justify-center pt-15 gap-6'>
                <CButton
                    text="求人情報はこちら"
                    className='bg-green text-white w-90'
                    hasNavIcon
                />
                <CButton
                    text="転職支援サービス（無料）はこちら"
                    className='bg-orange text-white w-90'
                    hasNavIcon
                />
            </div>
        </div>
    );
}

