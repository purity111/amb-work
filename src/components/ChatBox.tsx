import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import CInput from "./common/Input";
import CButton from "./common/Button";
import { ChatItem } from "@/utils/types";
import { useAuthContext } from "@/app/layout";
import { useGetChatById } from "@/hooks/useGetChatById";
import Image from "next/image";
import { getImageFile, linkify } from "@/utils/helper";
import { UPLOADS_BASE_URL } from "@/utils/config";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface ChatBoxProps {
    data: ChatItem;
    onChange: () => void;
}

type Message = {
    id: number;
    chat_id: number;
    sender: number;
    body: string;
    created: string;
};

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://172.20.1.185:3000');

export default function ChatBox({ data, onChange }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [isNearBottom, setIsNearBottom] = useState(true)

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null)

    const { profile } = useAuthContext();
    const { data: chats, isLoading: cLoading, isError: cError, refetch } = useGetChatById(data.id)

    useEffect(() => {
        if (cLoading || cError || !chats?.data) return;
        setMessages(chats.data)
    }, [chats, cLoading, cError])

    useScrollPosition((scrollTop) => {
        const container = containerRef?.current
        if (!container) return
        setIsNearBottom(scrollTop > -200) // within 100px of bottom 
    }, [chats, containerRef.current], containerRef as RefObject<HTMLElement>)

    useEffect(() => {
        // :white_check_mark: Join the chat room
        socket.emit('join', data.id);
        // :white_check_mark: Listen for new messages
        socket.on('newMessage', (message: Message) => {
            refetch()
            onChange()
        });
        // :white_check_mark: Scroll to latest message
        return () => {
            socket.off('newMessage');
        };
    }, [data]);

    const isJobSeeker = useMemo(() => {
        if (profile?.role === 'JobSeeker') return true;
        return false;
    }, [profile])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    const handleSend = () => {
        if (!text.trim()) return;
        const newMessage = {
            chat_id: data.id,
            sender: isJobSeeker ? 1 : 2,
            body: text,
        };
        socket.emit('message', newMessage);
        setText('');
        scrollToBottom();
        onChange();
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="px-2 h-15 flex flex-row justify-between items-center border-b-1 border-gray-700">
                <div className="flex-1 flex flex-col">
                    <p className="">{isJobSeeker ? data.jobInfo.employer.clinic_name : data.jobSeeker.name}</p>
                    <p className="text-sm text-gray-600">Job: {data.job_title}</p>
                </div>
                <button className="p-2 hover:bg-gray-700 rounded-full transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-full transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
            <div ref={containerRef} className="flex-1 flex flex-col-reverse space-y-reverse space-y-2 overflow-y-auto p-4">
                <div ref={messagesEndRef} />
                {messages.map((msg) => {
                    let me = false;
                    if (isJobSeeker && msg.sender === 1) me = true;
                    if (!isJobSeeker && msg.sender === 2) me = true;
                    const seekerAvatar = data.jobSeeker.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(data.jobSeeker.avatar.entity_path)}` : '/images/default-avatar.jpg';
                    const employerAvatar = data.jobInfo.employer.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(data.jobInfo.employer.avatar.entity_path)}` : '/images/default-avatar.jpg';
                    return (
                        <div key={msg.id} className={`flex ${me ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                            {!me && (
                                <div className={`w-10 h-10 relative rounded-full overflow-hidden border-2 ${me ? 'border-blue' : 'border-green'}`}>
                                    {!me && <Image src={isJobSeeker ? employerAvatar : seekerAvatar} alt="chat-avatar" fill />}
                                </div>
                            )}
                            <div
                                className={`p-2 rounded-sm max-w-[70%] ${me ? 'bg-blue text-white' : 'bg-green text-black'}`}
                                dangerouslySetInnerHTML={{ __html: linkify(msg.body) }}
                            />
                        </div>
                    )
                })}

            </div>
            <div className="h-25 flex flex-row space-x-2 border-t-1 border-gray-700 p-2 mt-2">
                <CInput
                    placeholder="Type your message"
                    height="h-21"
                    wrapperClassName="flex-1 h-full"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    multiline
                />
                <CButton
                    onClick={handleSend}
                    text="Send"
                    className='border border-green text-white bg-green px-[10px] h-10'
                />
            </div>
            {!isNearBottom && (
                <div className="absolute bottom-26 right-5 bg-green p-2 rounded-full cursor-pointer" onClick={scrollToBottom}>
                    <Image src={'/svgs/arrow-down.svg'} width={24} height={24} alt="location-icon" />
                </div>
            )}
        </div>
    );
}