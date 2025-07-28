import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import CInput from "./common/Input";
import CButton from "./common/Button";
import { ChatItem, Message } from "@/utils/types";
import { useAuthContext } from "@/app/layout";
import { useGetChatById } from "@/hooks/useGetChatById";
import Image from "next/image";
import { formatMessageDate, getImageFile, linkify } from "@/utils/helper";
import { CHAT_UPLOADS_BASE_URL, UPLOADS_BASE_URL } from "@/utils/config";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import Spinner from "./common/Spinner";
import { useReadChatById } from "@/hooks/useReadChatById";
import { differenceInMinutes } from "date-fns";
import Dialog from "./Dialog";
import { useMutation } from "@tanstack/react-query";
import { uploadChatFile } from "@/lib/api";
import { toast } from "react-toastify";

interface ChatBoxProps {
    data: ChatItem;
    hasHideButton?: boolean;
    isHidden?: boolean;
    onChange: () => void;
    onToggleHidden?: () => void;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://172.20.1.185:3000');

export default function ChatBox({ data, hasHideButton = false, isHidden, onToggleHidden, onChange }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [isNearBottom, setIsNearBottom] = useState(true)
    const [deleteMessage, setDeleteMessage] = useState<Message | null>(null)
    const [editMessage, setEditMessage] = useState<Message | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [attached, setAttached] = useState<File | null>(null);
    const [isFileUploading, setIsFileUploading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null)

    const { profile } = useAuthContext();
    const { data: chats, isLoading: cLoading, isError: cError, refetch } = useGetChatById(data.id)
    const { refetch: markAsRead } = useReadChatById(data.id)

    const uploadFile = useMutation({
        mutationFn: uploadChatFile,
    });

    useEffect(() => {
        if (isNearBottom) {
            markAsRead();
            onChange();
        }
    }, [isNearBottom, messages])

    useEffect(() => {
        if (cLoading || cError || !chats?.data) return;
        setMessages(chats.data)
        setTimeout(() => {
            scrollToBottom();
        }, 500)
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        socket.on('newMessage', (message: Message) => {
            refetch()
            onChange()
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        socket.on('messageUpdated', (message: Message) => {
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

    const notifyToId = useMemo(() => {
        if (data.agency === 1) return 'chat_admin'
        return `${isJobSeeker ? 2 : 1}_${isJobSeeker ? data.jobInfo.employer_id : data.job_seeker_id}`
    }, [isJobSeeker, data])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    const handleCancelEdit = () => {
        setEditMessage(null);
        setIsEditing(false);
        setText('');
    }

    const handleSend = async () => {
        if (!text.trim() && !attached) return;
        if (isEditing) {
            if (!editMessage) return;
            socket.emit('editMessage', {
                messageId: editMessage.id,
                newBody: text,
                notifyTo: notifyToId
            });
            setIsEditing(false);
            setEditMessage(null);
            refetch();
        } else {
            // if file attached, upload it first
            if (attached) {
                try {
                    const formData = new FormData();
                    formData.append('file', attached);
                    setIsFileUploading(true);
                    const res = await uploadFile.mutateAsync(formData);
                    if (res.success) {
                        const newMessage = {
                            chat_id: data.id,
                            sender: isJobSeeker ? 1 : 2,
                            body: text,
                            notifyTo: notifyToId,
                            file_name: res.fileName,
                            file_path: getImageFile(res.filePath)
                        };
                        socket.emit('message', newMessage);
                        scrollToBottom();
                        setAttached(null);
                    } else if (res.message) {
                        toast.error(res.message);
                    } else {
                        throw Error()
                    }
                    setIsFileUploading(false);
                } catch (err) {
                    toast.error('メッセージを転送できません。再度試してください。');
                    console.log(err)
                    return;
                }
            } else {
                const newMessage = {
                    chat_id: data.id,
                    sender: isJobSeeker ? 1 : 2,
                    body: text,
                    notifyTo: notifyToId
                };
                socket.emit('message', newMessage);
            }
        }
        setText('');
        onChange();
    };

    const seekerAvatar = useMemo(() => {
        return data.jobSeeker?.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(data.jobSeeker.avatar.entity_path)}` : '/images/default-avatar.jpg';
    }, [data]);

    const employerAvatar = useMemo(() => {
        return data.jobInfo.employer?.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(data.jobInfo.employer.avatar.entity_path)}` : '/images/default-company.png';
    }, [])

    const onClickEditMessage = (msg: Message) => {
        setEditMessage(msg);
        setIsEditing(true);
        setText(msg.body);
    }

    const onClickDeleteMessage = (msg: Message) => {
        setDeleteMessage(msg);
    }

    const onConfirmDeleteMessage = () => {
        if (!deleteMessage) return;
        socket.emit('deleteMessage', { messageId: deleteMessage.id, notifyTo: notifyToId });
        setDeleteMessage(null);
        refetch();
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttached(file);
        }
    };

    const renderBubbleContent = (msg: Message) => {
        return (
            <>
                {msg.created !== msg.modified && <p className="text-[10px] italic text-gray-700">(Edited)</p>}
                <div
                    dangerouslySetInnerHTML={{ __html: linkify(msg.body) }}
                />
                {msg.file_path && msg.file_name.endsWith('.pdf') && (
                    <div className="mt-2">
                        <a
                            href={`${CHAT_UPLOADS_BASE_URL}/${msg.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-gray-100 text-blue-600 border rounded hover:bg-gray-700"
                        >
                            📄 {msg.file_name}
                        </a>
                    </div>
                )}
                {msg.file_path &&
                    msg.file_name.match(/\.(jpe?g|png|gif|webp)$/i) && (
                        <div className="mt-2">
                            <a
                                href={`${CHAT_UPLOADS_BASE_URL}/${msg.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block max-w-xs rounded overflow-hidden border hover:opacity-90 transition"
                            >
                                <img
                                    src={`${CHAT_UPLOADS_BASE_URL}/${msg.file_path}`}
                                    alt={msg.file_name}
                                    className="w-full h-auto object-cover rounded"
                                />
                            </a>
                        </div>
                    )}
            </>
        )
    }

    return (
        <div className={`flex flex-col relative h-full`}>
            <div className="px-2 min-h-[60px] flex flex-row justify-between items-center border-b-1 border-gray-700 ">
                <div className="flex-1 flex flex-col overflow-x-hidden">
                    <p>{isJobSeeker ? data.jobInfo.employer.clinic_name : data.jobSeeker.name}</p>
                    <p className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">Job: {data.job_title}</p>
                </div>
                {hasHideButton && (
                    <button className="p-2 hover:bg-gray-700 w-8 h-8 flex justify-center items-center rounded-full transition relative" onClick={onToggleHidden}>
                        {isHidden && <Image src={'/images/message_bubble.png'} width={20} height={20} alt="チャットアバター" />}
                        {!isHidden && <span>-</span>}
                    </button>
                )}
            </div>
            <div ref={containerRef} className="flex-1 flex flex-col-reverse space-y-reverse overflow-y-auto p-4 border-b-1 border-gray-700">
                {cLoading && <div className="flex-1 flex justify-center items-center"><Spinner /></div>}
                <div ref={messagesEndRef} />
                {messages.map((msg, index) => {

                    let me = false, showMessageDate = true, editable = true;
                    if (isJobSeeker && msg.sender === 1) me = true;
                    if (!isJobSeeker && msg.sender === 2) me = true;
                    if (differenceInMinutes(new Date(), new Date(msg.created)) > 60) editable = false;
                    if (msg.sender === messages[index - 1]?.sender && formatMessageDate(new Date(msg.created)) === formatMessageDate(new Date(messages[index - 1]?.created))) showMessageDate = false;

                    return (
                        <div key={msg.id} className={`flex ${me ? 'flex-row-reverse' : 'flex-row'} space-x-2 p-1 rounded-sm ${msg.id === editMessage?.id ? 'bg-gray-800' : 'bg-transparent'}`}>
                            {!me && (
                                <div className={`w-10 h-10 relative rounded-full overflow-hidden border-2 ${me ? 'border-blue' : 'border-green'}`}>
                                    {!me && <Image src={isJobSeeker ? employerAvatar : seekerAvatar} alt="チャットアバター" fill />}
                                </div>
                            )}
                            <div className={`flex flex-col max-w-[70%] ${me ? 'items-end' : 'items-start'}`}>
                                {msg.deleted ? (
                                    <div className={`p-2 rounded-sm relative ${me ? 'bg-blue text-white' : 'bg-green text-black'}`}>
                                        <span className="italic text-gray-700">メッセージが削除されました</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-row">
                                        {me && (
                                            <div className="flex flex-row pr-2">
                                                {editable && (
                                                    <div className="w-4 h-4 relative cursor-pointer mr-2" onClick={() => onClickEditMessage(msg)}>
                                                        <Image src={'/images/icons/edit.png'} alt="チャットアバター" fill />
                                                    </div>
                                                )}
                                                <div className="w-3 h-4 relative cursor-pointer" onClick={() => onClickDeleteMessage(msg)}>
                                                    <Image src={'/images/icons/del.png'} alt="チャットアバター" fill />
                                                </div>
                                                {/* <button className="block px-4 py-2 hover:bg-gray-100 text-left" onClick={() => onClickDeleteMessage(msg)}>Delete</button> */}
                                            </div>
                                        )}
                                        <div className={`p-2 rounded-sm relative ${me ? 'bg-blue text-white' : 'bg-green text-black'}`}>
                                            {renderBubbleContent(msg)}
                                        </div>
                                    </div>
                                )}
                                {showMessageDate && <p className="text-[10px] text-gray-600">{formatMessageDate(new Date(msg.created))}</p>}
                            </div>

                        </div>
                    )
                })}
            </div>
            {attached && (
                <div className="flex flex-row items-center px-4 bg-gray-700">
                    <p className="flex-1">File attached: {attached.name}</p>
                    <button className="text-gray-600 hover:text-black text-xl font-bold" onClick={() => setAttached(null)}>&times;</button>
                </div>
            )}
            <div className="sm:hidden p-2 pb-0">
                <CInput
                    placeholder="テキストを入力してください。"
                    height="h-21"
                    wrapperClassName="flex-1 h-full"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    multiline
                />
            </div>
            <div className="flex flex-row space-x-2 p-2 pt-0 sm:pt-2">
                <label
                    htmlFor="file-upload"
                    className="p-2 h-fit rounded-full hover:bg-gray-700"
                >
                    <Image
                        src={'/images/attach.png'}
                        className={`cursor-pointer`}
                        width={24}
                        height={24}
                        alt="location-icon"
                    />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                />
                <CInput
                    placeholder="テキストを入力してください..."
                    height="h-21"
                    wrapperClassName="flex-1 h-full"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    multiline
                    className="flex-1 hidden sm:block"
                />
                <div className="flex flex-row space-x-2 sm:flex-col sm:space-y-1 sm:space-x-0">
                    <CButton
                        disabled={isFileUploading}
                        onClick={handleSend}
                        text={isFileUploading ? 'アップロード中...' : isEditing ? '更新' : "送信"}
                        className='text-white bg-green px-[10px] h-10'
                    />
                    {isEditing && (
                        <CButton
                            onClick={handleCancelEdit}
                            text={'キャンセル'}
                            className='border border-green text-green px-[10px] h-10'
                        />
                    )}
                </div>
            </div>
            {!isNearBottom && (
                <div className="absolute bottom-26 right-5 bg-green p-2 rounded-full cursor-pointer" onClick={scrollToBottom}>
                    <Image src={'/svgs/arrow-down.svg'} width={24} height={24} alt="location-icon" />
                </div>
            )}
            {deleteMessage && (
                <Dialog
                    title="警告"
                    description='本当に削除しますか?'
                    onPressCancel={() => setDeleteMessage(null)}
                    onPressOK={onConfirmDeleteMessage}
                    okButtonTitle='削除'
                    preview={(
                        <div className="p-2 border-1 rounded-md bg-gray-800 border-gray-600">
                            {renderBubbleContent(deleteMessage)}
                        </div>
                    )}
                />
            )}
        </div>
    );
}