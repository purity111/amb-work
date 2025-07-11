"use client";

import { useAuthContext } from "@/app/layout";
import CInput from "@/components/common/Input";
import CSelect from "@/components/common/Select";
import { useGetChats } from "@/hooks/useGetChats";
import { useGetJobs } from "@/hooks/useGetJobs";
import { UPLOADS_BASE_URL } from "@/utils/config";
import { formatTimeAgo, getImageFile } from "@/utils/helper";
import { ChatItem, JobDetail } from "@/utils/types";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Spinner from "@/components/common/Spinner";
import ChatBox from "@/components/ChatBox";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatMngPage() {
  const [nameSearch, setNameSearch] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(0);
  const [selectedJob, setSelectedJob] = useState<number>(0)
  const { profile } = useAuthContext();

  const searchParams = useSearchParams();
  const hasLoaded = useRef(false);
  const router = useRouter()
  const { data, isLoading: jLoading, isError: jError } = useGetJobs({
    page: 1,
    limit: 999999,
    employer_id: profile?.id
  })
  const { data: chats, isLoading: cLoading, refetch } = useGetChats();

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
    }))
    return [{ value: 0, option: 'All' }, ...options]
  }, [data])

  useEffect(() => {
    if (!jobList.length) return;
    const resizer = document.getElementById('resizer')!;
    const leftPane = document.getElementById('leftPane')!;
    let isDragging = false;

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

  const renderApplications = () => {
    if (cLoading) return <Spinner />
    if (!chats?.data || chats?.data?.length === 0) return <p>No applications</p>
    return chats.data.map((i: ChatItem) => {
      if (!i.jobSeeker) return null;
      if (selectedJob > 0 && i.job_info_id !== selectedJob) return null;
      if (!i.jobSeeker.name.toLowerCase().includes(nameSearch.toLowerCase())) return null;
      const avatarUrl = i.jobSeeker.avatar ? `${UPLOADS_BASE_URL}/${getImageFile(i.jobSeeker.avatar.entity_path)}` : '/images/default-avatar.jpg';
      return (
        <div
          className={`w-full max-w-full flex flex-row items-center p-2 hover:bg-gray-800 cursor-pointer
            ${selectedChatId === i.id ? 'bg-gray-700' : 'transparent'}
            `}
          key={i.id}
          onClick={() => onSelectChat(i)}
        >
          <div className="min-w-15 w-15 h-15 relative">
            <Image src={avatarUrl} alt="avatar" className="rounded-full" fill />
          </div>
          <div className="w-[100px] flex-1 pl-2">
            <div className="flex flex-col lg:flex-row justify-between">
              <p className="flex-1">{i.jobSeeker.name}</p>
              <p className="text-[12px] text-gray-600">{formatTimeAgo(new Date(i.lastMessageTime))}</p>
            </div>
            <p className="truncate whitespace-nowrap overflow-hidden">{i.messages?.[0]?.body || 'No messages'}</p>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-6">チャット管理ページ(Chat Management Page)</h1>
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
        <div id="container" className="flex h-[calc(100vh-300px)] border-1 border-gray-700 rounded-lg mt-4 relative w-full">
          <div id="leftPane" className="flex flex-col min-w-[200px] max-w-[500px]">
            <div className="p-2 h-15 flex flex-row items-center border-b-1 border-gray-700">
              <CInput
                placeholder="検索"
                height="h-10"
                wrapperClassName="flex-1"
                value={nameSearch}
                onChange={onChangeNameSearch}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderApplications()}
            </div>
          </div>
          <div
            id="resizer"
            className="w-[1px] bg-gray-700 hover:bg-gray-400 cursor-col-resize"
          ></div>
          <div className="flex-1">
            {chatData && <ChatBox data={chatData} onChange={refetch} />}
          </div>
        </div>
      )}
    </div >
  );
}

