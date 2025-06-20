interface DialogProps {
    title: string;
    description: string;
    preview?: React.ReactNode;
    okButtonTitle?: string;
    okButtonColor?: string;
    onPressOK: () => void;
    onPressCancel: () => void;
}

export default function Dialog({
    title,
    description,
    preview,
    okButtonTitle = 'Yes',
    okButtonColor,
    onPressOK,
    onPressCancel
}: DialogProps) {
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 w-screen bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-[20px] md:text-[24px] font-semibold text-center text-blue" id="modal-title">{title}</h3>
                                <div className="my-2">
                                    <p className="text-sm text-gray-500">{description}</p>
                                </div>
                                <div className="max-h-120 overflow-y-auto">
                                    {preview}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={onPressOK}
                                className={`
                                    cursor-pointer inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs opacity-90 hover:opacity-100 sm:ml-3 sm:w-auto
                                    ${okButtonColor || 'bg-red-600'}
                                `}
                            >
                                {okButtonTitle}
                            </button>
                            <button type="button" onClick={onPressCancel} className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-400 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-100 sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}