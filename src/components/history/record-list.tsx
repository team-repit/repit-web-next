"use client";

import { RecordItem } from "@/apis/calendar/calendar.type";
import { useRouter } from "next/navigation";

interface RecordListProps {
  records: RecordItem[];
}
export default function RecordList({ records }: RecordListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {records.map((record) => (
        <div
          key={record.recordId}
          className="flex flex-col gap-[6px] px-7 py-[25px] border border-gray-300 rounded-[15px] cursor-pointer bg-gray-100 hover:bg-gray-50"
          onClick={() => router.push(`/record/${record.recordId}`)} // 상세 분석 페이지로 이동
        >
          <p className="subheadline-03-bold">{record.exercise_type}</p>
          <p className="body-02-regular text-gray-500">
            {new Date(record.start_time).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
