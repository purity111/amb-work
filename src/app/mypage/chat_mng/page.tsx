"use client";

import { io, Socket } from 'socket.io-client';
import { useAuthContext } from "@/app/layout";
import CInput from "@/components/common/Input";
import CSelect from "@/components/common/Select";
import { useGetChats } from "@/hooks/useGetChats";
import { useGetJobs } from "@/hooks/useGetJobs";
import { UPLOADS_BASE_URL } from "@/utils/config";
import { formatTimeAgo, getImageFile } from "@/utils/helper";
import { ChatItem, JobDetail, Message } from "@/utils/types";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Spinner from "@/components/common/Spinner";
import ChatBox from "@/components/ChatBox";
import { useRouter, useSearchParams } from "next/navigation";
import useWindowSize from '@/hooks/useWindowSize';

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://172.20.1.185:3000');

export default function ChatMngPage() {
  const [nameSearch, setNameSearch] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(0);
  const [selectedJob, setSelectedJob] = useState<number>(0)
  const [leftPaneExpanded, setLeftPaneExpanded] = useState(false);
  const { profile } = useAuthContext();

  const searchParams = useSearchParams();
  const [width] = useWindowSize();
  const hasLoaded = useRef(false);
  const router = useRouter()
  const { data, isLoading: jLoading } = useGetJobs(profile?.role === 'admin' ? {
    page: 1,
    limit: 999999,
    agency: 2
  } : {
    page: 1,
    limit: 999999,
    employer_id: profile?.id
  })
  const { data: chats, isLoading: cLoading, refetch } = useGetChats();

  const isJobSeeker = useMemo(() => {
    if (profile?.role === 'JobSeeker') return true;
    return false;
  }, [profile])

  useEffect(() => {
    if (width < 600) {
      setLeftPaneExpanded(false);
    } else {
      setLeftPaneExpanded(true);
    }
  }, [width])

  useEffect(() => {
    if (!profile) return;
    const roomId = profile.role === 'admin' ? 'chat_admin' : `${isJobSeeker ? 1 : 2}_${profile.id}`;
    // Join the room
    socket.emit('notify_join', roomId);
    // Define the handler
    const handleNewMessage = (message: Message) => {
      console.log('notify', { message });
      refetch();
    };
    // Remove any existing listener (precaution)
    socket.off('newMessage', handleNewMessage);
    socket.on('newMessage', handleNewMessage);
    // Cleanup
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [profile, isJobSeeker]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const jobId = params.get('jobID');
    const chatId = params.get('chatID');
    setSelectedJob(Number(jobId) || 0);
    setSelectedChatId(Number(chatId) || 0)
    hasLoaded.current = true;
  }, [searchParams])

  useEffect(() => {
    if (!hasLoaded.current) return;
    const params = new URLSearchParams();
    params.set('jobID', selectedJob.toString())
    params.set('chatID', selectedChatId.toString())
    router.push(`?${params.toString()}`);
  }, [selectedChatId, selectedJob])

  const jobList = useMemo(() => {
    if (!data?.data) return []
    const options = data.data.jobs.map((i: JobDetail) => ({
      value: i.id,
      option: i.job_title
    }));
    console.log(options);
    
    return [{ value: 0, option: 'すべて' }, ...options]
  }, [data])

  useEffect(() => {
    if (!jobList.length) return;
    const resizer = document.getElementById('resizer')!;
    const leftPane = document.getElementById('leftPane')!;
    let isDragging = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const startDrag = (e: MouseEvent) => {
      isDragging = true;
      document.body.style.cursor = 'col-resize';
    };

    const stopDrag = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    };

    const onDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const containerOffsetLeft = document.getElementById('container')!.offsetLeft;
      const newLeftWidth = e.clientX - containerOffsetLeft;
      if (newLeftWidth > 200 && newLeftWidth < 500) {
        leftPane.style.width = `${newLeftWidth}px`;
      }
    };

    resizer.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', onDrag);

    return () => {
      resizer.removeEventListener('mousedown', startDrag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('mousemove', onDrag);
    };
  }, [jobList]);

  const chatData = useMemo(() => {
    return chats?.data?.find((i: ChatItem) => i.id === selectedChatId)
  }, [chats, selectedChatId])

  const onSelectJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJob(Number(e.target.value));
    setSelectedChatId(0);
    setNameSearch('');
  };

  const onChangeNameSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setNameSearch(e.target.value);
  }

  const onSelectChat = (chatData: ChatItem) => {
    setSelectedChatId(chatData.id)
  }

  const getLastMessage = (msg: ChatItem) => {
    if (msg.messages?.[0]?.deleted) return '[メッセージが削除されました]'
    else return msg.messages?.[0]?.body || 'No messages'
  }

  const renderApplications = () => {
    if (cLoading) return <Spinner />
    if (!chats?.data || chats?.data?.length === 0) return <p>No applications</p>
    return chats.data.map((i: ChatItem) => {
      if (!i.jobSeeker) return null;
      if (selectedJob > 0 && i.job_info_id !== selectedJob) return null;
      if (!i.jobSeeker.name.toLowerCase().includes(nameSearch.toLowerCase())) return null;
      const seekerAvatar = i.jobSeeker.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(i.jobSeeker.avatar.entity_path)}` : '/images/default-avatar.jpg';
      const employerAvatar = i.jobInfo.employer.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(i.jobInfo.employer.avatar.entity_path)}` : '/images/default-company.png';
      return (
        <div
          className={`w-full max-w-full flex flex-row items-center p-2 hover:bg-gray-800 cursor-pointer h-20
            ${selectedChatId === i.id ? 'bg-gray-700' : 'transparent'}
            `}
          key={i.id}
          onClick={() => onSelectChat(i)}
        >
          <div className="min-w-15 w-15 h-15 relative">
            <Image src={isJobSeeker ? employerAvatar : seekerAvatar} alt="avatar" className="rounded-full" fill />
            {i.unreadCount > 0 && (
              <div className="absolute top-0 left-0 bg-red rounded-full w-6 h-6 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] text-white">{i.unreadCount > 99 ? '99+' : i.unreadCount}</span>
              </div>
            )}
          </div>
          {leftPaneExpanded && (
            <div className="w-[100px] flex-1 pl-2">
              <div className="flex flex-col lg:flex-row justify-between">
                <p className="flex-1">{isJobSeeker ? i.jobInfo.employer.clinic_name : i.jobSeeker.name}</p>
                <p className="text-[12px] text-gray-600">{formatTimeAgo(new Date(i.lastMessageTime))}</p>
              </div>
              <p className="truncate whitespace-nowrap overflow-hidden text-sm">{getLastMessage(i)}</p>
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col p-2 md:p-5 w-[95%] max-w-[1200px] mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6">チャット管理ページ</h1> */}
      {jLoading ? <p>Loading...</p> : (
        <CSelect
          options={jobList}
          value={selectedJob}
          onChange={onSelectJob}
          className="h-[40px]"
          width="w-60"
        />
      )}
      {jobList.length > 0 && (
        <div
          id="container"
          className={`
          bg-white flex h-[78vh] border-1 border-gray-700 rounded-lg mt-4 relative w-full overflow-hidden
          pl-20 sm:pl-0
          `}
        >
          <div
            id="leftPane"
            className={`
              absolute left-0 border-r-1 border-gray-600 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.2)] duration-500 ${leftPaneExpanded ? 'w-60' : 'w-20'}
              sm:static sm:w-fit sm:border-none sm:shadow-none flex flex-col bg-white h-full sm:min-w-[200px] max-w-[500px] z-10
            `}
          >
            <div className="p-2 h-15 flex flex-row justify-center items-center border-b-1 border-gray-700">
              {leftPaneExpanded && (
                <CInput
                  placeholder="検索"
                  height="h-10"
                  wrapperClassName="flex-1"
                  value={nameSearch}
                  onChange={onChangeNameSearch}
                />
              )}
              <div className='sm:hidden p-2 bg-white rounded-full mx-2 hover:bg-gray-700'>
                <Image
                  src={'/svgs/arrow-down.svg'}
                  onClick={() => setLeftPaneExpanded(!leftPaneExpanded)}
                  className={`${leftPaneExpanded ? 'rotate-90' : '-rotate-90'} duration-500 cursor-pointer`}
                  width={24}
                  height={24}
                  alt="location-icon"
                />
              </div>
            </div>
            <div className={`flex-1 overflow-y-auto overflow-x-hidden `}>
              {renderApplications()}
            </div>
          </div>
          <div
            id="resizer"
            className="w-[1px] bg-gray-700 hover:bg-gray-400 cursor-col-resize"
          ></div>
          <div className="flex-1 overflow-x-hidden">
            {chatData && <ChatBox data={chatData} onChange={refetch} />}
          </div>
        </div>
      )}
    </div >
  );
}

